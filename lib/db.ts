import Database from 'better-sqlite3';

// Tipos
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'shopping' | 'health' | 'other';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface TaskInput {
  title: string;
  priority?: 'low' | 'medium' | 'high';
  category?: 'work' | 'personal' | 'shopping' | 'health' | 'other';
  dueDate?: string;
}

export interface TaskUpdate {
  title?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: 'work' | 'personal' | 'shopping' | 'health' | 'other';
  dueDate?: string | null;
}

export interface SearchFilters {
  query?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: 'work' | 'personal' | 'shopping' | 'health' | 'other';
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

// Inicializar base de datos
let db: Database.Database | null = null;

export function getDatabase() {
  if (db) return db;

  const dbPath = process.cwd() + '/tasks.db';
  db = new Database(dbPath);

  // Crear tabla si no existe
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL CHECK(length(title) > 0),
      completed INTEGER DEFAULT 0 CHECK(completed IN (0, 1)),
      priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
      category TEXT DEFAULT 'other' CHECK(category IN ('work', 'personal', 'shopping', 'health', 'other')),
      dueDate TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      deleted INTEGER DEFAULT 0 CHECK(deleted IN (0, 1))
    )
  `);

  // Crear índices para búsquedas eficientes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_completed ON tasks(completed);
    CREATE INDEX IF NOT EXISTS idx_priority ON tasks(priority);
    CREATE INDEX IF NOT EXISTS idx_category ON tasks(category);
    CREATE INDEX IF NOT EXISTS idx_dueDate ON tasks(dueDate);
    CREATE INDEX IF NOT EXISTS idx_deleted ON tasks(deleted);
  `);

  return db;
}

// Convertir row de DB a Task (utility function)
export function rowToTask(row: any): Task {
  return {
    ...row,
    completed: Boolean(row.completed),
    deleted: Boolean(row.deleted),
  } as Task;
}
