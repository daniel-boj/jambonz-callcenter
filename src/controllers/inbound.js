const { queryMistral } = require('../services/mistral');
const { PROMPTS } = require('../config/constants');

async function handleInboundCall(req, res) {
  const { speech, call_sid } = req.body;

  if (!speech) {
    return res.status(400).json({ error: "No se recibió transcripción de voz" });
  }

  try {
    let prompt;
    const lowerCaseSpeech = speech.toLowerCase();

    // Determinar el prompt basado en el contenido del mensaje
    if (/enviar|correo|email/i.test(lowerCaseSpeech)) {
      prompt = PROMPTS.ENVIAR_CORREO;
    } else if (/técnico|problema técnico|error|fallo/i.test(lowerCaseSpeech)) {
      prompt = PROMPTS.CONTACTO_TECNICO;
    } else if (/tarjeta ciudadana|key smart city|ciudadana/i.test(lowerCaseSpeech)) {
      prompt = PROMPTS.TARJETA_CIUDADANA;
    } else if (/skipass|forfait|esquí|ski/i.test(lowerCaseSpeech)) {
      prompt = PROMPTS.TARJETA_SKIPASS;
    } else if (/kit digital|digitalización|digital/i.test(lowerCaseSpeech)) {
      prompt = PROMPTS.KIT_DIGITAL;
    } else {
      prompt = PROMPTS.NO_ESPECIFICADO;
    }

    const aiResponse = await queryMistral(prompt, speech);
    res.json({ response: aiResponse, call_sid });

  } catch (error) {
    console.error(`Error en call_sid ${call_sid}:`, error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
}

module.exports = {
  handleInboundCall
};
