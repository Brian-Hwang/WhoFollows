'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

export function useGraphDimensions() {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [updateDimensions]);

  return { ref, ...dimensions };
}
