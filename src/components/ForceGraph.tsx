'use client';

import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import type { GraphData, GraphNode, GraphLink } from '@/lib/types';
import { computeFocusPositions, CIRCLE_RADIUS } from '@/lib/graph-utils';
import { useI18n } from '@/lib/i18n';

interface ForceGraphProps {
  graphData: GraphData;
  onNodeClick: (node: GraphNode) => void;
  onBackgroundClick: () => void;
  selectedNodeId: string | null;
  focusedNodeId: string | null;
  showFollows: boolean;
  showNonFollows: boolean;
  showRelationships: boolean;
}

// Extract node id from a link endpoint (handles both string ids and
// resolved node-object refs that react-force-graph-2d substitutes at runtime).
function linkNodeId(endpoint: string | GraphNode | { id: string }): string {
  return typeof endpoint === 'string' ? endpoint : endpoint.id;
}

const NODE_RADIUS = 24;

export default function ForceGraph({
  graphData,
  onNodeClick,
  onBackgroundClick,
  selectedNodeId,
  focusedNodeId,
  showFollows,
  showNonFollows,
  showRelationships,
}: ForceGraphProps) {
  const { locale, t, theme } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ForceGraph2DComp, setForceGraph2DComp] = useState<any>(null);

  // Preload profile images into an off-screen cache for canvas rendering
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  const [hoveredNode, setHoveredNode] = useState<(GraphNode & { x: number; y: number }) | null>(null);
  const [hoveredLink, setHoveredLink] = useState<(GraphLink & { source: { x: number; y: number }; target: { x: number; y: number } }) | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    import('react-force-graph-2d').then((mod) => {
      setForceGraph2DComp(() => mod.default);
    });
  }, []);

  // Preload all profile images when graph data changes
  useEffect(() => {
    graphData.nodes.forEach((node) => {
      if (node.profileImage && !imageCache.current.has(node.id)) {
        const img = new Image();
        img.src = node.profileImage;
        imageCache.current.set(node.id, img);
      }
    });
  }, [graphData]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setDimensions({ width: el.clientWidth, height: el.clientHeight });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cache the original circular positions from buildGraphData on first load / show change.
  // We snapshot these ONCE per graphData identity so focus-mode mutations can't corrupt them.
  const defaultPositions = useRef<Map<string, { fx: number; fy: number }>>(new Map());
  const lastGraphDataRef = useRef<GraphData | null>(null);

  if (graphData !== lastGraphDataRef.current) {
    lastGraphDataRef.current = graphData;
    const map = new Map<string, { fx: number; fy: number }>();
    for (const node of graphData.nodes) {
      if (node.fx != null && node.fy != null) {
        map.set(node.id, { fx: node.fx, fy: node.fy });
      }
    }
    defaultPositions.current = map;
  }

  // Build a set of visible link KEYS for paintLink to skip hidden links.
  // We pass ALL links to react-force-graph-2d (so it maintains internal
  // node-object bindings) and hide non-visible ones in the paint callback.
  // Keys use "srcId|tgtId|type" because indexOf fails after the library
  // mutates link objects (replacing string IDs with node-object refs).
  const visibleLinkSet = useMemo(() => {
    const set = new Set<string>();
    graphData.links.forEach((link) => {
      const isFollow = link.type === 'follow' || link.type === 'mutual-follow';
      const isNonFollow = link.type === 'non-follow';
      const isRelationship = !isFollow && !isNonFollow;
      if (isFollow && !showFollows) return;
      if (isNonFollow && !showNonFollows) return;
      if (isRelationship && !showRelationships) return;
      const srcId = linkNodeId(link.source as string | { id: string });
      const tgtId = linkNodeId(link.target as string | { id: string });
      if (focusedNodeId && srcId !== focusedNodeId && tgtId !== focusedNodeId) return;
      set.add(`${srcId}|${tgtId}|${link.type}`);
    });
    return set;
  }, [graphData.links, showFollows, showNonFollows, showRelationships, focusedNodeId]);

  // Animate nodes toward target positions using requestAnimationFrame LERP.
  // We keep fx/fy pinned to the CURRENT animated position each frame so
  // react-force-graph-2d renders them where we want.
  const animTargets = useRef<Map<string, { x: number; y: number }>>(new Map());
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;

    const targets: Map<string, { fx: number; fy: number }> = focusedNodeId
      ? computeFocusPositions(graphData.nodes, focusedNodeId, CIRCLE_RADIUS)
      : defaultPositions.current;

    const newTargets = new Map<string, { x: number; y: number }>();
    for (const [id, pos] of targets) {
      newTargets.set(id, { x: pos.fx, y: pos.fy });
    }
    animTargets.current = newTargets;

    cancelAnimationFrame(animFrameRef.current);

    const LERP_SPEED = 0.1;
    const THRESHOLD = 0.5;

    const step = () => {
      let anyMoving = false;
      for (const node of graphData.nodes) {
        const target = animTargets.current.get(node.id);
        if (!target) continue;

        const nx = (node as any).x ?? node.fx ?? 0;
        const ny = (node as any).y ?? node.fy ?? 0;
        const dx = target.x - nx;
        const dy = target.y - ny;

        if (Math.abs(dx) > THRESHOLD || Math.abs(dy) > THRESHOLD) {
          anyMoving = true;
          const newX = nx + dx * LERP_SPEED;
          const newY = ny + dy * LERP_SPEED;
          node.fx = newX;
          node.fy = newY;
          (node as any).x = newX;
          (node as any).y = newY;
        } else {
          node.fx = target.x;
          node.fy = target.y;
          (node as any).x = target.x;
          (node as any).y = target.y;
        }
        (node as any).vx = 0;
        (node as any).vy = 0;
      }

      fg.d3ReheatSimulation?.();

      if (anyMoving) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [focusedNodeId, graphData]);

  // Disable force simulation — nodes are pinned via fx/fy
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force('charge')?.strength(0);
    fg.d3Force('link')?.distance(0);
    fg.d3Force('center', null);
  }, [graphData, ForceGraph2DComp]);

  // Track mouse position for tooltips
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    };
    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation phase for one-way follow glow
  const glowPhaseRef = useRef(0);
  useEffect(() => {
    let animId: number;
    const animate = () => {
      glowPhaseRef.current = (Date.now() % 2000) / 2000;
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const paintNode = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const n = node as GraphNode & { x: number; y: number };
      const r = NODE_RADIUS;

      if (n.id === selectedNodeId) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 5, 0, 2 * Math.PI);
        ctx.fillStyle = `${n.color}33`;
        ctx.fill();
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 1.5, 0, 2 * Math.PI);
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      const img = imageCache.current.get(n.id);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, n.x - r, n.y - r, r * 2, r * 2);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = n.color;
        ctx.fill();

        const fontSize = 12;
        ctx.font = `500 ${fontSize}px "Noto Sans KR", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(n.initial, n.x, n.y);
      }

      if (globalScale > 0.6) {
        const labelSize = 9;
        ctx.font = `500 ${labelSize}px "Noto Sans KR", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const name = locale === 'zh' ? (n.nameZh ?? n.nameEn) : locale === 'en' ? n.nameEn : n.nameKo;
        const isLight = theme === 'light';
        // Outline pass — contrasting halo behind text
        ctx.fillStyle = isLight ? 'rgba(241, 245, 249, 0.95)' : 'rgba(15, 23, 42, 0.85)';
        for (const [ox, oy] of [[0.5, 0.5], [-0.5, 0.5], [0.5, -0.5], [-0.5, -0.5], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
          ctx.fillText(name, n.x + ox, n.y + r + labelSize + 2 + oy);
        }
        // Text pass
        ctx.fillStyle = isLight ? '#1e293b' : 'rgba(226, 232, 240, 0.95)';
        ctx.fillText(name, n.x, n.y + r + labelSize + 2);
      }
    },
    [selectedNodeId, locale, theme],
  );

  const paintLink = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const l = link as GraphLink & {
        source: GraphNode & { x: number; y: number };
        target: GraphNode & { x: number; y: number };
        __indexColor?: string;
      };

      if (l.source?.x == null || l.target?.x == null) return;

      const srcId = linkNodeId(l.source as unknown as string | { id: string });
      const tgtId = linkNodeId(l.target as unknown as string | { id: string });
      if (!visibleLinkSet.has(`${srcId}|${tgtId}|${l.type}`)) return;

      const sx = l.source.x;
      const sy = l.source.y;
      const tx = l.target.x;
      const ty = l.target.y;

      const curvature = l.curvature || 0;
      const dx = tx - sx;
      const dy = ty - sy;
      const midX = (sx + tx) / 2;
      const midY = (sy + ty) / 2;
      const cpX = midX - dy * curvature;
      const cpY = midY + dx * curvature;

      const isOneWayFollow = l.type === 'follow';
      const isNonFollow = l.type === 'non-follow';
      const gs = globalScale;

      if (isNonFollow) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = l.color;
        ctx.lineWidth = l.width / gs;
        ctx.setLineDash([6 / gs, 4 / gs]);
        ctx.globalAlpha = 0.7;
        if (Math.abs(curvature) > 0.01) {
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(cpX, cpY, tx, ty);
        } else {
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        const arrowLen = Math.max(8, 12 / gs);
        const arrowWidth = Math.max(5, 7 / gs);
        drawArrow(ctx, sx, sy, tx, ty, cpX, cpY, curvature, arrowLen, arrowWidth, l.color, NODE_RADIUS);

        const markX = Math.abs(curvature) > 0.01 ? cpX : midX;
        const markY = Math.abs(curvature) > 0.01 ? cpY : midY;
        const markSize = Math.max(4, 6 / gs);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = Math.max(1.5, 2 / gs);
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(markX - markSize, markY - markSize);
        ctx.lineTo(markX + markSize, markY + markSize);
        ctx.moveTo(markX + markSize, markY - markSize);
        ctx.lineTo(markX - markSize, markY + markSize);
        ctx.stroke();
        ctx.restore();
        return;
      }

      if (isOneWayFollow) {
        const phase = glowPhaseRef.current;
        const dashLen = 8 / gs;
        const gapLen = 12 / gs;
        const dashOffset = phase * (dashLen + gapLen) * 8;

        const glowAlpha = 0.12 + 0.18 * Math.sin(phase * Math.PI * 2);
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 107, 53, ${glowAlpha})`;
        ctx.lineWidth = (l.width * 4) / gs;
        ctx.setLineDash([]);
        if (Math.abs(curvature) > 0.01) {
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(cpX, cpY, tx, ty);
        } else {
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
        }
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 200, 150, 0.6)';
        ctx.lineWidth = (l.width * 0.8) / gs;
        ctx.setLineDash([dashLen, gapLen]);
        ctx.lineDashOffset = -dashOffset;
        if (Math.abs(curvature) > 0.01) {
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(cpX, cpY, tx, ty);
        } else {
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
        }
        ctx.stroke();
        ctx.restore();
      }

      const isMutualFollow = l.type === 'mutual-follow';

      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = l.color;

      if (isMutualFollow) {
        ctx.lineWidth = 0.5 / gs;
        ctx.globalAlpha = 0.08;
      } else {
        ctx.lineWidth = (isOneWayFollow ? l.width * 1.5 : l.width) / gs;
      }

      if (l.dashed) {
        ctx.setLineDash([5 / gs, 5 / gs]);
      } else {
        ctx.setLineDash([]);
      }

      if (Math.abs(curvature) > 0.01) {
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(cpX, cpY, tx, ty);
      } else {
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      if (l.type === 'follow' || isMutualFollow) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return;

        if (isOneWayFollow) {
          const arrowLen = Math.max(8, 12 / gs);
          const arrowWidth = Math.max(5, 7 / gs);

          ctx.save();
          ctx.globalAlpha = 0.5;
          drawArrow(ctx, sx, sy, tx, ty, cpX, cpY, curvature, arrowLen + 2, arrowWidth + 1.5, '#ffffff', NODE_RADIUS);
          ctx.restore();
          drawArrow(ctx, sx, sy, tx, ty, cpX, cpY, curvature, arrowLen, arrowWidth, l.color, NODE_RADIUS);
        } else if (isMutualFollow) {
          ctx.save();
          ctx.globalAlpha = 0.08;
          const arrowLen = 6 / gs;
          const arrowWidth = 3 / gs;
          drawArrow(ctx, sx, sy, tx, ty, cpX, cpY, curvature, arrowLen, arrowWidth, l.color, NODE_RADIUS);
          drawArrow(ctx, tx, ty, sx, sy, cpX, cpY, -curvature, arrowLen, arrowWidth, l.color, NODE_RADIUS);
          ctx.restore();
        }
      }

      if (l.label && globalScale > 0.8) {
        const labelX = Math.abs(curvature) > 0.01 ? cpX : midX;
        const labelY = Math.abs(curvature) > 0.01 ? cpY : midY;
        const labelSize = 8 / globalScale;

        ctx.font = `400 ${labelSize}px "Noto Sans KR", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const metrics = ctx.measureText(l.label);
        const pad = 2 / globalScale;
        const themeIsDark = document.documentElement.getAttribute('data-theme') !== 'light';
        ctx.fillStyle = themeIsDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(248, 250, 252, 0.9)';
        ctx.fillRect(
          labelX - metrics.width / 2 - pad,
          labelY - labelSize / 2 - pad,
          metrics.width + pad * 2,
          labelSize + pad * 2,
        );

        ctx.fillStyle = l.color;
        ctx.fillText(l.label, labelX, labelY);
      }
    },
    [graphData.links, visibleLinkSet],
  );

  // Node pointer area for click detection
  const paintNodeArea = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any, color: string, ctx: CanvasRenderingContext2D) => {
      const n = node as GraphNode & { x: number; y: number };
      ctx.beginPath();
      ctx.arc(n.x, n.y, NODE_RADIUS + 2, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    },
    [],
  );

  const { width, height } = dimensions;
  const isReady = ForceGraph2DComp && width > 0 && height > 0;

  const handleNodeHover = useCallback((node: unknown) => {
    if (node) {
      setHoveredNode(node as GraphNode & { x: number; y: number });
      setHoveredLink(null);
    } else {
      setHoveredNode(null);
    }
  }, []);

  const handleLinkHover = useCallback((link: unknown) => {
    if (link) {
      setHoveredLink(link as GraphLink & { source: { x: number; y: number }; target: { x: number; y: number } });
      setHoveredNode(null);
    } else {
      setHoveredLink(null);
    }
  }, []);

  const linkTypeLabel = (type: string, label?: string): string => {
    switch (type) {
      case 'mutual-follow': return t('legend.mutualFollow');
      case 'follow': return t('legend.oneWayFollow');
      case 'ex-couple': return t('rel.exCouple');
      case 'confirmed-couple': return t('rel.confirmedCouple');
      case 'final-couple': return t('rel.finalCouple');
      case 'not-together': return t('rel.notTogether');
      case 'non-follow': return t('legend.nonFollow');
      default: return label || type;
    }
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[var(--muted)] text-sm">{t('loading.graph')}</div>
        </div>
      )}
      {isReady && (
        <ForceGraph2DComp
          ref={fgRef}
          graphData={graphData}
          width={width}
          height={height}
          backgroundColor={theme === 'light' ? '#f1f5f9' : '#0f172a'}
          nodeCanvasObject={paintNode}
          nodeCanvasObjectMode={() => 'replace'}
          nodePointerAreaPaint={paintNodeArea}
          linkCanvasObject={paintLink}
          linkCanvasObjectMode={() => 'replace'}
          onNodeClick={(node: unknown) => onNodeClick(node as GraphNode)}
          onBackgroundClick={onBackgroundClick}
          onNodeHover={handleNodeHover}
          onLinkHover={handleLinkHover}
          cooldownTicks={0}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          onNodeDblClick={() => {}}
          linkCurvature={(link: unknown) => (link as GraphLink).curvature || 0}
        />
      )}

      {hoveredNode && (
        <div
          className="pointer-events-none"
          style={{
            position: 'fixed',
            left: tooltipPos.x + 14,
            top: tooltipPos.y - 14,
            transform: 'translateY(-100%)',
            zIndex: 50,
          }}
        >
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-xl max-w-[200px]">
             <p className="text-sm font-medium text-[var(--foreground)]">
              {locale === 'zh' ? (hoveredNode.nameZh ?? hoveredNode.nameEn) : locale === 'en' ? hoveredNode.nameEn : hoveredNode.nameKo}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {locale === 'ko' ? hoveredNode.nameEn : hoveredNode.nameKo}
            </p>
            <div className="flex gap-3 mt-1 text-[10px] text-[var(--muted)]">
              <span>{t('tooltip.following')} {hoveredNode.followingCount ?? 0}</span>
              <span>{t('tooltip.followers')} {hoveredNode.followersCount ?? 0}</span>
            </div>
            <p className="text-[10px] text-[var(--muted)] mt-1 opacity-60">{t('tooltip.clickForDetails')}</p>
          </div>
        </div>
      )}

      {hoveredLink && (
        <div
          className="pointer-events-none"
          style={{
            position: 'fixed',
            left: tooltipPos.x + 14,
            top: tooltipPos.y - 14,
            transform: 'translateY(-100%)',
            zIndex: 50,
          }}
        >
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-xl">
            <p className="text-xs font-medium" style={{ color: hoveredLink.color }}>
              {linkTypeLabel(hoveredLink.type, hoveredLink.label)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper: draw arrowhead near the target node
function drawArrow(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  cpX: number,
  cpY: number,
  curvature: number,
  arrowLen: number,
  arrowWidth: number,
  color: string,
  nodeRadius: number,
) {
  // Find the point on the line/curve that's nodeRadius away from target
  let endX: number, endY: number;
  let angle: number;

  if (Math.abs(curvature) > 0.01) {
    // For curved lines, approximate the tangent at the target end
    // Use a point slightly before the target on the bezier
    const t = 1 - nodeRadius / Math.sqrt((tx - sx) ** 2 + (ty - sy) ** 2);
    const tClamped = Math.max(0.5, Math.min(t, 0.98));

    // Quadratic bezier point at t
    endX = (1 - tClamped) * (1 - tClamped) * sx + 2 * (1 - tClamped) * tClamped * cpX + tClamped * tClamped * tx;
    endY = (1 - tClamped) * (1 - tClamped) * sy + 2 * (1 - tClamped) * tClamped * cpY + tClamped * tClamped * ty;

    // Tangent at t
    const tangentX = 2 * (1 - tClamped) * (cpX - sx) + 2 * tClamped * (tx - cpX);
    const tangentY = 2 * (1 - tClamped) * (cpY - sy) + 2 * tClamped * (ty - cpY);
    angle = Math.atan2(tangentY, tangentX);
  } else {
    // Straight line
    angle = Math.atan2(ty - sy, tx - sx);
    endX = tx - Math.cos(angle) * nodeRadius;
    endY = ty - Math.sin(angle) * nodeRadius;
  }

  // Draw arrowhead
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - arrowLen * Math.cos(angle - Math.PI / 6),
    endY - arrowLen * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    endX - arrowLen * Math.cos(angle + Math.PI / 6),
    endY - arrowLen * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
