async function getImageUrl(): Promise<string> {
  return `https://picsum.photos/300?random=${Date.now()}`;
}

export default getImageUrl;
