// async function getImageUrl(): Promise<string> {
//   const res = await fetch("https://api.api-ninjas.com/v1/randomimage", {
//     headers: {
//       "X-Api-Key": import.meta.env.VITE_API_KEY,
//     },
//   });
//   console.log("FETCH image");
//   console.log(res.headers.get("Content-Type"));

//   if (!res.ok) {
//     throw new Error("Failed to fetch image");
//   }

//   const blob = await res.blob();

//   const fixedBlob = new Blob([blob], { type: "image/jpeg" });

//   if (!blob.type.startsWith("image/")) {
//     throw new Error("Not an image");
//   }

//   console.log("blob size:", blob.size);
//   console.log("type:", blob.type);

//   const text = await blob.text();
//   console.log(text.slice(0, 200));

//   const url = URL.createObjectURL(fixedBlob);
//   console.log("url:", url);

//   //   return url;
//   return res.url;
// }

async function getImageUrl(): Promise<string> {
  return `https://picsum.photos/300?grayscale&?random=${Date.now()}`;
}

export default getImageUrl;
