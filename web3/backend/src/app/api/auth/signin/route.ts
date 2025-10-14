import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Manejar preflight OPTIONS
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();

    if (!message || !signature) {
      return NextResponse.json({ error: 'Message and signature are required' }, { status: 400 });
    }

    // Verificar la firma SIWE
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature });

    // Generar JWT
    const token = jwt.sign(
      { address: fields.data.address },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
}
