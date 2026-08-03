// src/functions/test.js
export const onRequest = async (context) => {
  return new Response(JSON.stringify({ 
    message: '¡La función funciona correctamente!',
    method: context.request.method,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
