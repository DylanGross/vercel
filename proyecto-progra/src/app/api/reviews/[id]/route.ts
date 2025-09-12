import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models/Review';
import { verifyAuth } from '@/lib/auth';

// Editar reseña (solo dueño)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const decoded = verifyAuth(req);
  if (decoded instanceof NextResponse) return decoded;
  const { rating, text } = await req.json();
  await dbConnect();
  const review = await Review.findById(params.id);
  if (!review) return NextResponse.json({ error: 'Reseña no encontrada.' }, { status: 404 });
  if (review.user.toString() !== (decoded as any).userId) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 });
  }
  review.rating = rating;
  review.text = text;
  await review.save();
  return NextResponse.json({ message: 'Reseña actualizada.', review });
}

// Eliminar reseña (solo dueño)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const decoded = verifyAuth(req);
  if (decoded instanceof NextResponse) return decoded;
  await dbConnect();
  const review = await Review.findById(params.id);
  if (!review) return NextResponse.json({ error: 'Reseña no encontrada.' }, { status: 404 });
  if (review.user.toString() !== (decoded as any).userId) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 });
  }
  await review.deleteOne();
  return NextResponse.json({ message: 'Reseña eliminada.' });
}
