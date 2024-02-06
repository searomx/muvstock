import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/lib/api";

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function useFetch<T = unknown>(url: string) {
      await api.post(url).
        then(response => {
          console.log("response: ", response);
          setData(response.data);
        }).finally(() => {
          setLoading(false);
        });
    }
  }, []);
  return { data, loading };
}
