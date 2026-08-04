// netlify/functions/chat.js - CON DEEPSEEK
export default async (request, context) => {
  // Solo acepta POST
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { messages } = await request.json();

    // Obtener la clave de API de las variables de entorno
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Falta la clave de API de DeepSeek' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash", // Modelo rápido y económico [citation:4]
        messages: [
          { 
            role: 'system', 
            content: `Eres el asistente de Reflections Audio Visual, un fotógrafo profesional en Dallas, Texas.
            
            Información de contacto:
            - Email: reflectionsmedia56@gmail.com
            - Teléfono: 972-684-1773
            - Instagram: @reflections_audiovisual
            - Precios: Sesión 1h $200, 2h $350, Bodas $1,500
            
            Responde en el mismo idioma que el usuario.
            Sé amable y profesional.`
          },
          ...messages.slice(-20)
        ],
        stream: true,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de DeepSeek:', response.status, errorText);
      return new Response(JSON.stringify({
        error: `Error DeepSeek: ${response.status}`
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('Error en chat:', error);
    return new Response(JSON.stringify({
      error: 'Error: ' + error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
