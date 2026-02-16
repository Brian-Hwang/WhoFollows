'use client';

import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import type { GraphData, GraphNode, GraphLink } from '@/lib/types';

interface ForceGraphProps {
  graphData: GraphData;
  onNodeClick: (node: GraphNode) => void;
  onBackgroundClick: () => void;
  selectedNodeId: string | null;
}

const NODE_RADIUS = 18;

export default function ForceGraph({
  graphData,
  onNodeClick,
  onBackgroundClick,
  selectedNodeId,
}: ForceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ForceGraph2DComp, setForceGraph2DComp] = useState<any>(null);

    // Preload profile images into an off-screen cache for canvas rendering
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

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
        // Store immediately so we have a reference; onload will make it drawable
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

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force('charge')?.strength(-400);
    fg.d3Force('link')?.distance(160);
    fg.d3ReheatSimulation();
  }, [graphData, ForceGraph2DComp]);

  // Custom node rendering — profile image clipped to circle, with colored border
  const paintNode = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const n = node as GraphNode & { x: number; y: number };
      const r = NODE_RADIUS;

      // Selected glow ring
      if (n.id === selectedNodeId) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 5, 0, 2 * Math.PI);
        ctx.fillStyle = `${n.color}33`;
        ctx.fill();
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Colored border ring (always visible)
      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 1.5, 0, 2 * Math.PI);
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Try to draw profile image clipped to circle
      const img = imageCache.current.get(n.id);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, n.x - r, n.y - r, r * 2, r * 2);
        ctx.restore();
      } else {
        // Fallback: colored circle with initial
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

      // Name label below node (only at reasonable zoom)
      if (globalScale > 0.6) {
        const labelSize = 9;
        ctx.font = `500 ${labelSize}px "Noto Sans KR", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Text shadow for readability on dark background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fillText(n.nameKo, n.x + 0.5, n.y + r + labelSize + 2.5);
        ctx.fillStyle = 'rgba(226, 232, 240, 0.9)';
        ctx.fillText(n.nameKo, n.x, n.y + r + labelSize + 2);
      }
    },
    [selectedNodeId],
  );

  // Custom link rendering
  const paintLink = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const l = link as GraphLink & {
        source: GraphNode & { x: number; y: number };
        target: GraphNode & { x: number; y: number };
      };

      if (!l.source?.x || !l.target?.x) return;

      const sx = l.source.x;
      const sy = l.source.y;
      const tx = l.target.x;
      const ty = l.target.y;

      // Calculate curvature offset
      const curvature = l.curvature || 0;
      const dx = tx - sx;
      const dy = ty - sy;
      const midX = (sx + tx) / 2;
      const midY = (sy + ty) / 2;

      // Control point for quadratic bezier (perpendicular offset)
      const cpX = midX - dy * curvature;
      const cpY = midY + dx * curvature;

      ctx.beginPath();
      ctx.strokeStyle = l.color;
      ctx.lineWidth = l.width / globalScale;

      if (l.dashed) {
        ctx.setLineDash([5 / globalScale, 5 / globalScale]);
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

      // Draw arrowheads for follow links
      if (l.type === 'follow' || l.type === 'mutual-follow') {
        const arrowLen = 6 / globalScale;
        const arrowWidth = 3 / globalScale;

        // Calculate point near target (offset by node radius)
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return;

        if (l.type === 'follow' || l.type === 'mutual-follow') {
          // Arrow at target
          drawArrow(ctx, sx, sy, tx, ty, cpX, cpY, curvature, arrowLen, arrowWidth, l.color, NODE_RADIUS);
        }

        if (l.type === 'mutual-follow') {
          // Arrow at source (reverse direction)
          drawArrow(ctx, tx, ty, sx, sy, cpX, cpY, -curvature, arrowLen, arrowWidth, l.color, NODE_RADIUS);
        }
      }

      // Draw label for relationship links
      if (l.label && globalScale > 0.8) {
        const labelX = Math.abs(curvature) > 0.01 ? cpX : midX;
        const labelY = Math.abs(curvature) > 0.01 ? cpY : midY;
        const labelSize = 8 / globalScale;

        ctx.font = `400 ${labelSize}px "Noto Sans KR", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Background for label
        const metrics = ctx.measureText(l.label);
        const pad = 2 / globalScale;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
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
    [],
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

  const data = useMemo(() => graphData, [graphData]);

  const { width, height } = dimensions;
  const isReady = ForceGraph2DComp && width > 0 && height > 0;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[var(--muted)] text-sm">그래프 로딩 중...</div>
        </div>
      )}
      {isReady && (
        <ForceGraph2DComp
          ref={fgRef}
          graphData={data}
          width={width}
          height={height}
          backgroundColor="rgba(0,0,0,0)"
          nodeCanvasObject={paintNode}
          nodeCanvasObjectMode={() => 'replace'}
          nodePointerAreaPaint={paintNodeArea}
          linkCanvasObject={paintLink}
          linkCanvasObjectMode={() => 'replace'}
          onNodeClick={(node: unknown) => onNodeClick(node as GraphNode)}
          onBackgroundClick={onBackgroundClick}
          cooldownTicks={100}
          enableNodeDrag={true}
          linkCurvature={(link: unknown) => (link as GraphLink).curvature || 0}
        />
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
