import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { NextRequest } from 'next/server';

// Configuración de OpenRouter usando el SDK de OpenAI
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
    'X-Title': 'Chatbot Next.js',
  },
});

// Configuración de runtime de Edge para mejor performance
export const runtime = 'edge';

// Función para sanitizar el input del usuario
function sanitizeInput(input: string): string {
  // Remover caracteres potencialmente peligrosos
  return input.trim().slice(0, 4000); // Limitar a 4000 caracteres
}

// Validar el request
function validateRequest(messages: any[]): { valid: boolean; error?: string } {
  if (!messages || !Array.isArray(messages)) {
    return { valid: false, error: 'Messages must be an array' };
  }

  if (messages.length === 0) {
    return { valid: false, error: 'Messages array cannot be empty' };
  }

  for (const message of messages) {
    if (!message.role || !message.content) {
      return { valid: false, error: 'Each message must have role and content' };
    }
    if (!['user', 'assistant', 'system'].includes(message.role)) {
      return { valid: false, error: 'Invalid message role' };
    }
  }

  return { valid: true };
}

export async function POST(req: NextRequest) {
  try {
    // Verificar que la API key esté configurada
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'sk-or-v1-your-api-key-here') {
      return new Response(
        JSON.stringify({ 
          error: 'API key no configurada. Por favor configura OPENROUTER_API_KEY en .env.local' 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse del body
    const { messages } = await req.json();

    // Validar el request
    const validation = validateRequest(messages);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Sanitizar los mensajes
    const sanitizedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: sanitizeInput(msg.content),
    }));

    // Llamada a OpenRouter
    const response = await openrouter.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
      stream: true,
      messages: sanitizedMessages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Convertir la respuesta a un stream
    const stream = OpenAIStream(response);

    // Retornar el stream al cliente
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error('Error en API route:', error);
    
    // Manejo de errores específicos
    if (error?.status === 401) {
      return new Response(
        JSON.stringify({ error: 'API key inválida' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (error?.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Límite de requests excedido. Por favor espera un momento.' }),
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: 'Error al procesar la solicitud',
        details: error?.message || 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
