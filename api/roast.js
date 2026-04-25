export default async function handler(req, res) {
  const { resume, tone } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      messages: [
        {
          role: "user",
          content: `Tone: ${tone}
Resume:
${resume}

Format:
Roast
Red Flags
Fix Tips`
        }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
