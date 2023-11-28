import { useCallback, useEffect, useState } from "react";
import { server } from "./server";

interface State<TData> {
  data: TData | null;
  loading: boolean;
  error: boolean;
}
export const useQuery = <TData = any>(query: string) => {
  const [state, setState] = useState<State<TData>>({
    data: null,
    loading: false,
    error: false,
  });

  const fetch = useCallback(() => {
    const fetchApi = async () => {
      try {
        setState({ data: null, loading: true, error: false });
        const { data, errors } = await server.fetch<TData>({ query });
        if (errors && errors.length) {
            throw new Error(errors[0].message);
        }
        setState({ data, loading: false, error: false });
      } catch(err) {
        setState({ data: null, loading: false, error: true });
      }
    };
    fetchApi();
  }, [query]);

  useEffect(() => {
    fetch();
  }, [query]);

  return { ...state, refetch: fetch };
};