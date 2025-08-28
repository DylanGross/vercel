import React, { useState } from 'react';

interface ReviewInput {
    rating: number;
    text: string;
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

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
    const [rating, setRating] = useState<number>(1);
    const [text, setText] = useState<string>('');
    const [upVotes, setUpVotes] = useState<number>(0);
    const [downVotes, setDownVotes] = useState<number>(0);

    // Simulación de reseñas para ejemplo
    const [reviews, setReviews] = useState<Array<{ rating: number; text: string; up: number; down: number }>>([]);

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onSubmit({ rating, text });
    setReviews([...reviews, { rating, text, up: 0, down: 0 }]);
    setRating(1);
    setText('');
    };

    // Sumar votos totales
    const totalUp = reviews.reduce((acc, r) => acc + r.up, 0);
    const totalDown = reviews.reduce((acc, r) => acc + r.down, 0);

    // Votar en reseña individual
    const handleVote = (idx: number, type: 'up' | 'down') => {
        setReviews(reviews.map((r, i) =>
            i === idx ? { ...r, [type]: r[type] + 1 } : r
        ));
    };

    return (
        <div>
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
            </form>
            <div className="max-w-md mx-auto">
                <h2 className="font-bold text-lg mb-2">Reseñas</h2>
                {reviews.map((r, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 mb-4 shadow">
                        <div className="flex items-center mb-2">
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <span key={num} className={num <= r.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                ))}
                            </div>
                        </div>
                        <div className="mb-2 text-gray-800">{r.text}</div>
                        <div className="flex gap-4 items-center">
                            <button
                                type="button"
                                onClick={() => handleVote(idx, 'up')}
                                className="bg-green-100 text-xl px-2 py-1 rounded hover:bg-green-200"
                            >👍</button>
                            <span className="font-bold text-green-700">{r.up}</span>
                            <button
                                type="button"
                                onClick={() => handleVote(idx, 'down')}
                                className="bg-red-100 text-xl px-2 py-1 rounded hover:bg-red-200"
                            >👎</button>
                            <span className="font-bold text-red-600">{r.down}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewForm;