import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const RPC_URL = process.env.RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';
const AMOUNT = ethers.parseEther('0.01'); // 0.01 ETH

// Almacenamiento simple en memoria
const claims: { [address: string]: number } = {};
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

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
    // Verificar JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { address } = await req.json();

    if (!address || address.toLowerCase() !== decoded.address.toLowerCase()) {
      return NextResponse.json({ error: 'Address mismatch' }, { status: 400 });
    }

    // Verificar cooldown
    const lastClaim = claims[address] || 0;
    const now = Date.now();
    if (now < lastClaim + COOLDOWN_MS) {
      return NextResponse.json(
        { error: 'Cooldown active. Try again later.' },
        { status: 429 }
      );
    }

    // Enviar ETH
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const tx = await wallet.sendTransaction({
      to: address,
      value: AMOUNT,
    });

    await tx.wait();

    // Actualizar último claim
    claims[address] = now;

    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      amount: ethers.formatEther(AMOUNT),
    });
  } catch (error: any) {
    console.error('Error claiming:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
