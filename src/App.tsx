import { useEffect, useState } from "react";

import "./App.scss";
import getAdvice from "./api/advise";
import getImageUrl from "./api/image";

import close from "../src/assets/buttons/close.svg";
import heart from "../src/assets/buttons/heart.svg";
import CardsSuite from "./components/CardsSuite";
import type { Card } from "./types";
import CardOfTheDay from "./components/CardOfTheDay";

type dataStatus = "idle" | "loading" | "ready" | "error";

function App() {
  const [status, setStatus] = useState<dataStatus>("idle"); //статус данных
  const [error, setError] = useState<Error | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [cardOfTheDay, setCardOfTheDay] = useState<Card | null>(null);
  const [history, setHistory] = useState<Card[]>([]); //История и
  const [favorites, setFavorites] = useState<Card[]>([]); //Избранное, в каждом будем хранить максимум 10 карт

  useEffect(() => {
    getCardOfTheDay();
  }, []);

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
    if (status !== "idle") return;
    setError(null);
    setStatus("loading");
    const newCard = await getData();
    if (!newCard) {
      setStatus("error");
      return;
    }
    setCurrentCard(newCard);
    setStatus("ready");
    setHistory((prev) => [newCard, ...prev.slice(0, 9)]);
  }

  //При закрытии карты добавим её в Историю:
  function closeClick() {
    if (!currentCard) return;
    // setHistory((prev) => [currentCard, ...prev.slice(0, 9)]);

    setCurrentCard(null);
    setStatus("idle");
  }

  //При нажатии лайка удалим (по айди) или добавим её в Избранное:
  function favoriteClick() {
    if (!currentCard) return;
    if (favorites.includes(currentCard)) {
      setFavorites((prev) => prev.filter((card: Card) => card !== currentCard));
    } else {
      setFavorites((prev) => [currentCard, ...prev.slice(0, 9)]);
    }
  }

  async function getCardOfTheDay() {
    const today = new Date().toDateString();

    const saved = localStorage.getItem("cardOfTheDay");

    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed.date === today) {
        setCardOfTheDay(parsed.card);
        return parsed.card;
      }
    }

    const newCard = await getData();

    if (!newCard) return null;

    localStorage.setItem(
      "cardOfTheDay",
      JSON.stringify({
        date: today,
        card: newCard,
      }),
    );

    setCardOfTheDay(newCard);

    return newCard;
  }

  function openCard(card: Card) {
    setCurrentCard(card);
    setStatus("ready");
  }

  return (
    <div className="app">
      <ul className="actions">
        <CardOfTheDay
          suiteName={"Карта дня"}
          card={cardOfTheDay}
          onCardClick={openCard}
        />

        <CardsSuite
          suiteName={"История"}
          suiteID={"history"}
          suite={history}
          onCardClick={openCard}
        />

        <CardsSuite
          suiteName={"Избранное"}
          suiteID={"favorites"}
          suite={favorites}
          onCardClick={openCard}
        />
      </ul>

      <div className="board">
        <div
          onClick={crystalClick}
          className={`crystal ${status === "loading" ? "shiny" : ""} ${status === "idle" ? "sleep" : ""}`}
        >
          🔮
        </div>

        {error && (
          <div className="error abs">
            Ошибка 😢 <br /> Попробуйте включить VPN 🪄
          </div>
        )}

        <div
          className={`cardWrapper ${status === "ready" ? "readyCard" : "absentCard"}`}
        >
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
