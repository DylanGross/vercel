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

        fetchBookDetails();
    }, [resolvedParams]);

    const handleReviewSubmit = (review: { rating: number; text: string }) => {
        // Puedes agregar lógica aquí si quieres guardar la reseña en algún lado
        // Por ahora solo es un placeholder para evitar el error
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
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
                        </div>
                    </div>
                    {book.volumeInfo.description && <p className="text-gray-700 mb-6 whitespace-pre-line">{book.volumeInfo.description}</p>}

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Reseña</h2>
                        <ReviewForm onSubmit={handleReviewSubmit} />
                    </div>
                </>
            )}
        </div>
    );
}