// src/functions/chat.js
import OpenAI from "openai";

export const onRequest = async (context) => {
  // Solo acepta POST
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { messages } = await context.request.json();

    const systemPrompt = `Eres un asistente virtual para Reflections Audio Visual, un servicio profesional de fotografía y video.
    
    INFORMACIÓN DEL NEGOCIO:
    - Nombre: Reflections Audio Visual
    - Especialidad: Fotografía de bodas, proposals, eventos sociales, sesiones para músicos
    - Ubicación: Dallas, Texas
    - Email: reflectionsmedia56@gmail.com
    - Teléfono: 972-684-1773
    - Instagram: @reflections_audiovisual
    - Website: https://lucent-starburst-4d93c6.netlify.app/`;

    const openai = new OpenAI();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-20)
      ],
      stream: true,
      max_tokens: 500,
      temperature: 0.7
    });

    return new Response(response.toReadableStream(), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Error en chat:', error);
    return new Response(JSON.stringify({
      error: 'Lo siento, hubo un error. Por favor, intenta de nuevo.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};