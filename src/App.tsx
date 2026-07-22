import { useEffect, useState } from "react";

import "./App.scss";
import getAdvice from "./api/advise";
import getImageUrl from "./api/image";

import type { Card } from "./types";
import type { AppState } from "./types";

import CardsSuite from "./components/CardsSuite";
import CardOfTheDay from "./components/CardOfTheDay";
import CurrentCard from "./components/CurrentCard";

function App() {
  const [status, setStatus] = useState<AppState>("idle"); //статус данных
  const [error, setError] = useState<Error | null>(null);

  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [cardOfTheDay, setCardOfTheDay] = useState<Card | null>(null);

  const [history, setHistory] = useState<Card[]>(() => {
    const saved = localStorage.getItem("history");
    return saved ? JSON.parse(saved) : [];
  }); //История и
  const [favorites, setFavorites] = useState<Card[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  }); //Избранное, в каждом будем хранить максимум 10 карт

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  async function loadCard() {
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
    const newCard = await loadCard();
    if (!newCard) {
      setStatus("error");
      return;
    }

    setHistory((prev) => [newCard, ...prev.slice(0, 9)]);
    setCurrentCard(newCard);
    setStatus("ready");
  }

  function closeClick() {
    if (!currentCard) return;
    setCurrentCard(null);
    setStatus("idle");
  }

  //При нажатии лайка удалим карту по айди или добавим её в Избранное:
  function favoriteClick() {
    if (!currentCard) return;
    const exists = favorites.some((card) => card.id === currentCard.id);
    if (exists) {
      setFavorites((prev) => prev.filter((card) => card.id !== currentCard.id));
    } else {
      setFavorites((prev) => [currentCard, ...prev.slice(0, 9)]);
    }
  }

  function openCard(card: Card) {
    setCurrentCard(card);
    setStatus("ready");
  }

  useEffect(() => {
    async function initCardOfTheDay() {
      const today = new Date().toDateString();

      const saved = localStorage.getItem("cardOfTheDay");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed.date === today) {
          setCardOfTheDay(parsed.card);
          return;
        }
      }

      const newCard = await loadCard();

      if (!newCard) return;

      localStorage.setItem(
        "cardOfTheDay",
        JSON.stringify({
          date: today,
          card: newCard,
        }),
      );

      setCardOfTheDay(newCard);
    }

    initCardOfTheDay();
  }, []);

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
            <CurrentCard
              card={currentCard}
              closeClick={closeClick}
              favoriteClick={favoriteClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
