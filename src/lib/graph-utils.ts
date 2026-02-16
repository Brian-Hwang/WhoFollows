import { ShowData, GraphData, GraphNode, GraphLink } from './types';

const LINK_STYLES: Record<GraphLink['type'], { color: string; width: number; dashed: boolean }> = {
  'follow':           { color: '#ff6b35', width: 2.5, dashed: false },
  'mutual-follow':    { color: '#94a3b8', width: 0.5, dashed: false },
  'non-follow':       { color: '#ef4444', width: 2,   dashed: true  },
  'ex-couple':        { color: '#f59e0b', width: 1.5, dashed: true  },
  'final-couple':     { color: '#ef4444', width: 3,   dashed: false },
  'confirmed-couple': { color: '#ef4444', width: 3,   dashed: false },
  'not-together':     { color: '#6b7280', width: 1.5, dashed: true  },
};

export const CIRCLE_RADIUS = 250;

/**
 * Relationship-aware circular ordering using greedy nearest-neighbor + 2-opt.
 * Builds weighted adjacency (relationships=high, one-way follows=medium),
 * then optimizes placement so strongly-related people sit adjacent on the circle.
 */
function computeRelationshipOrder(nodes: GraphNode[], show: ShowData): GraphNode[] {
  const nodeIds = nodes.map(n => n.id);
  const idSet = new Set(nodeIds);

  const weights = new Map<string, number>();
  const edgeKey = (a: string, b: string) => [a, b].sort().join('::');

  const REL_WEIGHTS: Record<string, number> = {
    'confirmed-couple': 10,
    'final-couple': 8,
    'ex-couple': 6,
    'not-together': 4,
  };

  for (const rel of show.relationships) {
    if (!idSet.has(rel.source) || !idSet.has(rel.target)) continue;
    const key = edgeKey(rel.source, rel.target);
    const w = REL_WEIGHTS[rel.type] || 2;
    weights.set(key, (weights.get(key) || 0) + w);
  }

  const followSet = new Set(show.follows.map(f => `${f.source}->${f.target}`));
  for (const f of show.follows) {
    if (!idSet.has(f.source) || !idSet.has(f.target)) continue;
    if (!followSet.has(`${f.target}->${f.source}`)) {
      const key = edgeKey(f.source, f.target);
      weights.set(key, (weights.get(key) || 0) + 3);
    }
  }

  // Greedy nearest-neighbor: start from most-connected node, always pick heaviest neighbor
  const totalWeight = new Map<string, number>();
  for (const id of nodeIds) {
    let sum = 0;
    for (const otherId of nodeIds) {
      if (otherId !== id) sum += weights.get(edgeKey(id, otherId)) || 0;
    }
    totalWeight.set(id, sum);
  }

  const sorted = [...nodeIds].sort((a, b) => (totalWeight.get(b) || 0) - (totalWeight.get(a) || 0));
  const ordered: string[] = [sorted[0]];
  const used = new Set([sorted[0]]);

  while (ordered.length < nodeIds.length) {
    const last = ordered[ordered.length - 1];
    let bestId = '';
    let bestWeight = -1;

    for (const id of nodeIds) {
      if (used.has(id)) continue;
      const w = weights.get(edgeKey(last, id)) || 0;
      if (w > bestWeight) {
        bestWeight = w;
        bestId = id;
      }
    }

    if (bestWeight <= 0) {
      for (const id of nodeIds) {
        if (used.has(id)) continue;
        const w = totalWeight.get(id) || 0;
        if (w > bestWeight || bestId === '') {
          bestWeight = w;
          bestId = id;
        }
      }
    }

    ordered.push(bestId);
    used.add(bestId);
  }

  // 2-opt: swap pairs to minimize total weighted circular distance
  const n = ordered.length;
  const posOf = (id: string) => ordered.indexOf(id);
  const circDist = (i: number, j: number) => {
    const d = Math.abs(i - j);
    return Math.min(d, n - d);
  };

  const calcCost = () => {
    let cost = 0;
    for (const [key, w] of weights) {
      const [a, b] = key.split('::');
      const pa = posOf(a);
      const pb = posOf(b);
      if (pa >= 0 && pb >= 0) cost += w * circDist(pa, pb);
    }
    return cost;
  };

  let improved = true;
  let iterations = 0;
  while (improved && iterations < 100) {
    improved = false;
    iterations++;
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const before = calcCost();
        [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
        const after = calcCost();
        if (after < before) {
          improved = true;
        } else {
          [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
        }
      }
    }
  }

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  return ordered.map(id => nodeMap.get(id)!);
}

function assignCircularPositions(nodes: GraphNode[], show: ShowData): void {
  const ordered = computeRelationshipOrder(nodes, show);

  ordered.forEach((node, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / ordered.length;
    node.fx = Math.cos(angle) * CIRCLE_RADIUS;
    node.fy = Math.sin(angle) * CIRCLE_RADIUS;
  });
}

function makeEdgeKey(a: string, b: string): string {
  return [a, b].sort().join('::');
}

/**
 * Compute focus-mode positions: focused node at center, others in a circle around it.
 * Returns a map of nodeId → { fx, fy }.
 */
export function computeFocusPositions(
  nodes: GraphNode[],
  focusedNodeId: string,
  radius: number = CIRCLE_RADIUS,
): Map<string, { fx: number; fy: number }> {
  const positions = new Map<string, { fx: number; fy: number }>();
  const others = nodes.filter(n => n.id !== focusedNodeId);

  positions.set(focusedNodeId, { fx: 0, fy: 0 });

  others.forEach((node, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / others.length;
    positions.set(node.id, {
      fx: Math.cos(angle) * radius,
      fy: Math.sin(angle) * radius,
    });
  });

  return positions;
}

export function buildGraphData(show: ShowData): GraphData {
  const followingCounts = new Map<string, number>();
  const followersCounts = new Map<string, number>();
  for (const f of show.follows) {
    followingCounts.set(f.source, (followingCounts.get(f.source) || 0) + 1);
    followersCounts.set(f.target, (followersCounts.get(f.target) || 0) + 1);
  }

  const nodes: GraphNode[] = show.cast.map((member) => ({
    ...member,
    val: 3,
    followingCount: followingCounts.get(member.id) || 0,
    followersCount: followersCounts.get(member.id) || 0,
  }));

  assignCircularPositions(nodes, show);

  const links: GraphLink[] = [];

  const followSet = new Set<string>();
  for (const f of show.follows) {
    followSet.add(`${f.source}->${f.target}`);
  }

  // Track which directed follows have been processed into links
  const processedFollows = new Set<string>();

  // Process follows: detect mutual vs one-way
  for (const f of show.follows) {
    const forwardKey = `${f.source}->${f.target}`;
    const reverseKey = `${f.target}->${f.source}`;

    if (processedFollows.has(forwardKey)) continue;

    const isMutual = followSet.has(reverseKey);

    if (isMutual) {
      // Mark both directions as processed
      processedFollows.add(forwardKey);
      processedFollows.add(reverseKey);

      const style = LINK_STYLES['mutual-follow'];
      links.push({
        source: f.source,
        target: f.target,
        type: 'mutual-follow',
        color: style.color,
        width: style.width,
        dashed: style.dashed,
      });
    } else {
      processedFollows.add(forwardKey);

      const style = LINK_STYLES['follow'];
      links.push({
        source: f.source,
        target: f.target,
        type: 'follow',
        color: style.color,
        width: style.width,
        dashed: style.dashed,
      });
    }
  }

  // Non-follow links: show missing follow directions as red dashed "✗" lines.
  // 3 cases: neither follows, only B→A exists (missing A→B), only A→B exists (missing B→A).
  const nodeIds = nodes.map(n => n.id);
  const nonFollowStyle = LINK_STYLES['non-follow'];
  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 1; j < nodeIds.length; j++) {
      const a = nodeIds[i];
      const b = nodeIds[j];
      const aFollowsB = followSet.has(`${a}->${b}`);
      const bFollowsA = followSet.has(`${b}->${a}`);

      if (!aFollowsB && !bFollowsA) {
        links.push({
          source: a, target: b, type: 'non-follow',
          color: nonFollowStyle.color, width: nonFollowStyle.width,
          dashed: nonFollowStyle.dashed, label: '✗',
        });
      } else if (!aFollowsB && bFollowsA) {
        links.push({
          source: a, target: b, type: 'non-follow',
          color: nonFollowStyle.color, width: nonFollowStyle.width,
          dashed: nonFollowStyle.dashed, label: '✗',
        });
      } else if (aFollowsB && !bFollowsA) {
        links.push({
          source: b, target: a, type: 'non-follow',
          color: nonFollowStyle.color, width: nonFollowStyle.width,
          dashed: nonFollowStyle.dashed, label: '✗',
        });
      }
    }
  }

  // Process relationships as additional overlay links
  for (const rel of show.relationships) {
    const style = LINK_STYLES[rel.type];
    if (!style) continue;

    links.push({
      source: rel.source,
      target: rel.target,
      type: rel.type,
      color: style.color,
      width: style.width,
      dashed: style.dashed,
      label: rel.label,
    });
  }

  // Assign curvature to parallel edges between the same node pair
  const edgeGroups = new Map<string, number[]>();
  for (let i = 0; i < links.length; i++) {
    const key = makeEdgeKey(links[i].source, links[i].target);
    const group = edgeGroups.get(key);
    if (group) {
      group.push(i);
    } else {
      edgeGroups.set(key, [i]);
    }
  }

  for (const indices of edgeGroups.values()) {
    if (indices.length <= 1) continue;

    // Spread parallel edges with symmetric curvature around 0
    const count = indices.length;
    const spacing = 0.3;
    const offset = ((count - 1) * spacing) / 2;

    for (let i = 0; i < count; i++) {
      links[indices[i]].curvature = i * spacing - offset;
    }
  }

  return { nodes, links };
}
