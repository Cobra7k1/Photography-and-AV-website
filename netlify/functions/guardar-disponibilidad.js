// netlify/functions/guardar-disponibilidad.js
import fs from 'node:fs';
import path from 'node:path';

export default async (request, context) => {
  // Solo permitir POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Leer datos enviados
    const data = await request.json();
    const { fechas } = data;
    
    if (!fechas || typeof fechas !== 'object') {
      return new Response(JSON.stringify({ error: 'Datos inválidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ruta al archivo JSON (relativo al proyecto)
    const filePath = path.join(process.cwd(), 'src', 'data', 'disponibilidad.json');
    
    // Leer archivo existente para mantener estructura
    const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    existingData.fechas = fechas;
    
    // Guardar archivo
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');
    
    return new Response(JSON.stringify({ 
      success: true, 
      fechas: fechas,
      message: 'Disponibilidad actualizada correctamente'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error al guardar:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al guardar: ' + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
