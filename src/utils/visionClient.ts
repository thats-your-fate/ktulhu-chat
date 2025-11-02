export async function analyzeImage(file: File): Promise<any> {
  const apiKey = import.meta.env.VITE_GVISION_KEY;
  if (!apiKey) throw new Error("Google Vision API key missing in .env");

  const base64 = await fileToBase64(file);

  const body = {
    requests: [
      {
        image: { content: base64 },
        features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
      },
    ],
  };

  const res = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) throw new Error("Vision API request failed");
  return res.json();
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
                