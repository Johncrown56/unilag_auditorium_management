import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../utils/http";

const useFetch = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const fetchData = () => {
    setLoading(true);
    setData(null);
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
        setMessage(err?.message || "Something went wrong!");
        setSuccess(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, message, success, fetchData };
};

export default useFetch;
