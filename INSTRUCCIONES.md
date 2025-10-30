# ⚠️ INSTRUCCIONES IMPORTANTES - LEE ESTO PRIMERO

## 🔐 CONFIGURACIÓN DE LA API KEY (OBLIGATORIO)

### Paso 1: Obtén tu API Key de OpenRouter

1. Ve a **https://openrouter.ai/**
2. Haz clic en "Sign In" (arriba a la derecha)
3. Crea una cuenta gratuita
4. Una vez dentro, ve a **https://openrouter.ai/keys**
5. Haz clic en "Create Key"
6. Dale un nombre (ejemplo: "Chatbot Next.js")
7. Copia la API key (empieza con `sk-or-v1-...`)

### Paso 2: Configura el archivo .env.local

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza `sk-or-v1-your-api-key-here` con tu API key real
3. Guarda el archivo

**Ejemplo:**
```env
OPENROUTER_API_KEY=sk-or-v1-abc123xyz789example
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

### Paso 3: Inicia el servidor de desarrollo

```bash
npm run dev
```

### Paso 4: Abre tu navegador

Ve a **http://localhost:3000**

---

## 🚨 ADVERTENCIAS DE SEGURIDAD

### ❌ NUNCA HAGAS ESTO:

- ❌ NO compartas tu API key con nadie
- ❌ NO la subas a GitHub o repositorios públicos
- ❌ NO la pongas en el código del frontend
- ❌ NO la incluyas en capturas de pantalla

### ✅ SIEMPRE HAZ ESTO:

- ✅ Guarda la API key solo en `.env.local`
- ✅ Verifica que `.env.local` esté en `.gitignore`
- ✅ Usa variables de entorno en producción (Vercel Dashboard)
- ✅ Rota tu API key si crees que fue expuesta

---

## 🎯 MODELOS GRATUITOS DISPONIBLES

Puedes cambiar el modelo editando `OPENROUTER_MODEL` en `.env.local`:

```env
# Modelos gratuitos recomendados:

# LLama 3.2 (Rápido, buen balance)
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free

# Gemma 2 (Más potente, más lento)
OPENROUTER_MODEL=google/gemma-2-9b-it:free

# Mistral (Alternativa)
OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### ❌ Error: "API key no configurada"

**Causa:** No has editado `.env.local` o está mal configurado.

**Solución:**
1. Verifica que `.env.local` existe
2. Verifica que la API key esté en la línea correcta
3. Reinicia el servidor (`Ctrl+C` y luego `npm run dev`)

### ❌ Error: "API key inválida"

**Causa:** La API key es incorrecta o fue deshabilitada.

**Solución:**
1. Ve a https://openrouter.ai/keys
2. Verifica que tu key esté activa
3. Si no funciona, crea una nueva key

### ❌ Error: "Límite de requests excedido"

**Causa:** Has hecho demasiadas peticiones muy rápido.

**Solución:**
Espera 1-2 minutos y vuelve a intentar.

### ❌ El chatbot no responde

**Soluciones posibles:**
1. Abre la consola del navegador (F12) y busca errores
2. Revisa el terminal donde corre `npm run dev`
3. Verifica que estés en http://localhost:3000
4. Reinicia el servidor

### ❌ Error de TypeScript/Compilación

**Solución:**
```bash
# Borra node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📝 COMANDOS ÚTILES

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start

# Limpiar caché y reinstalar
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

## ✅ CHECKLIST ANTES DE ENTREGAR

- [ ] Configuré mi API key en `.env.local`
- [ ] El servidor corre sin errores (`npm run dev`)
- [ ] Puedo abrir http://localhost:3000
- [ ] El chat responde a mis mensajes
- [ ] Leí las advertencias de seguridad
- [ ] `.env.local` está en `.gitignore`
- [ ] NO commiteé mi API key

---

## 📚 RECURSOS ADICIONALES

- **Documentación de Vercel AI SDK:** https://sdk.vercel.ai/
- **Documentación de OpenRouter:** https://openrouter.ai/docs
- **Documentación de Next.js:** https://nextjs.org/docs
- **Modelos disponibles en OpenRouter:** https://openrouter.ai/models

---

## 💡 TIPS PARA EL PROYECTO

### 1. Testing

Prueba diferentes tipos de mensajes:
- Preguntas simples
- Preguntas complejas
- Mensajes largos
- Múltiples mensajes consecutivos

### 2. Personalización

Puedes personalizar:
- Los colores en `app/components/Chat.tsx`
- El modelo en `.env.local`
- Los mensajes de ejemplo
- El título y descripción

### 3. Deploy

Para desplegar en Vercel:
```bash
# Sube a GitHub (sin .env.local)
git add .
git commit -m "Initial commit"
git push

# Luego en vercel.com:
# 1. Import repository
# 2. Add environment variables (OPENROUTER_API_KEY, etc.)
# 3. Deploy
```

---

## 🎉 ¡TODO LISTO!

Si seguiste todos los pasos, tu chatbot debería estar funcionando perfectamente.

**¿Preguntas?** Revisa el README.md o busca en la documentación oficial.

**¡Éxito con tu proyecto! 🚀**
