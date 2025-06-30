import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/sidebar/sidebar';
import { AuthProvider } from '@/providers/AuthProvider';
import { auth } from 'auth';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Dovixon',
	description: 'Personal Website',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	if (session?.user) {
		session.user = {
			name: session.user.name,
			email: session.user.email,
			image: session.user.image,
		};
	}

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AuthProvider session={session}>
					<div className={'main-container'}>
						<Sidebar />
						<div className={'wrapper'}>{children}</div>
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
