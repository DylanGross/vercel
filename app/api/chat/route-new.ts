import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Configuración
export const runtime = 'nodejs';
export const maxDuration = 30;

// Crear provider de OpenRouter
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Usar streamText SIN herramientas primero para validar que funcione
    const result = streamText({
      model: openrouter('meta-llama/llama-3.2-3b-instruct:free'),
      system: 'Eres un asistente útil que ayuda con la gestión de tareas.',
      messages,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
