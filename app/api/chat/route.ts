import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getAllTasks, getTaskStats } from '@/lib/tasks';

// Configuración
export const runtime = 'edge';

// Crear cliente OpenAI apuntando a OpenRouter
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Obtener todas las tareas para incluirlas en el contexto
    const allTasks = getAllTasks();
    const stats = getTaskStats('all-time');

    // Formatear las tareas para el contexto
    const tasksContext = allTasks.length > 0 
      ? `\n\nTareas actuales del usuario:\n${allTasks.map((t: any) => 
          `- [${t.completed ? '✅' : '⬜'}] ${t.title} (Prioridad: ${t.priority}, Categoría: ${t.category}${t.dueDate ? ', Vence: ' + t.dueDate : ''})`
        ).join('\n')}\n\nEstadísticas:\n- Total: ${stats.summary.totalTasks}\n- Completadas: ${stats.summary.completedTasks}\n- Pendientes: ${stats.summary.pendingTasks}\n- Por prioridad: Alta=${stats.byPriority.high.total}, Media=${stats.byPriority.medium.total}, Baja=${stats.byPriority.low.total}`
      : '\n\nEl usuario aún no tiene tareas creadas.';

    const response = await client.chat.completions.create({
      model: 'meta-llama/llama-3.2-3b-instruct:free',
      stream: true,
      messages: [
        {
          role: 'system',
          content: `Eres un asistente de consulta de tareas. Tu función es SOLO ver y analizar las tareas del usuario para responder sus preguntas.

IMPORTANTE:
- NO puedes crear, modificar o eliminar tareas
- Solo puedes ver las tareas existentes y proporcionar información sobre ellas
- Si el usuario pide crear/modificar/eliminar una tarea, explícale amablemente que debe usar los botones de gestión manual en el panel lateral izquierdo (botón ➕)
- Puedes proporcionar resúmenes, estadísticas, recordatorios y análisis de las tareas existentes${tasksContext}`,
        },
        ...messages,
      ],
    });

    const stream = OpenAIStream(response as any);
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
