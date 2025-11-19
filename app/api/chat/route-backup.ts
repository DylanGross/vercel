import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createTask, updateTask, deleteTask, searchTasks, getTaskStats } from '@/lib/tasks';

// Configuración
export const runtime = 'nodejs';
export const maxDuration = 30;

// Crear provider de OpenRouter
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

// Definir las herramientas para OpenAI
const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'createTask',
      description: 'Crear una nueva tarea en el sistema',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Título de la tarea' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Prioridad' },
          category: { type: 'string', enum: ['work', 'personal', 'shopping', 'health', 'other'], description: 'Categoría' },
          dueDate: { type: 'string', description: 'Fecha límite (YYYY-MM-DD)' },
        },
        required: ['title'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'updateTask',
      description: 'Modificar una tarea existente',
      parameters: {
        type: 'object',
        properties: {
          taskId: { type: 'number', description: 'ID de la tarea' },
          title: { type: 'string', description: 'Nuevo título' },
          completed: { type: 'boolean', description: 'Estado completado' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          category: { type: 'string', enum: ['work', 'personal', 'shopping', 'health', 'other'] },
          dueDate: { type: 'string', description: 'Nueva fecha límite' },
        },
        required: ['taskId'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'deleteTask',
      description: 'Eliminar una tarea',
      parameters: {
        type: 'object',
        properties: {
          taskId: { type: 'number', description: 'ID de la tarea' },
        },
        required: ['taskId'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'searchTasks',
      description: 'Buscar y filtrar tareas',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Texto a buscar' },
          completed: { type: 'boolean', description: 'Filtrar por completadas' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          category: { type: 'string', enum: ['work', 'personal', 'shopping', 'health', 'other'] },
        },
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'getTaskStats',
      description: 'Obtener estadísticas de productividad',
      parameters: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['today', 'week', 'month', 'year', 'all-time'] },
        },
      },
    },
  },
];

// Ejecutar herramienta
function executeTool(name: string, args: any) {
  try {
    switch (name) {
      case 'createTask':
        return createTask(args);
      case 'updateTask':
        return updateTask(args.taskId, args);
      case 'deleteTask':
        return deleteTask(args.taskId) ? { success: true } : { error: 'No encontrada' };
      case 'searchTasks':
        return searchTasks(args);
      case 'getTaskStats':
        return getTaskStats(args.period || 'all-time');
      default:
        return { error: 'Herramienta no encontrada' };
    }
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function POST(req: Request) {
  try {
    // Verificar API key
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

    const { messages } = await req.json();

    // Validar mensajes
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Mensajes inválidos' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // System prompt para el AI Todo Manager
    const systemMessage = {
      role: 'system',
      content: `Eres un asistente inteligente de gestión de tareas llamado "AI Todo Manager". 

Tu función es ayudar a los usuarios a organizar sus tareas de manera conversacional y natural.

Tienes acceso a 5 herramientas poderosas:
1. createTask: Para crear nuevas tareas
2. updateTask: Para modificar tareas existentes (marcar como completadas, cambiar prioridad, etc.)
3. deleteTask: Para eliminar tareas
4. searchTasks: Para buscar y filtrar tareas
5. getTaskStats: Para generar estadísticas de productividad

Comportamiento:
- Sé amigable, útil y proactivo
- Cuando el usuario mencione una tarea por su título pero no tengas el ID, usa searchTasks primero
- Para acciones destructivas (eliminar), confirma con el usuario si no está seguro
- Presenta la información de forma clara y organizada
- Usa emojis para hacer la experiencia más agradable: ✅ ⚡ 📅 🏷️ 📊 🎉
- Cuando muestres listas de tareas, usa formato claro con bullets
- Celebra los logros del usuario (tareas completadas, buena productividad)
- Sugiere acciones útiles cuando sea apropiado

Prioridades:
- low (baja): 🟢
- medium (media): 🟡  
- high (alta): 🔴

Categorías:
- work: 💼
- personal: 🏠
- shopping: 🛒
- health: 🏥
- other: 📌

Recuerda: Tu objetivo es hacer que la gestión de tareas sea simple, eficiente y hasta divertida.`,
    };

    // Hacer la llamada sin streaming primero para depurar
    const response = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
      messages: [systemMessage, ...messages] as any,
      tools: tools as any,
      temperature: 0.7,
      stream: false, // Sin streaming para depurar
    });

    // Si hay tool calls, ejecutarlos
    if (response.choices[0].message.tool_calls) {
      const toolCalls = response.choices[0].message.tool_calls;
      const toolResults = [];

      for (const toolCall of toolCalls) {
        const result = executeTool(
          toolCall.function.name,
          JSON.parse(toolCall.function.arguments)
        );
        toolResults.push({
          tool_call_id: toolCall.id,
          role: 'tool' as const,
          name: toolCall.function.name,
          content: JSON.stringify(result),
        });
      }

      // Segunda llamada con los resultados
      const finalResponse = await openai.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          systemMessage,
          ...messages,
          response.choices[0].message,
          ...toolResults,
        ] as any,
        temperature: 0.7,
        stream: false,
      });

      return new Response(
        JSON.stringify({
          id: finalResponse.id,
          object: 'chat.completion',
          created: finalResponse.created,
          model: finalResponse.model,
          choices: finalResponse.choices,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Sin tool calls, devolver respuesta directa
    return new Response(
      JSON.stringify({
        id: response.id,
        object: 'chat.completion',
        created: response.created,
        model: response.model,
        choices: response.choices,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error en API route:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Error interno del servidor' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
