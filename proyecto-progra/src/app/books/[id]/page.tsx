"use client";

import React, { useState, useEffect } from 'react';
import ReviewForm from '../../../components/Reseña';

interface Book {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        imageLinks?: {
            thumbnail?: string;
        };
        publishedDate?: string;
        pageCount?: number;
        categories?: string[];
    };
}

export default function BookDetails({ params }: { params: Promise<{ id: string }> }) {
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [inReadingList, setInReadingList] = useState(false);
    const [favLoading, setFavLoading] = useState(false);
    const [readLoading, setReadLoading] = useState(false);

    useEffect(() => {
        const resolveParams = async () => {
            const resolved = await params;
            setResolvedParams(resolved);
        };

        resolveParams();
    }, [params]);

    useEffect(() => {
        if (!resolvedParams) return;

        const fetchBookDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${resolvedParams.id}`);
                const data = await res.json();
                if (data) {
                    setBook(data);
                } else {
                    setError("No se encontró el libro.");
                }
            } catch (e) {
                setError("Error al obtener la información.");
            } finally {
                setLoading(false);
            }
        };

        const fetchUserLists = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!token) return;
            try {
                const res = await fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                if (data.user) {
                    setIsFavorite((data.user.favorites || []).includes(resolvedParams.id));
                    setInReadingList((data.user.readingList || []).includes(resolvedParams.id));
                }
            } catch {}
        };

        fetchBookDetails();
        fetchUserLists();
    }, [resolvedParams]);


    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
            <button
                className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold shadow hover:bg-gray-300"
                onClick={() => window.location.href = '/'}
            >← Volver al buscador</button>
            {book && (
                <>
                    <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                        {book.volumeInfo.imageLinks?.thumbnail && (
                            <img
                                src={book.volumeInfo.imageLinks.thumbnail}
                                alt={book.volumeInfo.title}
                                className="w-40 h-auto rounded-lg shadow-md mb-4 md:mb-0"
                            />
                        )}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.volumeInfo.title}</h1>
                            {book.volumeInfo.authors && <p className="text-gray-600 mb-1">Autores: <span className="font-medium">{book.volumeInfo.authors.join(', ')}</span></p>}
                            {book.volumeInfo.publishedDate && <p className="text-gray-600 mb-1">Publicado: <span className="font-medium">{book.volumeInfo.publishedDate}</span></p>}
                            {book.volumeInfo.pageCount && <p className="text-gray-600 mb-1">Páginas: <span className="font-medium">{book.volumeInfo.pageCount}</span></p>}
                            {book.volumeInfo.categories && <p className="text-gray-600 mb-1">Categorías: <span className="font-medium">{book.volumeInfo.categories.join(', ')}</span></p>}
                            {/* Botones favoritos y lista de lectura */}
                            {resolvedParams && (
                                <div className="flex gap-4 mt-4">
                                    <button
                                        className={`px-4 py-2 rounded-lg font-semibold shadow ${isFavorite ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-yellow-500`}
                                        disabled={favLoading}
                                        onClick={async () => {
                                            setFavLoading(true);
                                            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                                            if (!token) return;
                                            const res = await fetch('/api/user/favorites', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`,
                                                },
                                                body: JSON.stringify({ bookId: resolvedParams.id }),
                                            });
                                            const data = await res.json();
                                            if (res.ok) setIsFavorite(data.favorites.includes(resolvedParams.id));
                                            setFavLoading(false);
                                        }}
                                    >{isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}</button>
                                    <button
                                        className={`px-4 py-2 rounded-lg font-semibold shadow ${inReadingList ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500`}
                                        disabled={readLoading}
                                        onClick={async () => {
                                            setReadLoading(true);
                                            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                                            if (!token) return;
                                            const res = await fetch('/api/user/reading-list', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`,
                                                },
                                                body: JSON.stringify({ bookId: resolvedParams.id }),
                                            });
                                            const data = await res.json();
                                            if (res.ok) setInReadingList(data.readingList.includes(resolvedParams.id));
                                            setReadLoading(false);
                                        }}
                                    >{inReadingList ? 'Quitar de lectura' : 'Agregar a lectura'}</button>
                                </div>
                            )}
                        </div>
                    </div>
                    {book.volumeInfo.description && (
                        <div
                            className="text-gray-700 mb-6"
                            dangerouslySetInnerHTML={{ __html: book.volumeInfo.description }}
                        />
                    )}

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Reseña</h2>
                        {resolvedParams && <ReviewForm bookId={resolvedParams.id} />}
                    </div>
                </>
            )}
        </div>
    );
}