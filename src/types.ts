export type Card = {
  id: string;
  advice: string;
  image: string;
};

export type AppState = "idle" | "loading" | "ready" | "error";
