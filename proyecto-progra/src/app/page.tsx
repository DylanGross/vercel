"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function Home() {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(20);

    useEffect(() => {
        const fetchDefaultBooks = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=programming`);
                const data = await res.json();
                if (data.items) {
                    setBooks(data.items);
                } else {
                    setBooks([]);
                    setError("No se encontraron libros.");
                }
            } catch (e) {
                setError("Error al obtener la información.");
            } finally {
                setLoading(false);
            }
        };

        fetchDefaultBooks();
    }, []);

    const searchBooks = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.items) {
                setBooks(data.items);
            } else {
                setBooks([]);
                setError("No se encontraron libros.");
            }
        } catch (e) {
            setError("Error al obtener la información.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">Buscador de Libros</h1>
            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Buscar por título, autor o ISBN"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg w-80"
                />
                <button
                    onClick={searchBooks}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Buscar
                </button>
            </div>
            {loading && <p className="text-center text-gray-500">Cargando...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                {books.slice(0, visibleCount).map((book) => (
                    <div
                        key={book.id}
                        className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 flex flex-col items-center w-56 h-[400px] hover:scale-105 transition-transform duration-200 overflow-hidden"
                    >
                        {book.volumeInfo.imageLinks?.thumbnail && (
                            <img
                                src={book.volumeInfo.imageLinks.thumbnail}
                                alt={book.volumeInfo.title}
                                className="w-32 h-44 object-cover rounded-md mb-4 shadow"
                            />
                        )}
                        <h2 className="text-base font-bold mb-2 text-center line-clamp-2 text-blue-800">{book.volumeInfo.title}</h2>
                        {book.volumeInfo.authors && (
                            <p className="text-gray-600 mb-2 text-xs text-center">
                                <strong>Autores:</strong> {book.volumeInfo.authors.join(', ')}
                            </p>
                        )}
                        <Link href={`/books/${book.id}`}>
                            <button className="mt-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 shadow text-xs">
                                Ver detalles
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
            {visibleCount < books.length && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setVisibleCount(visibleCount + 20)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
                    >
                        Cargar más libros...
                    </button>
                </div>
            )}
        </div>
    );
}