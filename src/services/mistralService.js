// services/mistralService.js
const mistralClient = require('../config/mistral');

const queryMistral = async (prompt, userMessage) => {
  try {
    const response = await mistralClient.post('/chat/completions', {
      model: process.env.MISTRAL_MODEL || "mistral-tiny",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    if (!response.data.choices?.[0]?.message?.content) {
      throw new Error('Respuesta inesperada de la API');
    }
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error en mistralService:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error("No se pudo generar la respuesta. Por favor, inténtalo de nuevo.");
  }
};

module.exports = { queryMistral };
