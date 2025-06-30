'use client';

import React, { useState } from 'react';
import styles from './sidebar.module.css';
import Image from 'next/image';
import { Sidebar as SidePro, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { handleSignIn, handleSignOut } from '../auth-components';
import { useSession } from 'next-auth/react';

const Menus = [
	{
		href: '/',
		alt: 'home',
		src: '/home.png',
	},
	{
		href: '/alkitab',
		alt: 'Alkitab',
		src: '/bible-icon.png',
	},
	{
		href: '/blog',
		alt: 'blog',
		src: '/blog.png',
	},
	{
		href: '#',
		alt: 'about',
		src: '/about.png',
	},
];

export default function Sidebar() {
	const { data: session } = useSession();

	const [isCollapsed, setCollapsed] = useState(true);
	const expandBase = () => {
		setCollapsed(!isCollapsed);
	};

	return (
		<div className={styles.container}>
			<div className={styles.arrow} onClick={() => expandBase()}>
				<Image
					width={22}
					height={22}
					alt="right"
					src={isCollapsed ? '/right.png' : '/back.png'}
				/>
			</div>

			<SidePro
				collapsed={isCollapsed}
				backgroundColor="#515768"
				collapsedWidth="120px"
				style={{
					minHeight: '100vh',
					overflow: 'visible',
				}}
				rootStyles={{
					borderRight: 'none',
					boxShadow:
						'0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
					}}
				>
					<div className={styles.logo}>
						<Image
							width={80}
							height={0}
							alt="logo"
							src={'/logo-nobg.png'}
						/>
					</div>

					<div style={{ flex: 1 }}>
						<Menu
							menuItemStyles={{
								root: {
									justifyContent: 'center',
									alignItems: 'center',
								},
								button: {
									margin: '20px',
									':hover': {
										backgroundColor: '#434a5c',
									},
								},
							}}
						>
							{Menus.map((menu, index) => (
								<MenuItem
									key={'menu-' + index}
									href={menu.href}
									icon={
										<Image
											width={26}
											height={26}
											src={menu.src}
											alt={menu.alt}
										/>
									}
								>
									<span className={styles.menuSpan}>
										{menu.alt}
									</span>
								</MenuItem>
							))}
						</Menu>
					</div>

					<div>
						<Menu
							menuItemStyles={{
								root: {
									justifyContent: 'center',
									alignItems: 'center',
								},
								button: {
									margin: '20px',
									':hover': {
										backgroundColor: '#434a5c',
									},
								},
							}}
						>
							{session ? (
								<MenuItem
									onClick={async () => {
										try {
											await handleSignOut();
											window.location.reload();
										} catch (error) {
											console.error(
												'Sign out failed:',
												error
											);
										}
									}}
									icon={
										<Image
											width={26}
											height={26}
											src={session.user?.image || ''}
											alt={'sign-in'}
										/>
									}
								>
									<span className={styles.menuSpan}>
										{session.user?.name}
									</span>
								</MenuItem>
							) : (
								<MenuItem
									onClick={() => handleSignIn()}
									icon={
										<Image
											width={26}
											height={26}
											src={'/sign-in.png'}
											alt={'sign-in'}
										/>
									}
								>
									<span className={styles.menuSpan}>
										Sign In
									</span>
								</MenuItem>
							)}
						</Menu>
					</div>
				</div>
			</SidePro>
		</div>
	);
}
