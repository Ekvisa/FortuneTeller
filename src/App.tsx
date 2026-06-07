import { useState } from "react";

import "./App.scss";
import getAdvice from "./api/advise";
import getImageUrl from "./api/image";

import close from "../src/assets/buttons/close.svg";
import heart from "../src/assets/buttons/heart.svg";

type Card = {
  id: string;
  advice: string;
  image: string;
  favorite: boolean;
};

type dataStatus = "idle" | "loading" | "ready" | "error";

function App() {
  const [status, setStatus] = useState<dataStatus>("idle");
  const [error, setError] = useState<Error | null>(null);

  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [history, setHistory] = useState<Card[]>([]);

  async function getData() {
    try {
      const [adviceText, imageUrl] = await Promise.all([
        getAdvice(),
        getImageUrl(),
      ]);
      return {
        id: crypto.randomUUID(),
        advice: adviceText,
        image: imageUrl,
        favorite: false,
      };
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        setError(new Error("Unknown error"));
      }
      setStatus("error");
    }
  }

  async function crystalClick() {
    if (status === "loading") return;
    setError(null);
    setStatus("loading");
    const newCard = await getData();
    if (!newCard) return;
    setCurrentCard(newCard);
    setStatus("ready");
  }

  function closeClick() {
    if (!currentCard) return;
    setHistory((prev) => [currentCard, ...prev]);
    setCurrentCard(null);
    setStatus("idle");
  }

  function favoriteClick() {
    if (!currentCard) return;
    setCurrentCard({ ...currentCard, favorite: !currentCard.favorite });
  }

  async function showCardOfTheDay() {
    const card = await getData();
    if (!card) return;
    setCurrentCard(card);
    setStatus("ready");
  }

  function showHistory() {
    console.log(history);
  }

  return (
    <div className="app">
      <button onClick={crystalClick} disabled={status === "loading"}>
        {status === "loading" ? "Гадаю..." : "✨ Погадать ✨"}
      </button>
      <div className="main">
        {
          <div
            onClick={crystalClick}
            className={`crystal abs ${status === "loading" ? "shiny" : ""} ${status === "idle" ? "sleep" : ""}`}
          >
            🔮
          </div>
        }
        {error && (
          <div className="error abs">
            Ошибка 😢 <br /> Попробуйте включить VPN 🪄
          </div>
        )}

        <div className={`abs ${status === "ready" ? "shown" : "invisible"}`}>
          {currentCard && (
            <div className="card">
              <div className="data">
                <p>{currentCard.advice}</p>
                <img src={currentCard.image} alt="image" />
              </div>
              <div className="overlay">
                <ul className="buttons">
                  <li className="close" onClick={closeClick}>
                    <img src={close} alt="close" />
                  </li>
                  <li className="favorite" onClick={favoriteClick}>
                    <img src={heart} alt="close" />
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bottom">
        <p onClick={showCardOfTheDay}>- карта дня -</p>
        <p onClick={showHistory}>- история -</p>

        <p>- избранное -</p>
      </div>
    </div>
  );
}

export default App;
