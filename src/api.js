
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const runAgent = async (systemInstruction, userInput) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Task: ${userInput}` }
        ],
        model: "llama-3.3-70b-versatile", 
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Groq Error:", data.error);
      return `⚠️ Error: ${data.error.message}`;
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error("Network Error:", error);
    return "⚠️ Connection Failed. Check Console.";
  }
};