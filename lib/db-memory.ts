// Tipos
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string; // Ahora es string libre para categorías personalizadas
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface TaskInput {
  title: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string; // Ahora acepta cualquier string
  dueDate?: string;
}

export interface TaskUpdate {
  title?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string; // Ahora acepta cualquier string
  dueDate?: string | null;
}

export interface SearchFilters {
  query?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string; // Ahora acepta cualquier string
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

// Base de datos en memoria
let tasks: Task[] = [];
let nextId = 1;

export function getAllTasks(): Task[] {
  return tasks.filter(t => !t.deleted);
}

export function getTaskById(id: number): Task | null {
  return tasks.find(t => t.id === id && !t.deleted) || null;
}

export function createTask(input: TaskInput): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: nextId++,
    title: input.title,
    completed: false,
    priority: input.priority || 'medium',
    category: input.category || 'General',
    dueDate: input.dueDate || null,
    createdAt: now,
    updatedAt: now,
    deleted: false,
  };
  tasks.push(task);
  return task;
}

export function updateTask(id: number, updates: TaskUpdate): Task {
  const task = getTaskById(id);
  if (!task) throw new Error('Tarea no encontrada');

  if (updates.title !== undefined) task.title = updates.title;
  if (updates.completed !== undefined) task.completed = updates.completed;
  if (updates.priority !== undefined) task.priority = updates.priority;
  if (updates.category !== undefined) task.category = updates.category;
  if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
  task.updatedAt = new Date().toISOString();

  return task;
}

export function deleteTask(id: number): boolean {
  const task = getTaskById(id);
  if (!task) return false;
  task.deleted = true;
  task.updatedAt = new Date().toISOString();
  return true;
}

export function searchTasks(filters: SearchFilters = {}): Task[] {
  let results = getAllTasks();

  if (filters.query) {
    results = results.filter(t => t.title.toLowerCase().includes(filters.query!.toLowerCase()));
  }

  if (filters.completed !== undefined) {
    results = results.filter(t => t.completed === filters.completed);
  }

  if (filters.priority) {
    results = results.filter(t => t.priority === filters.priority);
  }

  if (filters.category) {
    results = results.filter(t => t.category === filters.category);
  }

  if (filters.dueDateFrom) {
    results = results.filter(t => t.dueDate && t.dueDate >= filters.dueDateFrom!);
  }

  if (filters.dueDateTo) {
    results = results.filter(t => t.dueDate && t.dueDate <= filters.dueDateTo!);
  }

  // Ordenar
  const sortBy = filters.sortBy || 'createdAt';
  const sortOrder = filters.sortOrder || 'desc';
  results.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const comparison = aVal! < bVal! ? -1 : aVal! > bVal! ? 1 : 0;
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return results.slice(0, filters.limit || 50);
}

export function getTaskStats(period: 'today' | 'week' | 'month' | 'year' | 'all-time' = 'all-time') {
  const allTasks = getAllTasks();
  const now = new Date();
  
  let filteredTasks = allTasks;
  if (period !== 'all-time') {
    const startDate = new Date();
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    filteredTasks = allTasks.filter(t => new Date(t.createdAt) >= startDate);
  }

  const completed = filteredTasks.filter(t => t.completed);
  const pending = filteredTasks.filter(t => !t.completed);
  const overdue = pending.filter(t => t.dueDate && new Date(t.dueDate) < now);

  const byPriority: any = {};
  ['low', 'medium', 'high'].forEach(p => {
    const tasks = filteredTasks.filter(t => t.priority === p);
    byPriority[p] = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
    };
  });

  const byCategory: any = {};
  ['work', 'personal', 'shopping', 'health', 'other'].forEach(c => {
    const tasks = filteredTasks.filter(t => t.category === c);
    byCategory[c] = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
    };
  });

  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    summary: {
      totalTasks: filteredTasks.length,
      completedTasks: completed.length,
      pendingTasks: pending.length,
      completionRate: filteredTasks.length > 0 ? Math.round((completed.length / filteredTasks.length) * 100 * 100) / 100 : 0,
      overdueTasks: overdue.length,
    },
    byPriority,
    byCategory,
    upcoming: {
      dueTodayCount: pending.filter(t => t.dueDate && new Date(t.dueDate) <= todayEnd).length,
      dueThisWeekCount: pending.filter(t => t.dueDate && new Date(t.dueDate) <= weekEnd).length,
      nextDueTask: pending.filter(t => t.dueDate).sort((a, b) => a.dueDate! < b.dueDate! ? -1 : 1)[0] || null,
    },
  };
}
