import { NextRequest, NextResponse } from 'next/server';
import { SiweMessage } from 'siwe';
import { getAddress } from 'viem';

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
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // Validar y convertir a formato checksummed (EIP-55)
    let checksummedAddress: string;
    try {
      checksummedAddress = getAddress(address);
    } catch {
      return NextResponse.json({ error: 'Invalid Ethereum address' }, { status: 400 });
    }

    const message = new SiweMessage({
      domain: 'localhost',
      address: checksummedAddress,
      statement: 'Sign in with Ethereum to the faucet app',
      uri: 'http://localhost:3001',
      version: '1',
      chainId: 11155111, // Sepolia
      nonce: Math.random().toString(36).substring(2, 15),
    });

    return NextResponse.json({ message: message.prepareMessage() });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
