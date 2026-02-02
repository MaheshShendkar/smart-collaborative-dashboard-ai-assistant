import fetch from "node-fetch";

export const generateAIResponse = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Error:", data);
      throw new Error(data?.error?.message || "Gemini API error");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini AI Error:", error.message);
    throw new Error("AI service unavailable");
  }
};
