import { useCallback, useEffect, useReducer, useState } from "react";
import { server } from "./server";
import { reducer } from "./useReducer";

interface State<TData> {
  data: TData | null;
  loading: boolean;
  error: boolean;
}

interface QueryResult<TData> extends State<TData> {
  refetch: () => void;
}

export const useQuery = <TData = any>(query: string): QueryResult<TData> => {
  const fetchReducer = reducer<TData>();
  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    loading: false,
    error: false,
  });

  // const [state, setState] = useState<State<TData>>({
  //   data: null,
  //   loading: false,
  //   error: false,
  // });

  const fetch = useCallback(() => {
    const fetchApi = async () => {
      try {
        dispatch({ type: "FETCH" });
        // setState({ data: null, loading: true, error: false });
        const { data, errors } = await server.fetch<TData>({ query });
        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }
        // setState({ data, loading: false, error: false });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        // setState({ data: null, loading: false, error: true });
        dispatch({ type: "FETCH_ERROR" });
      }
    };
    fetchApi();
  }, [query]);

  useEffect(() => {
    fetch();
  }, [query]);

  return { ...state, refetch: fetch };
};
