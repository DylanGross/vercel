"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registro exitoso. Redirigiendo al login...');
        setTimeout(() => {
          router.push('/login');
        }, 1200);
        setEmail(''); setPassword(''); setName('');
      } else {
        setMessage(data.error || 'Error al registrar.');
      }
    } catch (err) {
      setMessage('Error de red.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl mb-4">Registro</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mb-2 p-2 border rounded" />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mb-2 p-2 border rounded" />
      <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} className="w-full mb-2 p-2 border rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Registrarse</button>
      {message && <p className="mt-2 text-center text-red-600">{message}</p>}
    </form>
  );
}
