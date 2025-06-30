import { JwtPayload } from 'jwt-decode';
import NextAuth from 'next-auth';
import { GoogleIdTokenPayload } from './types';

declare module 'next-auth' {
	interface Session {
		sessionToken?: string;
		provider?: string;
		payload: GoogleIdTokenPayload;
		id_token: string;
		isExpired?: boolean;
		mongoDb: MongoDb;
	}

	interface User {
		customProfile?: object;
	}

	interface Account {
		mongoDb: MongoDb;
	}

	interface MongoDb {
		id: string;
		name: string;
		email: string;
		imageUrl: string;
		createdAt: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string;
		provider?: string;
		userId?: string;
		id_token?: string;
	}
}
