import type { Card } from "../types";

type CardsSuiteProps = {
  suiteName: string;
  suiteID: string;
  suite: Card[] | [];
  onCardClick: (card: Card) => void;
};

function CardsSuite({
  suiteName,
  suiteID,
  suite,
  onCardClick,
}: CardsSuiteProps) {
  return (
    <li className={suiteID}>
      <h4>{suiteName}</h4>
      <ul>
        {suite.map((card, index) => (
          <li key={`${suiteID}}_${index}`} onClick={() => onCardClick(card)}>
            {card.advice.slice(0, 20)}...
          </li>
        ))}
      </ul>
    </li>
  );
}

export default CardsSuite;
