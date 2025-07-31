const axios = require('axios');
require('dotenv').config();

const mistralClient = axios.create({
  baseURL: 'https://api.mistral.ai/v1',
  headers: {
    'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

async function queryMistral(prompt, userInput) {
  try {
    const response = await mistralClient.post('/chat/completions', {
      model: "mistral-tiny",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userInput }
      ],
      temperature: 0.7
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Mistral:", error.response?.data || error.message);
    throw new Error("Error en la generación de respuesta");
  }
}

module.exports = { queryMistral };
