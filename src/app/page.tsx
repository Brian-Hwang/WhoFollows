'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { shows, getShowData } from '@/data/shows';
import { buildGraphData } from '@/lib/graph-utils';
import type { GraphNode } from '@/lib/types';
import { useI18n } from '@/lib/i18n';
import ForceGraph from '@/components/ForceGraph';
import ProfilePanel from '@/components/ProfilePanel';
import Legend from '@/components/Legend';
import Header from '@/components/Header';
import FilterPanel from '@/components/FilterPanel';
import InsightsPanel from '@/components/InsightsPanel';

export default function Home() {
  const { locale, t } = useI18n();
  const [selectedShowId, setSelectedShowId] = useState('transit-love-4');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [showFollows, setShowFollows] = useState(false);
  const [showNonFollows, setShowNonFollows] = useState(true);
  const [showRelationships, setShowRelationships] = useState(true);

  const showData = useMemo(() => getShowData(selectedShowId), [selectedShowId]);

  // The CANONICAL graph data — never mutated, never filtered.
  const graphData = useMemo(
    () => (showData ? buildGraphData(showData) : { nodes: [], links: [] }),
    [showData],
  );

  // Debounce rapid clicks (double-click fires two onNodeClick events).
  // We swallow the second click within 300ms on the SAME node.
  const lastClickRef = useRef<{ id: string; time: number }>({ id: '', time: 0 });

  const handleNodeClick = useCallback((node: GraphNode) => {
    const now = Date.now();
    const last = lastClickRef.current;
    if (last.id === node.id && now - last.time < 300) return;
    lastClickRef.current = { id: node.id, time: now };

    setFocusedNodeId((prev) => (prev === node.id ? null : node.id));
    setSelectedNode(node);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setFocusedNodeId(null);
    setSelectedNode(null);
  }, []);

  const handleShowSelect = useCallback((id: string) => {
    setSelectedShowId(id);
    setSelectedNode(null);
    setFocusedNodeId(null);
  }, []);

  if (!showData) return null;

  const verifiedDate = showData.lastVerified
    ? locale === 'en'
      ? new Date(showData.lastVerified).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : new Date(showData.lastVerified).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

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
          onNodeClick={handleNodeClick}
          onBackgroundClick={handleBackgroundClick}
          selectedNodeId={selectedNode?.id ?? null}
          focusedNodeId={focusedNodeId}
          showFollows={showFollows}
          showNonFollows={showNonFollows}
          showRelationships={showRelationships}
        />
      </div>

      <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
        <Legend />
        <FilterPanel
          showFollows={showFollows}
          showNonFollows={showNonFollows}
          showRelationships={showRelationships}
          onToggleFollows={() => setShowFollows((prev) => !prev)}
          onToggleNonFollows={() => setShowNonFollows((prev) => !prev)}
          onToggleRelationships={() => setShowRelationships((prev) => !prev)}
        />
      </div>

      {verifiedDate && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-[var(--surface)]/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-[var(--border)]">
            <p className="text-[10px] text-[var(--muted)]">
              ✓ {t('verified.label')}: {verifiedDate}
            </p>
          </div>
        </div>
      )}

      <InsightsPanel showData={showData} />

      <ProfilePanel
        node={selectedNode}
        relationships={showData.relationships}
        follows={showData.follows}
        cast={showData.cast}
        onClose={() => { setSelectedNode(null); setFocusedNodeId(null); }}
      />
    </div>
  );
}
