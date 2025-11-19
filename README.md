# 🎯 AI Todo Manager

Gestor de tareas inteligente con interfaz conversacional usando Next.js, Vercel AI SDK, y OpenRouter.

## ✨ Características

- ✅ **Gestión de Tareas por Conversación Natural**: Crea, actualiza y elimina tareas hablando naturalmente
- ✅ **5 Herramientas Inteligentes**: El AI usa tool calling para ejecutar acciones automáticamente
- ✅ **Búsqueda y Filtros Avanzados**: Encuentra tareas por texto, prioridad, categoría, fecha, etc.
- ✅ **Estadísticas de Productividad**: Analytics completos de tus tareas y progreso
- ✅ **Base de Datos Persistente**: Tus tareas se guardan en SQLite localmente
- ✅ **UI Moderna y Responsiva**: Interfaz con fondo de galaxia animado
- ✅ **Streaming en Tiempo Real**: Respuestas del AI en vivo
- ✅ **Seguridad Implementada**: API keys solo en backend, validación de inputs

## 🔒 Seguridad

Este proyecto implementa las mejores prácticas de seguridad:

- 🔐 API keys **solo en backend** (nunca expuestas al cliente)
- 🛡️ Variables de entorno en `.env.local` (no commiteadas)
- ✂️ Sanitización de todos los inputs del usuario
- 📏 Límite de caracteres (4000) para prevenir abusos
- ✅ Validación estricta de requests
- 🚫 `.env.local` incluido en `.gitignore`

## 📋 Requisitos Previos

- Node.js 18+ instalado
## 📋 Requisitos Previos

- Node.js 18+ instalado
- Una cuenta en [OpenRouter](https://openrouter.ai/) para obtener tu API key (gratuita)
- Git instalado

## ⚡ Instalación Rápida

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar API Key

Edita el archivo `.env.local` y reemplaza con tu API key real:

```env
OPENROUTER_API_KEY=sk-or-v1-TU-KEY-AQUI
```

**Cómo obtener tu API Key:**
1. Ve a [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Crea una cuenta gratuita
3. Genera una nueva API key
4. Cópiala y pégala en `.env.local`

### 3. Ejecutar la aplicación

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📝 Las 5 Herramientas (Tools)

### 1️⃣ createTask
Crea nuevas tareas conversacionalmente.

**Ejemplos:**
- "Agregar tarea: comprar leche"
- "Necesito recordar llamar al doctor mañana"
- "Crea una tarea urgente para terminar el informe"

### 2️⃣ updateTask
Modifica tareas existentes.

**Ejemplos:**
- "Marca la tarea 1 como completada"
- "Cambia la prioridad de 'hacer ejercicio' a alta"
- "Mueve la fecha del doctor a pasado mañana"

### 3️⃣ deleteTask
Elimina tareas del sistema.

**Ejemplos:**
- "Elimina la tarea de comprar leche"
- "Borra la tarea #3"

### 4️⃣ searchTasks
Busca y filtra tareas con criterios avanzados.

**Ejemplos:**
- "Muéstrame todas mis tareas pendientes"
- "Lista las tareas de alta prioridad"
- "Busca tareas que contengan 'informe'"
- "Tareas que vencen esta semana"

### 5️⃣ getTaskStats
Genera estadísticas de productividad.

**Ejemplos:**
- "¿Qué tan productivo he sido esta semana?"
- "Muéstrame mis estadísticas"
- "¿Cuántas tareas he completado?"

## 🎯 Modelos LLM Disponibles

Puedes cambiar el modelo en `.env.local`:

```env
# Modelos gratuitos:
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
OPENROUTER_MODEL=google/gemma-2-9b-it:free
OPENROUTER_MODEL=microsoft/phi-3-mini-128k-instruct:free

# Modelos de pago (mejores resultados):
OPENROUTER_MODEL=anthropic/claude-3-haiku
OPENROUTER_MODEL=openai/gpt-4o-mini
```

## 🗄️ Base de Datos

Las tareas se almacenan en `tasks.db` (SQLite) con el siguiente schema:

```sql
- id: ID único
- title: Título de la tarea
- completed: Estado (0=pendiente, 1=completada)
- priority: low | medium | high
- category: work | personal | shopping | health | other
- dueDate: Fecha límite (YYYY-MM-DD)
- createdAt: Fecha de creación
- updatedAt: Última modificación
- deleted: Soft delete (0=activa, 1=eliminada)
```

## 📁 Estructura del Proyecto

```
vercel/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # API con tool calling (5 tools)
│   │   └── tasks/
│   │       └── route.ts          # CRUD REST API
│   ├── components/
│   │   ├── Chat.tsx              # Componente principal del chat
│   │   └── GalaxyBackground.tsx  # Fondo animado
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── db.ts                     # Configuración de SQLite
│   └── tasks.ts                  # Funciones CRUD
├── .env.local                    # Variables de entorno (NO commitear)
├── .gitignore
├── package.json
├── README.md
└── tasks.db                      # Base de datos (auto-generada)
```

## 🛠️ Tecnologías

- **[Next.js 15](https://nextjs.org/)** - Framework React con App Router
- **[Vercel AI SDK](https://sdk.vercel.ai/)** - SDK para tool calling y streaming
- **[OpenRouter](https://openrouter.ai/)** - Acceso a múltiples modelos LLM
- **[Better SQLite3](https://github.com/WiseLibs/better-sqlite3)** - Base de datos local
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Zod](https://zod.dev/)** - Validación de schemas

## 📊 API Endpoints

### Chat con Tool Calling
```
POST /api/chat
```
- Streaming de respuestas del LLM
- Ejecución automática de las 5 tools

### Tareas CRUD
```
GET /api/tasks?completed=false&priority=high
POST /api/tasks
PUT /api/tasks
DELETE /api/tasks?id=1
```

## 🐛 Troubleshooting

### Error: API key no configurada
**Solución**: Verifica que `.env.local` existe y tiene tu API key correcta

### Error: Cannot find module 'better-sqlite3'
**Solución**: `npm install better-sqlite3 @types/better-sqlite3`

### Las tareas no persisten
**Solución**: Verifica que `tasks.db` se creó en la raíz del proyecto

### El servidor no inicia
**Solución**: 
1. Cierra todas las terminales
2. `npm install`
3. `npm run dev`

## 🔧 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm start        # Servidor de producción
npm run lint     # Linter
```

## 🚀 Deploy en Vercel

1. Sube tu código a GitHub (**sin** `.env.local`)
2. Ve a [vercel.com](https://vercel.com/) e importa tu repositorio
3. Agrega las variables de entorno en el dashboard:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_BASE_URL`
   - `OPENROUTER_MODEL`
4. Deploy automático

**Nota**: SQLite funciona en Vercel pero los datos no persisten entre deployments. Para producción considera PostgreSQL o MongoDB.

## 📖 Recursos Adicionales

- [Documentación del Proyecto](./README_TODO.md) - Documentación técnica detallada
- [Guía de Uso](./GUIA_DE_USO.md) - Instrucciones paso a paso
- [Setup Rápido](./SETUP_RAPIDO.md) - Configuración rápida

## 📄 Licencia

MIT

## 👨‍💻 Proyecto Educativo

Ejercicio 13 - Parte 2B: AI Todo Manager

---

**¡Gestiona tus tareas de manera inteligente! 🎉**
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_BASE_URL`
   - `OPENROUTER_MODEL`

5. ¡Deploy automático!

## ⚠️ Recordatorios de Seguridad

- ❌ **NUNCA** expongas API keys en el frontend
- ❌ **NUNCA** commitees el archivo `.env.local`
- ✅ **SIEMPRE** valida y sanitiza inputs del usuario
- ✅ **SIEMPRE** maneja errores apropiadamente
- ✅ **SIEMPRE** usa variables de entorno para información sensible

## 🐛 Solución de Problemas

### Error: "API key no configurada"

**Solución**: Asegúrate de haber creado el archivo `.env.local` con tu API key de OpenRouter.

### Error: "API key inválida"

**Solución**: Verifica que tu API key sea correcta y esté activa en [openrouter.ai/keys](https://openrouter.ai/keys).

### Error: "Límite de requests excedido"

**Solución**: Espera unos minutos. Los modelos gratuitos tienen límites de rate limiting.

### El chatbot no responde

**Solución**: 
1. Verifica que el servidor esté corriendo (`npm run dev`)
2. Revisa la consola del navegador y del terminal
3. Verifica que tu API key sea válida

## 📖 Recursos Adicionales

- [Documentación de Vercel AI SDK](https://sdk.vercel.ai/)
- [Documentación de OpenRouter](https://openrouter.ai/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

## 📝 Notas del Proyecto

Este proyecto fue desarrollado como parte del **Ejercicio 13: Chatbot con Next.js y AI SDK**, implementando:

- ✅ Interfaz de chat moderna y responsiva
- ✅ Streaming de respuestas en tiempo real
- ✅ Manejo seguro de API keys (solo backend)
- ✅ Validación y sanitización de inputs
- ✅ Indicadores de carga y typing
- ✅ Manejo robusto de errores
- ✅ Arquitectura cliente-servidor segura

## 👨‍💻 Autor

Desarrollado con ❤️ siguiendo las mejores prácticas de seguridad y desarrollo web moderno.

---

¿Preguntas o problemas? Abre un issue en el repositorio.
