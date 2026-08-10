// netlify/functions/chat.js - CON DEEPSEEK Y LOGS
export default async (request, context) => {
  console.log('🚀 Función chat ejecutada');

  if (request.method !== 'POST') {
    console.log('❌ Método no permitido:', request.method);
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    console.log('📥 Procesando solicitud POST...');
    const { messages } = await request.json();
    console.log('📨 Mensajes recibidos:', messages.length);
    
    const userMessage = messages[messages.length - 1]?.content || '';
    console.log('💬 Último mensaje:', userMessage);

    const apiKey = 'sk-789a0300a29748afa638c00efd441bdc';
    console.log('🔑 Clave API configurada');

    const systemPrompt = `Eres el asistente de Reflections Audio Visual, un fotógrafo profesional en Dallas, Texas.
    
    INFORMACIÓN DEL NEGOCIO:
    - Nombre: Reflections Audio Visual
    - Especialidad: Fotografía y video para bodas, proposals, eventos sociales
    - Ubicación: Dallas, Texas
    - Email: reflectionsmedia56@gmail.com
    - Teléfono: 972-684-1773
    - Instagram: @reflections_audiovisual
    - Website: https://messagesassitant.netlify.app/
    
    PRECIOS:
    - Sesión de 1 hora: $200
    - Sesión de 2 horas: $350
    - Bodas (cobertura completa): $1,500
    - Eventos corporativos: desde $500
    - Servicios de video: desde $300
    
    INSTRUCCIONES:
    1. Responde SIEMPRE en el MISMO IDIOMA que el usuario (español o inglés)
    2. Sé amable, profesional y entusiasta
    3. Si preguntan por precios, da la información exacta
    4. Si quieren agendar una cita, solicita: nombre, email, teléfono y servicio
    5. Siempre ofrece el email o teléfono para más información
    6. Usa emojis para hacer la conversación más amigable (📸, 🎉, 😊)`;

    console.log('📤 Enviando a DeepSeek...');
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-20)
        ],
        stream: true,
        max_tokens: 500,
        temperature: 0.7
      })
    });

    console.log('📥 Respuesta de DeepSeek:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de DeepSeek:', response.status, errorText);
      return new Response(JSON.stringify({
        error: `Error DeepSeek: ${response.status}`
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Respuesta exitosa, devolviendo stream');
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('❌ Error en chat:', error.message);
    return new Response(JSON.stringify({
      error: 'Error: ' + error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

