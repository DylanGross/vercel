"use client";
import { useEffect, useState } from "react";

interface Review {
  _id: string;
  bookId: string;
  rating: number;
  text: string;
  upVotes: number;
  downVotes: number;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ user: User; reviews: Review[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión");
      setLoading(false);
      return;
    }
    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error de red");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!profile) return <div>No se pudo cargar el perfil</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Perfil de {profile.user.username}</h2>
      <div className="mb-6">
        <div>Email: {profile.user.email}</div>
      </div>
      <h3 className="text-lg font-semibold mb-2">Historial de reseñas</h3>
      <ul>
        {profile.reviews.length === 0 && <li>No has escrito reseñas aún.</li>}
        {profile.reviews.map((r) => (
          <li key={r._id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
            <div className="flex space-x-1 mb-1">
              {[1,2,3,4,5].map(num => (
                <span key={num} className={num <= r.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
              ))}
            </div>
            <div className="mb-1">{r.text}</div>
            <div className="text-xs text-gray-500 mb-1">Libro: {r.bookId}</div>
            <div className="flex gap-4 items-center">
              <span className="font-bold text-green-700">👍 {r.upVotes}</span>
              <span className="font-bold text-red-600">👎 {r.downVotes}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
