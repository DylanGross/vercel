"use client";
import React, { useState, useEffect } from 'react';

interface ReviewInput {
    rating: number;
    text: string;
}

interface Review {
    _id: string;
    rating: number;
    text: string;
    upVotes: number;
    downVotes: number;
    createdAt: string;
    user: { email: string; name?: string };
}

interface ReviewFormProps {
    onSubmit: (review: ReviewInput) => void;
}

const StarRating: React.FC<{ rating: number; setRating: (n: number) => void }> = ({ rating, setRating }) => (
    <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((num) => (
            <button
                key={num}
                type="button"
                onClick={() => setRating(num)}
                className={num <= rating ? 'text-yellow-400' : 'text-gray-300'}
            >
                <span className="text-2xl">★</span>
            </button>
        ))}
    </div>
);

const ReviewForm: React.FC<{ bookId: string }> = ({ bookId }) => {
    const [rating, setRating] = useState<number>(1);
    const [text, setText] = useState<string>('');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState<string>('');
    const [editRating, setEditRating] = useState<number>(1);
    const [userId, setUserId] = useState<string | null>(null);
    const [voteErrors, setVoteErrors] = useState<{ [id: string]: string }>({});

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;
        fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                if (data.user?._id) setUserId(data.user._id);
            });
    }, []);

    // Obtener reseñas al montar
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/reviews?bookId=${bookId}`);
                const data = await res.json();
                if (res.ok) setReviews(data.reviews);
                else setError(data.error || 'Error al cargar reseñas');
            } catch {
                setError('Error de red');
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [bookId]);

    // Enviar reseña al backend con validaciones
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Validaciones frontend
        if (rating < 1 || rating > 5) {
            setError('La calificación debe estar entre 1 y 5 estrellas.');
            return;
        }
        if (!text.trim()) {
            setError('La reseña no puede estar vacía.');
            return;
        }
        if (text.trim().length < 10) {
            setError('La reseña debe tener al menos 10 caracteres.');
            return;
        }
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
            setError('Debes iniciar sesión para reseñar');
            return;
        }
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ bookId, rating, text }),
            });
            const data = await res.json();
            if (res.ok) {
                setReviews([data.review, ...reviews]);
                setRating(1);
                setText('');
            } else {
                setError(data.error || 'Error al enviar reseña');
            }
        } catch {
            setError('Error de red');
        }
    };

    return (
        <div>
                {/* Formulario de nueva reseña */}
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 mb-6 w-full max-w-md mx-auto">
                    <div className="mb-4">
                        <label htmlFor="rating" className="block font-semibold mb-2">Calificación:</label>
                        <input type="hidden" id="rating" value={rating} readOnly />
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="review" className="block font-semibold mb-2">Reseña:</label>
                        <textarea
                            id="review"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Escribe tu reseña aquí..."
                            className="w-full p-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-200"
                            rows={4}
                        ></textarea>
                    </div>
                    <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">Enviar Reseña</button>
                    {error && <p className="mt-2 text-center text-red-600">{error}</p>}
                </form>
                {/* Formulario de edición de reseña */}
                {editingId && (
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setError('');
                            // Validaciones frontend edición
                            if (editRating < 1 || editRating > 5) {
                                setError('La calificación debe estar entre 1 y 5 estrellas.');
                                return;
                            }
                            if (!editText.trim()) {
                                setError('La reseña no puede estar vacía.');
                                return;
                            }
                            if (editText.trim().length < 10) {
                                setError('La reseña debe tener al menos 10 caracteres.');
                                return;
                            }
                            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                            if (!token) return setError('Debes iniciar sesión');
                            try {
                                const res = await fetch(`/api/reviews/${editingId}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({ rating: editRating, text: editText }),
                                });
                                const data = await res.json();
                                if (res.ok) {
                                    setReviews(reviews.map(r => r._id === editingId ? { ...r, rating: editRating, text: editText } : r));
                                    setEditingId(null);
                                    setEditText('');
                                    setEditRating(1);
                                } else {
                                    setError(data.error || 'Error al editar reseña');
                                }
                            } catch {
                                setError('Error de red');
                            }
                        }}
                        className="bg-yellow-50 shadow-lg rounded-xl p-6 mb-6 w-full max-w-md mx-auto"
                    >
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Editar calificación:</label>
                            <StarRating rating={editRating} setRating={setEditRating} />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Editar reseña:</label>
                            <textarea
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-yellow-200"
                                rows={4}
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold">Guardar cambios</button>
                        <button type="button" className="w-full py-2 mt-2 bg-gray-400 text-white rounded-lg" onClick={() => setEditingId(null)}>Cancelar</button>
                    </form>
                )}
                {/* Listado de reseñas */}
                <div className="max-w-md mx-auto">
                    <h2 className="font-bold text-lg mb-2">Reseñas</h2>
                    {loading && <p>Cargando reseñas...</p>}
                    {reviews.map((r) => (
                        <div key={r._id} className="bg-gray-50 rounded-lg p-4 mb-4 shadow">
                            <div className="flex items-center mb-2">
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <span key={num} className={num <= r.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-2 text-gray-800">{r.text}</div>
                            <div className="text-xs text-gray-500 mb-2">Por: {r.user?.name || r.user?.email}</div>
                            <div className="flex gap-4 items-center mb-2">
                                <button
                                    className="text-2xl text-green-700 hover:scale-110 transition-transform"
                                    title="Votar positivo"
                                    onClick={async () => {
                                        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                                        if (!token) {
                                            setVoteErrors(prev => ({ ...prev, [r._id]: 'Debes iniciar sesión para votar' }));
                                            return;
                                        }
                                        try {
                                            const res = await fetch('/api/reviews/vote', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`,
                                                },
                                                body: JSON.stringify({ reviewId: r._id, vote: 'up' }),
                                            });
                                            const data = await res.json();
                                            if (res.ok) {
                                                setReviews(reviews.map(rv => rv._id === r._id ? { ...rv, upVotes: data.upVotes, downVotes: data.downVotes } : rv));
                                                setVoteErrors(prev => ({ ...prev, [r._id]: '' }));
                                            } else {
                                                setVoteErrors(prev => ({ ...prev, [r._id]: data.error || 'Error al votar' }));
                                            }
                                        } catch {
                                            setVoteErrors(prev => ({ ...prev, [r._id]: 'Error de red' }));
                                        }
                                    }}
                                >👍 <span className="text-base align-middle">{r.upVotes}</span></button>
                                <button
                                    className="text-2xl text-red-600 hover:scale-110 transition-transform"
                                    title="Votar negativo"
                                    onClick={async () => {
                                        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                                        if (!token) {
                                            setVoteErrors(prev => ({ ...prev, [r._id]: 'Debes iniciar sesión para votar' }));
                                            return;
                                        }
                                        try {
                                            const res = await fetch('/api/reviews/vote', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`,
                                                },
                                                body: JSON.stringify({ reviewId: r._id, vote: 'down' }),
                                            });
                                            const data = await res.json();
                                            if (res.ok) {
                                                setReviews(reviews.map(rv => rv._id === r._id ? { ...rv, upVotes: data.upVotes, downVotes: data.downVotes } : rv));
                                                setVoteErrors(prev => ({ ...prev, [r._id]: '' }));
                                            } else {
                                                setVoteErrors(prev => ({ ...prev, [r._id]: data.error || 'Error al votar' }));
                                            }
                                        } catch {
                                            setVoteErrors(prev => ({ ...prev, [r._id]: 'Error de red' }));
                                        }
                                    }}
                                >👎 <span className="text-base align-middle">{r.downVotes}</span></button>
                            </div>
                            {voteErrors[r._id] && <p className="text-red-600 text-sm mt-1">{voteErrors[r._id]}</p>}
                            {/* Botones de editar/eliminar solo para el dueño */}
                            {userId && r.user && (r.user as any)._id === userId && (
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        onClick={() => {
                                            setEditingId(r._id);
                                            setEditText(r.text);
                                            setEditRating(r.rating);
                                        }}
                                    >Editar</button>
                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={async () => {
                                            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                                            if (!token) return setError('Debes iniciar sesión');
                                            try {
                                                const res = await fetch(`/api/reviews/${r._id}`, {
                                                    method: 'DELETE',
                                                    headers: {
                                                        'Authorization': `Bearer ${token}`,
                                                    },
                                                });
                                                if (res.ok) {
                                                    setReviews(reviews.filter(rv => rv._id !== r._id));
                                                } else {
                                                    const data = await res.json();
                                                    setError(data.error || 'Error al eliminar reseña');
                                                }
                                            } catch {
                                                setError('Error de red');
                                            }
                                        }}
                                    >Eliminar</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
        </div>
    );
};

export default ReviewForm;