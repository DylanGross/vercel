import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const decoded = verifyAuth(req);
  if (decoded instanceof NextResponse) return decoded;

  await dbConnect();
  const userId = typeof decoded === 'string' ? decoded : (decoded as any).userId;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
  }
  // Buscar reseñas del usuario
  const { Review } = await import('@/models/Review');
  const reviews = await Review.find({ user: userId }).sort({ createdAt: -1 });
  return NextResponse.json({ user, reviews });
}
