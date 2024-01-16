import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../utils/http";

const useFetch = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setData(null);
    setError("");
    setMessage("");
    setSuccess(false);

    fetchDataFromApi(url)
      .then((res: any) => {
        setTimeout(() => {
          setLoading(false);
          setData(res?.name === "AxiosError" ? null : res);
          setMessage(res?.message);
          setSuccess(true);
        }, 1000 * 1);
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
        setMessage(err?.message);
        setSuccess(false);
        setError("Something went wrong!");
      });
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, message, success, fetchData };
};

export default useFetch;
