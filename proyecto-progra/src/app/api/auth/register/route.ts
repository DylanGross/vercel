import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User'

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña son requeridos.' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
  }

  await dbConnect(); 

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'El email ya está registrado.' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
    name,
  });
  await user.save();

  return NextResponse.json({
    message: 'Usuario registrado correctamente.',
    user: {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      _id: user._id,
    },
  }, { status: 201 });
}
