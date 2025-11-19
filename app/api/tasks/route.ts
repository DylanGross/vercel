import { NextRequest, NextResponse } from 'next/server';
import { createTask, updateTask, deleteTask, searchTasks, getTaskById } from '@/lib/tasks';

// Configuración de runtime
export const runtime = 'edge';

// GET: Buscar tareas
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const filters = {
      query: searchParams.get('query') || undefined,
      completed: searchParams.get('completed') ? searchParams.get('completed') === 'true' : undefined,
      priority: (searchParams.get('priority') as any) || undefined,
      category: (searchParams.get('category') as any) || undefined,
      dueDateFrom: searchParams.get('dueDateFrom') || undefined,
      dueDateTo: searchParams.get('dueDateTo') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || undefined,
      sortOrder: (searchParams.get('sortOrder') as any) || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const tasks = searchTasks(filters);

    return NextResponse.json({
      success: true,
      tasks,
      total: tasks.length,
    });
  } catch (error: any) {
    console.error('Error en GET /api/tasks:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Crear nueva tarea
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validar input
    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'El título es requerido' },
        { status: 400 }
      );
    }

    const task = createTask({
      title: body.title,
      priority: body.priority,
      category: body.category,
      dueDate: body.dueDate,
    });

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error: any) {
    console.error('Error en POST /api/tasks:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar tarea
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.taskId) {
      return NextResponse.json(
        { success: false, error: 'El ID de la tarea es requerido' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.completed !== undefined) updates.completed = body.completed;
    if (body.priority !== undefined) updates.priority = body.priority;
    if (body.category !== undefined) updates.category = body.category;
    if (body.dueDate !== undefined) updates.dueDate = body.dueDate;

    const task = updateTask(body.taskId, updates);

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error: any) {
    console.error('Error en PATCH /api/tasks:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar tarea
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.taskId) {
      return NextResponse.json(
        { success: false, error: 'El ID de la tarea es requerido' },
        { status: 400 }
      );
    }

    const success = deleteTask(body.taskId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Tarea no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tarea eliminada correctamente',
    });
  } catch (error: any) {
    console.error('Error en DELETE /api/tasks:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
