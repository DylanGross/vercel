# 🤖 Chatbot con Next.js y AI SDK

Un chatbot inteligente desarrollado con Next.js 15, Vercel AI SDK y OpenRouter.

## 🚀 Características

- ✅ **Interfaz moderna y responsiva** con Tailwind CSS
- ✅ **Streaming de respuestas en tiempo real** del LLM
- ✅ **Manejo seguro de API keys** (solo en backend)
- ✅ **Validación y sanitización** de inputs del usuario
- ✅ **Indicadores de carga** y typing indicators
- ✅ **Manejo robusto de errores**
- ✅ **Auto-scroll** hacia los mensajes más recientes
- ✅ **Persistencia de conversación** durante la sesión

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
- Una cuenta en [OpenRouter](https://openrouter.ai/) para obtener tu API key (gratuita)
- Git instalado

## 🛠️ Instalación

### 1. Clonar el repositorio o crear el proyecto

```bash
# Si clonaste el repo
cd vercel
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Copia el archivo de ejemplo
copy .env.example .env.local
```

Luego edita `.env.local` y agrega tu API key de OpenRouter:

```env
OPENROUTER_API_KEY=sk-or-v1-tu-api-key-aqui
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

#### Cómo obtener tu API Key de OpenRouter:

1. Ve a [https://openrouter.ai/](https://openrouter.ai/)
2. Crea una cuenta (gratis)
3. Ve a [https://openrouter.ai/keys](https://openrouter.ai/keys)
4. Crea una nueva API key
5. Cópiala y pégala en `.env.local`

### 4. Ejecutar el proyecto en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎯 Modelos Gratuitos Disponibles

Puedes cambiar el modelo en `.env.local`:

```env
# Modelos gratuitos recomendados:
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
# O también:
# OPENROUTER_MODEL=google/gemma-2-9b-it:free
# OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free
```

## 📁 Estructura del Proyecto

```
vercel/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API Route (Backend) - Maneja peticiones a OpenRouter
│   ├── components/
│   │   └── Chat.tsx              # Componente de interfaz del chat
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página principal
├── .env.local                    # Variables de entorno (NO commitear)
├── .env.example                  # Ejemplo de variables de entorno
├── .gitignore                    # Archivos ignorados por Git
├── next.config.js                # Configuración de Next.js
├── package.json                  # Dependencias del proyecto
├── postcss.config.js             # Configuración de PostCSS
├── tailwind.config.js            # Configuración de Tailwind
├── tsconfig.json                 # Configuración de TypeScript
└── README.md                     # Este archivo
```

## 🧩 Componentes Principales

### 1. API Route (`app/api/chat/route.ts`)

- **Propósito**: Backend seguro para comunicación con OpenRouter
- **Características**:
  - Validación de API key
  - Sanitización de inputs
  - Manejo de streaming
  - Gestión de errores específicos

### 2. Chat Component (`app/components/Chat.tsx`)

- **Propósito**: Interfaz de usuario del chat
- **Características**:
  - Hook `useChat` de Vercel AI SDK
  - Auto-scroll
  - Typing indicators
  - Manejo de errores en UI
  - Validación de caracteres

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Ejecutar en producción
npm start

# Linting
npm run lint
```

## 📚 Tecnologías Utilizadas

- **[Next.js 15](https://nextjs.org/)** - Framework React con App Router
- **[Vercel AI SDK](https://sdk.vercel.ai/)** - SDK para integración con LLMs
- **[OpenRouter](https://openrouter.ai/)** - Proveedor de acceso a múltiples LLMs
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático para JavaScript

## 🚀 Deploy en Vercel

1. Sube tu código a GitHub (asegúrate de NO incluir `.env.local`)

2. Ve a [vercel.com](https://vercel.com/)

3. Importa tu repositorio

4. Agrega las variables de entorno en el dashboard de Vercel:
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
