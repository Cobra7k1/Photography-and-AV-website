// netlify/functions/chat.js
import OpenAI from "openai";

export default async (request, context) => {
  // Solo acepta POST
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { messages } = await request.json();

    const systemPrompt = `Eres un asistente virtual para Reflections Audio Visual, un servicio profesional de fotografía y video.
    
    INFORMACIÓN DEL NEGOCIO:
    - Nombre: Reflections Audio Visual
    - Especialidad: Fotografía de bodas, proposals, eventos sociales, sesiones para músicos
    - Ubicación: Dallas, Texas
    - Email: reflectionsmedia56@gmail.com
    - Teléfono: 972-684-1773
    - Instagram: @reflections_audiovisual
    - Website: https://lucent-starburst-4d93c6.netlify.app/
    
    RESPUESTAS:
    1. Responde en el MISMO IDIOMA que te escriben (inglés o español)
    2. Sé amable, profesional y entusiasta
    3. Si preguntan sobre precios, da la información que tengas
    4. Si quieren agendar una cita, solicita: nombre, email, teléfono y servicio
    5. Ofrece siempre el número de contacto o email para más información`;

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