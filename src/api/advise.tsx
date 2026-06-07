async function getAdvice(): Promise<string> {
  const res = await fetch("https://api.api-ninjas.com/v1/advice", {
    headers: {
      "X-Api-Key": import.meta.env.VITE_API_KEY,
    },
  });
  console.log("FETCH advice");

  if (!res.ok) {
    throw new Error("Failed to fetch advice");
  }

  const data = await res.json();

  console.log(`data.advice = ${data.advice}`);
  return data.advice;
}

export default getAdvice;
