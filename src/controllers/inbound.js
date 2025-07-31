const { queryMistral } = require('../services/mistralService');
const { PROMPTS } = require('../config/constants');

async function handleInboundCall(req, res) {
  const { speech, call_sid } = req.body;
  const wss = req.app.locals.wss; // Acceso al WebSocketServer

  if (!speech) {
    return res.status(400).json({ error: "No se recibió transcripción de voz" });
  }

  try {
    // Notificación WebSocket de inicio de procesamiento
    broadcastWs(wss, {
      event: 'call_processing_start',
      call_sid,
      timestamp: new Date().toISOString()
    });

    const { prompt, intent } = determineIntent(speech);
    const aiResponse = await queryMistral(prompt, speech);

    // Notificación WebSocket de respuesta exitosa
    broadcastWs(wss, {
      event: 'call_processed',
      call_sid,
      intent,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      response: aiResponse, 
      call_sid,
      intent 
    });

  } catch (error) {
    console.error(`Error en call_sid ${call_sid}:`, error);
    
    // Notificación WebSocket de error
    broadcastWs(wss, {
      event: 'call_error',
      call_sid,
      error: error.message,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({ 
      error: "Error al procesar la solicitud",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Helper: Determina intención y prompt
function determineIntent(speech) {
  const lowerCaseSpeech = speech.toLowerCase();
  
  const intentMap = [
    { regex: /enviar|correo|email/i, intent: 'ENVIAR_CORREO', prompt: PROMPTS.ENVIAR_CORREO },
    { regex: /técnico|problema técnico|error|fallo/i, intent: 'CONTACTO_TECNICO', prompt: PROMPTS.CONTACTO_TECNICO },
    { regex: /tarjeta ciudadana|key smart city|ciudadana/i, intent: 'TARJETA_CIUDADANA', prompt: PROMPTS.TARJETA_CIUDADANA },
    { regex: /skipass|forfait|esquí|ski/i, intent: 'TARJETA_SKIPASS', prompt: PROMPTS.TARJETA_SKIPASS },
    { regex: /kit digital|digitalización|digital/i, intent: 'KIT_DIGITAL', prompt: PROMPTS.KIT_DIGITAL }
  ];

  const matchedIntent = intentMap.find(item => item.regex.test(lowerCaseSpeech));
  
  return matchedIntent || { 
    intent: 'NO_ESPECIFICADO', 
    prompt: PROMPTS.NO_ESPECIFICADO 
  };
}

// Helper: Broadcast WebSocket
function broadcastWs(wss, data) {
  if (!wss) return;
  
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = {
  handleInboundCall
};
