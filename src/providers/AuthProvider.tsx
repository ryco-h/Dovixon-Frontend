import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

interface AuthProviderPropType {
	session: Session | null;
}

export const AuthProvider = ({
	session,
	children,
}: AuthProviderPropType & React.HTMLAttributes<HTMLBodyElement>) => {
	return <SessionProvider session={session}>{children}</SessionProvider>;
};
