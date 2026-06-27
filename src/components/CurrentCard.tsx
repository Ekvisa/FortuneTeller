import type { Card } from "../types";

import close from "../assets/buttons/close.svg";
import heart from "../assets/buttons/heart.svg";

type CurrentCardProps = {
  card: Card;
  closeClick: () => void;
  favoriteClick: () => void;
};

function CurrentCard({ card, closeClick, favoriteClick }: CurrentCardProps) {
  return (
    <div className="card">
      <div className="data">
        <p>{card.advice}</p>
        <img src={card.image} alt="image" />
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
  );
}

export default CurrentCard;
