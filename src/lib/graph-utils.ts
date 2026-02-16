import { ShowData, GraphData, GraphNode, GraphLink } from './types';

const LINK_STYLES: Record<GraphLink['type'], { color: string; width: number; dashed: boolean }> = {
  'follow':           { color: '#64748b', width: 1,   dashed: false },
  'mutual-follow':    { color: '#94a3b8', width: 2,   dashed: false },
  'ex-couple':        { color: '#f59e0b', width: 1.5, dashed: true  },
  'final-couple':     { color: '#ef4444', width: 3,   dashed: false },
  'confirmed-couple': { color: '#ef4444', width: 3,   dashed: false },
  'not-together':     { color: '#6b7280', width: 1.5, dashed: true  },
};

function makeEdgeKey(a: string, b: string): string {
  return [a, b].sort().join('::');
}

export function buildGraphData(show: ShowData): GraphData {
  const nodes: GraphNode[] = show.cast.map((member) => ({
    ...member,
    val: 3,
  }));

  const links: GraphLink[] = [];

  // Build a set of follow directions for quick lookup
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
