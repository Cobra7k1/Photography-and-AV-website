echo 'export const onRequest = async (context) => {
  return new Response(JSON.stringify({ 
    message: "¡La función funciona correctamente!" 
  }), {
    headers: { "Content-Type": "application/json" }
  });
};' > src/functions/test.js