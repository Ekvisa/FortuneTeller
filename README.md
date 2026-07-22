# 🔮 Fortune Teller

A small mystical web application that generates a random prediction card with a magical crystal ball animation.

The user can ask the crystal ball for a prediction, save interesting cards to favorites, review the history of generated cards, and get a daily card that changes once per day.

The project was created as a practice application for React, TypeScript, asynchronous data loading, state management, and working with browser storage.

## ✨ Features

- Generate a new prediction by clicking the crystal ball  
- Display a prediction card with text and an image  
- Daily card that is generated once per day  
- History of generated cards  
- Favorites collection  
- Data persistence using localStorage  
- Animated card appearance  
- Parallel API requests with Promise.all  

## 🛠 Technologies
- React
- TypeScript
- Vite
- SCSS
- localStorage
- REST API
- CSS animations


## 📂 Project structure

```
src
│
├── api
│   ├── advise.ts        # Prediction API request
│   └── image.ts         # Image API request
│
├── assets
│   └── buttons
│       ├── close.svg
│       └── heart.svg
│
├── components
│   ├── CardOfTheDay.tsx
│   ├── CardsSuite.tsx
│   └── CurrentCard.tsx
│
├── types.ts
│
├── App.tsx
└── main.tsx
```

 
## 🃏 Card data model

All cards have the same structure:
```
type Card = {
  id: string;
  advice: string;
  image: string;
};
```
Example:
```
{
  id: "a7d4...",
  advice: "A new opportunity will appear soon",
  image: "https://..."
}
```
The id is used to identify cards in collections such as favorites.

## 🔮 Creating a new card

```
      User clicks crystal
              |
              v
        crystalClick()
              |
              v
          loadCard()
              |
              |
   ---------------------
   |                   |
getAdvice()      getImageUrl()
   |                   |
   -----Promise.all-----
              |
              v
       Create Card object
              |
              v
        Save to history
              |
              v
        Show CurrentCard
```

The text and image are loaded simultaneously:

```
const [adviceText, imageUrl] =
  await Promise.all([
    getAdvice(),
    getImageUrl()
  ]);
```

This reduces waiting time because both requests happen in parallel.

## 🎴 Current card flow

The current card is the card displayed on the "magical table".
```
    currentCard = null
            |
            v
      User opens card
            |
            v
    currentCard = Card
            |
            v
CurrentCard component appears
            |
            |
  ---------------------
  |                   |
Close              Favorite
```

## 📜 History

History contains generated cards.

When a new card is created:
```
setHistory(prev => [
  newCard,
  ...prev.slice(0, 9)
]);
```
The newest cards appear first.

The collection is limited to 10 items.

Data is stored in localStorage.history.

## ❤️ Favorites

Favorites are independent from history.

A card becomes favorite only after clicking the heart button.
```
CurrentCard
     |
     |
  ❤️ click
     |
     v
favorites array
     |
     v
localStorage.favorites
```
Favorites are also limited to 10 cards.

## 🌞 Daily card

The daily card is stored separately.

When the application starts:
```
Application opened
        |
        v
Check localStorage
        |
        |
  -----------------
  |               |
Same date       New date
  |               |
  v               v
Use saved      Create new card
card           and save it
```


Stored format:
```
{
  "date": "Mon Jul 22 2026",
  "card": {
    "id": "...",
    "advice": "...",
    "image": "..."
  }
}
```
## 💾 LocalStorage synchronization

Collections are synchronized with browser storage.

Example:
```
useEffect(() => {
  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );
}, [favorites]);
```
The application restores saved data when it starts.

## 🎨 UI states

The application has several states:
```
   idle
    |
    | user clicks crystal
    |
    v
 loading
    |
    | data received
    |
    v
  ready
    |
    | close card
    |
    v
  idle
```
Errors:
```
Any request failure
    |
    v
error state
```

## 🚧 Possible future improvements

- Export cards as images
- Create a personal saved card deck
- Share cards
- Add card flipping animation
- Add sound effects
- Add more themes
- Add a full-screen magical mode


### This project helped practice:

- React component architecture
- TypeScript typing
- asynchronous JavaScript
- state management
- custom UI interactions
- browser APIs
- separating data logic from presentation

