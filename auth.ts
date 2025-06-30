import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import NextAuth, { MongoDb } from 'next-auth';
import Google from 'next-auth/providers/google';
import jwt from 'jsonwebtoken';

export const { handlers, signIn, signOut, auth } = NextAuth({
	secret: process.env.SECRET,
	providers: [Google],
	callbacks: {
		async signIn({ account, user, profile }) {
			// console.log({ profile, account, user }, 'From SignIn');

			const data = {
				id: account?.providerAccountId,
				accessToken: account?.access_token,
				name: user.name,
				email: user.email,
				picture: user.image,
			};

			const secret = process.env.API_PRIVATE_KEY as jwt.Secret;
			const token = jwt.sign(
				{
					secret: 'dovixon',
				},
				secret,
				{
					algorithm: 'RS256',
					noTimestamp: true, // disable "iat"
				}
			);

			try {
				// console.log({ data });
				await axios
					.post(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/authentication`,
						{
							...data,
						},
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					)
					.then((result) => {
						if (result.data.status == 200 && account) {
							account.mongoDb = result.data.user as MongoDb;
							return true;
						} else {
							return false;
						}
					});
			} catch (error) {
				console.log('Error login => ', { error });
				return false;
			}

			return true;
		},
		async jwt({ token, account, user }) {
			// console.log({ account, token, user }, 'From JWT');
			if (account) {
				token.accessToken = account.access_token;
				token.provider = account.provider;
				token.id_token = account.id_token;
				token.userId = account.userId;
				token.mongoDb = account.mongoDb;
			}

			return token;
		},
		async session({ session, token, user }) {
			// console.log({ token }, 'From session');
			const jwtToken = jwtDecode(token.id_token as string);
			session.sessionToken = token.accessToken as string;
			session.provider = token.provider as string;
			// session.payload = jwtToken as GoogleIdTokenPayload;
			session.mongoDb = token.mongoDb as MongoDb;

			return session;
		},
	},
});
