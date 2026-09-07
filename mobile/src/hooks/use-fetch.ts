import { useCallback, useEffect, useRef, useState } from 'react';

type State<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refreshing: boolean;
};

/**
 * Small data-fetching hook shared by every screen that loads from the
 * Braga Event API. Handles loading/error state, pull-to-refresh, and
 * cancels in-flight requests when dependencies change or the component
 * unmounts.
 */
export function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<State<T>>({
    data: null,
    error: null,
    loading: true,
    refreshing: false,
  });
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (isRefresh: boolean) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState((s) => ({
        ...s,
        loading: !isRefresh,
        refreshing: isRefresh,
        error: null,
      }));

      try {
        const data = await fetcher(controller.signal);
        if (controller.signal.aborted) return;
        setState({ data, error: null, loading: false, refreshing: false });
      } catch (err) {
        if (controller.signal.aborted) return;
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err : new Error('Unknown error'),
          loading: false,
          refreshing: false,
        }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  useEffect(() => {
    run(false);
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    ...state,
    refresh: () => run(true),
    retry: () => run(false),
  };
}
