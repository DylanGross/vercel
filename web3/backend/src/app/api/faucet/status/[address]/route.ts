import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Almacenamiento simple en memoria (en producción usar DB)
const claims: { [address: string]: number } = {};
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 horas

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

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    // Verificar JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const address = params.address;
    const lastClaim = claims[address] || 0;
    const now = Date.now();
    const nextClaimTime = lastClaim + COOLDOWN_MS;
    const canClaim = now >= nextClaimTime;

    return NextResponse.json({
      canClaim,
      nextClaimTime: new Date(nextClaimTime).toISOString(),
      lastClaimTime: lastClaim ? new Date(lastClaim).toISOString() : null,
    });
  } catch (error) {
    console.error('Error checking status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
