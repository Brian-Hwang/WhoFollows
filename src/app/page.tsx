'use client';

import { useState, useMemo, useCallback } from 'react';
import { shows, getShowData } from '@/data/shows';
import { buildGraphData } from '@/lib/graph-utils';
import type { GraphNode } from '@/lib/types';
import ForceGraph from '@/components/ForceGraph';
import ProfilePanel from '@/components/ProfilePanel';
import Legend from '@/components/Legend';
import Header from '@/components/Header';

export default function Home() {
  const [selectedShowId, setSelectedShowId] = useState('transit-love-4');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const showData = useMemo(() => getShowData(selectedShowId), [selectedShowId]);

  const graphData = useMemo(
    () => (showData ? buildGraphData(showData) : { nodes: [], links: [] }),
    [showData],
  );

  const handleShowSelect = useCallback((id: string) => {
    setSelectedShowId(id);
    setSelectedNode(null);
  }, []);

  if (!showData) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--background)]">
      <Header
        shows={shows}
        selectedShowId={selectedShowId}
        onShowSelect={handleShowSelect}
      />

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
        relationships={showData.relationships}
        follows={showData.follows}
        cast={showData.cast}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
