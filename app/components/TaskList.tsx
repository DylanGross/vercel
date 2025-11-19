'use client';

import { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string; // Ahora es string libre
  dueDate?: string;
  createdAt: string;
}

interface TaskCategory {
  name: string;
  tasks: Task[];
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [serverRestarted, setServerRestarted] = useState(false);

  // Cargar tareas y categorías
  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      const data = await response.json();
      const fetchedTasks = Array.isArray(data.tasks) ? data.tasks : [];
      
      // Detectar si el servidor se reinició (tenemos categorías pero sin tareas)
      const hasStoredCategories = localStorage.getItem('taskCategories');
      if (hasStoredCategories && fetchedTasks.length === 0 && tasks.length === 0) {
        // Primera carga después de reinicio
        setServerRestarted(true);
      }
      
      setTasks(fetchedTasks);
      
      // Cargar categorías guardadas
      const savedCategories = localStorage.getItem('taskCategories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Error cargando tareas:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Alternar completado
  const toggleTask = async (task: Task) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          completed: !task.completed,
        }),
      });

      if (response.ok) {
        await loadTasks();
      } else {
        console.error('Error al actualizar tarea');
        await loadTasks(); // Recargar para sincronizar
      }
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      await loadTasks();
    }
  };

  // Eliminar tarea
  const deleteTask = async (taskId: number) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });

      if (response.ok) {
        await loadTasks();
      } else {
        console.error('Error al eliminar tarea');
        await loadTasks(); // Recargar para sincronizar
      }
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      await loadTasks();
    }
  };

  // Agregar tarea
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedCategory.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTaskTitle,
          priority: 'medium',
          category: selectedCategory
        }),
      });

      if (response.ok) {
        setNewTaskTitle('');
        setShowAddTask(false);
        await loadTasks();
      }
    } catch (error) {
      console.error('Error creando tarea:', error);
    }
  };

  // Agregar categoría
  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    // Guardar categoría en localStorage
    const newCategories = [...categories, newCategoryName];
    setCategories(newCategories);
    localStorage.setItem('taskCategories', JSON.stringify(newCategories));
    
    setSelectedCategory(newCategoryName);
    setNewCategoryName('');
    setShowAddCategory(false);
    setShowAddTask(true);
  };

  // Editar tarea
  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const saveEditTask = async (taskId: number) => {
    if (!editingTaskTitle.trim()) {
      cancelEdit();
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          title: editingTaskTitle,
        }),
      });

      if (response.ok) {
        setEditingTaskId(null);
        setEditingTaskTitle('');
        await loadTasks();
      } else {
        console.error('Error al editar tarea');
        // Si falla, recargar para sincronizar
        await loadTasks();
        cancelEdit();
      }
    } catch (error) {
      console.error('Error editando tarea:', error);
      await loadTasks();
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Agrupar tareas por categoría + incluir categorías sin tareas
  const allCategories = new Set([...categories]);
  tasks.forEach(task => {
    if (task.category) allCategories.add(task.category);
  });

  const categoryList: TaskCategory[] = Array.from(allCategories).map(name => ({
    name,
    tasks: tasks.filter(t => t.category === name)
  }));

  const priorityIcons = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-purple-500/30 p-4">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  // Vista vacía - sin categorías
  if (categoryList.length === 0) {
    return (
      <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-purple-500/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">📋 Mis Listas</h3>
          <button
            onClick={() => setShowAddCategory(true)}
            className="text-purple-400 hover:text-purple-300 text-2xl"
            title="Crear lista"
          >
            ➕
          </button>
        </div>

        {showAddCategory ? (
          <form onSubmit={addCategory} className="space-y-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nombre de la lista (ej: Cocina, Trámites...)"
              className="w-full px-3 py-2 rounded bg-purple-900/30 border border-purple-500/50 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-400"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors"
              >
                Crear
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-400 text-sm">Sin listas. ¡Crea una con ➕!</p>
        )}
      </div>
    );
  }

  // Vista con categorías
  return (
    <div className="space-y-3">
      {/* Advertencia de servidor reiniciado */}
      {serverRestarted && (
        <div className="bg-yellow-900/30 backdrop-blur-sm rounded-lg border border-yellow-500/50 p-3">
          <div className="flex items-start gap-2">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="text-yellow-200 text-xs font-semibold">Servidor reiniciado - Tareas perdidas</p>
              <p className="text-yellow-200/80 text-xs mt-1">
                Las tareas se guardaban en memoria temporal. Tus listas están guardadas, pero necesitas recrear las tareas.
              </p>
              <button
                onClick={() => setServerRestarted(false)}
                className="mt-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs font-medium"
              >
                Ok, entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón para nueva categoría */}
      <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-purple-500/30 p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">📋 Mis Listas</h3>
          <button
            onClick={() => setShowAddCategory(true)}
            className="text-purple-400 hover:text-purple-300 text-xl"
            title="Nueva lista"
          >
            ➕
          </button>
        </div>

        {showAddCategory && (
          <form onSubmit={addCategory} className="mt-3 space-y-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nombre de la nueva lista..."
              className="w-full px-3 py-2 rounded bg-purple-900/30 border border-purple-500/50 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-400"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium"
              >
                Crear
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
              >
                ✖️
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Listas de tareas por categoría */}
      <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
        {categoryList.map((category) => (
          <div
            key={category.name}
            className="bg-black/30 backdrop-blur-sm rounded-lg border border-purple-500/30 p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-purple-300">
                {category.name}
                <span className="text-xs text-gray-400 ml-2">
                  ({category.tasks.filter(t => !t.completed).length}/{category.tasks.length})
                </span>
              </h4>
              <button
                onClick={() => {
                  setSelectedCategory(category.name);
                  setShowAddTask(true);
                }}
                className="text-purple-400 hover:text-purple-300 text-lg"
                title="Agregar tarea"
              >
                ➕
              </button>
            </div>

            {/* Formulario agregar tarea */}
            {showAddTask && selectedCategory === category.name && (
              <form onSubmit={addTask} className="mb-2 space-y-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Nueva tarea..."
                  className="w-full px-2 py-1.5 rounded bg-purple-900/30 border border-purple-500/50 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium"
                  >
                    Agregar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTask(false);
                      setNewTaskTitle('');
                    }}
                    className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
                  >
                    ✖️
                  </button>
                </div>
              </form>
            )}

            {/* Tareas */}
            <div className="space-y-1.5">
              {category.tasks.length === 0 ? (
                <p className="text-gray-500 text-xs italic py-2">Lista vacía</p>
              ) : (
                category.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-2 p-2 rounded border transition-all ${
                      task.completed
                        ? 'bg-green-900/20 border-green-500/30'
                        : 'bg-purple-900/20 border-purple-500/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                      className="mt-0.5 w-4 h-4 rounded border-2 border-purple-500 bg-transparent checked:bg-purple-600 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      {editingTaskId === task.id ? (
                        <form onSubmit={(e) => { e.preventDefault(); saveEditTask(task.id); }} className="space-y-1">
                          <input
                            type="text"
                            value={editingTaskTitle}
                            onChange={(e) => setEditingTaskTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') cancelEdit();
                              if (e.key === 'Enter') saveEditTask(task.id);
                            }}
                            className="w-full px-2 py-1 rounded bg-purple-900/30 border border-purple-500/50 text-white text-sm"
                            autoFocus
                          />
                        </form>
                      ) : (
                        <div>
                          <p 
                            className={`text-sm cursor-pointer ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}
                            onDoubleClick={() => startEditTask(task)}
                            title="Doble click para editar"
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-xs">
                              {priorityIcons[task.priority]}
                            </span>
                            {task.dueDate && (
                              <span className="text-xs text-gray-400">
                                📅 {new Date(task.dueDate).toLocaleDateString('es', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1">
                      {editingTaskId !== task.id && (
                        <button
                          onClick={() => startEditTask(task)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                          title="Editar"
                        >
                          ✏️
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
