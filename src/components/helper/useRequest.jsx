/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef, useMemo } from "react";

export default function useRequest(client, url) {
  const [reloadCount, setReloadCount] = useState(0);
  const [state, setState] = useState({ loading: true, error: null });
  const reloadRef = useRef({});
  const reload = useMemo(
    () => () => setReloadCount(reloadCount + 1),
    [reloadCount],
  );
  useEffect(() => {
    const { data, ...restState } = state;
    if (url !== null) {
      if (
        url !== reloadRef.current.url ||
        reloadCount !== reloadRef.current.reloadCount
      ) {
        reloadRef.current.url = url;
        reloadRef.current.reloadCount = reloadCount;
        setState({ ...restState, loading: true, error: null });
        client
          .request({
            url,
            method: "GET",
          })
          .then((response) => {
            setState({
              ...restState,
              loading: false,
              error: null,
              ...response,
            });
          })
          .catch((error) => {
            setState({
              ...restState,
              loading: false,
              error,
            });
          });
      }
    } else {
      setState({ ...restState, loading: false, error: null });
    }
  }, [client, url, reloadCount, setReloadCount, state]);
  return [state, reload];
}

export function useCachedRequest(client, url, initialData) {
  const dataRef = useRef(initialData);
  const [response, reload] = useRequest(client, url);
  if (response.data) {
    dataRef.current = response.data;
  }
  return [{ ...response, data: dataRef.current }, reload];
}
