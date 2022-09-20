import { useEffect, useState } from "react";

const useScript = (src) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const $script = document.createElement("script");
    $script.src = src;
    document.body.append($script);

    const handleLoad = () => setLoading(false);
    const handleError = () => setError(true);

    $script.addEventListener("load", handleLoad);
    $script.addEventListener("error", handleError);

    return () => {
      $script.removeEventListener("load", handleLoad);
      $script.removeEventListener("error", handleError);
    };
  }, [src]);

  return [loading, error];
};

export default useScript;
