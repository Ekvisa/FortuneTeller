import type { Card } from "../types";

type CardOfTheDayProps = {
  suiteName: string;

  card: Card | null;
  onCardClick: (card: Card) => void;
};

function CardOfTheDay({
  suiteName,

  card,
  onCardClick,
}: CardOfTheDayProps) {
  return (
    <>
      <h4>{suiteName}</h4>

      {card && (
        <p onClick={() => onCardClick(card)}>{card.advice.slice(0, 20)}...</p>
      )}
    </>
  );
}

export default CardOfTheDay;
