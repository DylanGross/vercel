import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models/Review';
import { verifyAuth } from '@/lib/auth';

// Crear reseña (solo autenticado)
export async function POST(req: NextRequest) {
  const decoded = verifyAuth(req);
  if (decoded instanceof NextResponse) return decoded;

  const { bookId, rating, text } = await req.json();
  if (!bookId || !rating || !text) {
    return NextResponse.json({ error: 'Todos los campos son requeridos.' }, { status: 400 });
  }

  await dbConnect();
  const review = new Review({
    bookId,
    user: (decoded as any).userId,
    rating,
    text,
  });
  await review.save();
  return NextResponse.json({ message: 'Reseña creada.', review }, { status: 201 });
}

// Obtener reseñas de un libro
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get('bookId');
  if (!bookId) {
    return NextResponse.json({ error: 'Falta el bookId.' }, { status: 400 });
  }
  await dbConnect();
  const reviews = await Review.find({ bookId }).populate('user', 'email name');
  return NextResponse.json({ reviews });
}
