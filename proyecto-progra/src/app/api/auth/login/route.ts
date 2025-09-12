// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // Usá una variable de entorno en producción

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // 1. Validar datos
  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña son requeridos.' }, { status: 400 });
  }

  await dbConnect();

  // 2. Buscar usuario
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
  }

  // 3. Comparar contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
  }

  // 4. Generar JWT
  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  // 5. Devolver token y datos del usuario
  return NextResponse.json({
    message: 'Login exitoso.',
    token,
    user: {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      _id: user._id,
    },
  });
}
