import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
	const rawKey = process.env.API_PRIVATE_KEY || '';
	const privateKey = rawKey.replace(/\\n/g, '\n');

	try {
		const token = jwt.sign({ secret: 'dovixon' }, privateKey, {
			algorithm: 'RS256',
			noTimestamp: true,
		});

		return NextResponse.json({ token });
	} catch (error) {
		console.error('Token signing failed:', error);
		return NextResponse.json(
			{ error: 'Token signing failed' },
			{ status: 500 }
		);
	}
}
