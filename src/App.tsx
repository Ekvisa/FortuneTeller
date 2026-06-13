import { useState } from "react";

import "./App.scss";
import getAdvice from "./api/advise";
import getImageUrl from "./api/image";

import close from "../src/assets/buttons/close.svg";
import heart from "../src/assets/buttons/heart.svg";

type Card = {
  // id: string;
  advice: string;
  image: string;
  // favorite: boolean;
};

type dataStatus = "idle" | "loading" | "ready" | "error";

function App() {
  const [status, setStatus] = useState<dataStatus>("idle"); //статус данных
  const [error, setError] = useState<Error | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [history, setHistory] = useState<Card[]>([]); //История и
  const [favorites, setFavorites] = useState<Card[]>([]); //Избранное, в каждом будем хранить максимум 10 карт

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

  //При закрытии карты добавим её в Историю:
  function closeClick() {
    if (!currentCard) return;
    setHistory((prev) => [currentCard, ...prev.slice(0, 9)]);

    setCurrentCard(null);
    setStatus("idle");
  }

  //При нажатии лайка удалим (по айди) или добавим её в Избранное:
  function favoriteClick() {
    if (!currentCard) return;
    if (favorites.includes(currentCard)) {
      setFavorites((prev) => prev.filter((card: Card) => card === currentCard));
    } else {
      setFavorites((prev) => [currentCard, ...prev.slice(0, 9)]);
    }
  }

  async function showCardOfTheDay() {
    const cardOfTheDay = await getData();
    if (!cardOfTheDay) return;
    setCurrentCard(cardOfTheDay);
    setStatus("ready");
  }

  function showHistory() {
    console.log(history);
  }

  function showFavorites() {
    console.log(favorites);
  }

  return (
    <div className="app">
      <div className="actions">
        <div
          onClick={crystalClick}
          className={`crystal ${status === "loading" ? "shiny" : ""} ${status === "idle" ? "sleep" : ""}`}
        >
          🔮
        </div>

        <p onClick={showCardOfTheDay}>- карта дня -</p>
        <p onClick={showHistory}>- история -</p>
        {history.map((card, index) => (
          <ul>
            <li key={index} onClick={() => setCurrentCard(card)}>
              <span>🎴</span> {card.advice.slice(0, 20)}...
            </li>
          </ul>
        ))}

        <p onClick={showFavorites}>- избранное -</p>
        {favorites.map((card, index) => (
          <ul>
            <li key={index} onClick={() => setCurrentCard(card)}>
              <span>🎴</span> {card.advice.slice(0, 20)}...
            </li>
          </ul>
        ))}
      </div>

      <div className="board">
        {error && (
          <div className="error abs">
            Ошибка 😢 <br /> Попробуйте включить VPN 🪄
          </div>
        )}

        <div className={`abs ${status === "ready" ? "specified" : "empty"}`}>
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
    </div>
  );
}

export default App;
