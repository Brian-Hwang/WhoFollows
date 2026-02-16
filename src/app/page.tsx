'use client';

import { useState, useMemo } from 'react';
import { transitLove4 } from '@/data/transit-love-4';
import { buildGraphData } from '@/lib/graph-utils';
import type { GraphNode } from '@/lib/types';
import ForceGraph from '@/components/ForceGraph';
import ProfilePanel from '@/components/ProfilePanel';
import Legend from '@/components/Legend';
import Header from '@/components/Header';

export default function Home() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const graphData = useMemo(
    () => buildGraphData(transitLove4),
    [],
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--background)]">
      <Header showName={transitLove4.nameKo} />

      <div className="absolute inset-0">
        <ForceGraph
          graphData={graphData}
          onNodeClick={(node) => setSelectedNode(node)}
          onBackgroundClick={() => setSelectedNode(null)}
          selectedNodeId={selectedNode?.id ?? null}
        />
      </div>

      <Legend />

      <ProfilePanel
        node={selectedNode}
        relationships={transitLove4.relationships}
        follows={transitLove4.follows}
        cast={transitLove4.cast}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
