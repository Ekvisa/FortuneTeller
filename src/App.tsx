import { useEffect, useState } from "react";

import "./App.scss";
import getAdvice from "./api/advise";
import getImageUrl from "./api/image";

type Data = {
  advice: string;
  image: string;
};

function App() {
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    return () => {
      if (data?.image) {
        URL.revokeObjectURL(data.image);
      }
    };
  }, [data?.image]);

  async function handleClick() {
    if (loading) return;

    setLoading(true);
    setError(null);
    setImageLoaded(false);

    try {
      const [adviceText, imageUrl] = await Promise.all([
        getAdvice(),
        getImageUrl(),
      ]);

      setData({ advice: adviceText, image: imageUrl });
      console.log(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error("Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Гадаю..." : "✨ Погадать ✨"}
      </button>

      {loading && <div className="crystal">🔮</div>}
      {error && <div>Ошибка 😢</div>}
      {/* {data && (
        <div className="prediction">
          <p>{data.advice}</p>
          <img src={data.image} alt="image" />
        </div>
      )} */}

      {data && (
        <div className={`prediction ${imageLoaded ? "visible" : "hidden"}`}>
          <p>{data.advice}</p>
          <img
            src={data.image}
            alt="image"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
