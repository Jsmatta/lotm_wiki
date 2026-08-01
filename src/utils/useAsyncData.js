import { useEffect, useState } from "preact/hooks";

/**
 * Run an async loader and ignore results from superseded runs, so a fast
 * volume switch or a quick back-navigation can never render stale data.
 *
 * @param {() => Promise<T>} load Loader; re-run whenever `deps` change.
 * @param {Array} deps Dependency list for the load.
 * @param {T} fallback Value used before the first load and after a failure.
 * @returns {{data: T, loading: boolean}}
 * @template T
 */
export function useAsyncData(load, deps, fallback = null) {
  const [state, setState] = useState({ data: fallback, loading: true });

  useEffect(() => {
    let cancelled = false;

    setState((current) => (current.loading ? current : { ...current, loading: true }));

    load().then(
      (data) => {
        if (!cancelled) setState({ data, loading: false });
      },
      (error) => {
        console.error(error);
        if (!cancelled) setState({ data: fallback, loading: false });
      },
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
