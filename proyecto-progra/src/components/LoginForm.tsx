"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Login exitoso. Redirigiendo...');
        localStorage.setItem('token', data.token); // Guarda el JWT
        setTimeout(() => {
          router.push('/');
        }, 1200);
      } else {
        setMessage(data.error || 'Error al iniciar sesión.');
      }
    } catch (err) {
      setMessage('Error de red.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl mb-4">Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mb-2 p-2 border rounded" />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mb-2 p-2 border rounded" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Iniciar sesión</button>
      <div className="mt-4 text-center">
        <Link href="/register" className="text-blue-600 hover:underline">Registrarme</Link>
      </div>
      {message && <p className="mt-2 text-center text-red-600">{message}</p>}
    </form>
  );
}
