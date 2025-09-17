import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const decoded = verifyAuth(req);
  if (decoded instanceof NextResponse) return decoded;
  await dbConnect();
  const userId = typeof decoded === 'string' ? decoded : (decoded as any).userId;
  const { bookId } = await req.json();
  if (!bookId) {
    return NextResponse.json({ error: 'Falta el ID del libro.' }, { status: 400 });
  }
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
  }
  const idx = user.favorites?.indexOf(bookId) ?? -1;
  if (idx === -1) {
    user.favorites = [...(user.favorites || []), bookId];
    await user.save();
    return NextResponse.json({ message: 'Libro agregado a favoritos.', favorites: user.favorites });
  } else {
    user.favorites = (user.favorites || []).filter((id: string) => id !== bookId);
    await user.save();
    return NextResponse.json({ message: 'Libro quitado de favoritos.', favorites: user.favorites });
  }
}
