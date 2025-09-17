import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models/Review';
import { verifyAuth } from '@/lib/auth';

// Votar reseña (solo autenticado)
export async function POST(req: NextRequest) {
  const decoded = verifyAuth(req);
  if (decoded instanceof NextResponse) return decoded;
  const { reviewId, vote } = await req.json(); // vote: 'up' | 'down'
  if (!reviewId || !['up', 'down'].includes(vote)) {
    return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 });
  }
  await dbConnect();
  const review = await Review.findById(reviewId);
  if (!review) return NextResponse.json({ error: 'Reseña no encontrada.' }, { status: 404 });
  if (vote === 'up') review.upVotes += 1;
  else review.downVotes += 1;
  await review.save();
  return NextResponse.json({ message: 'Voto registrado.', upVotes: review.upVotes, downVotes: review.downVotes });
}
