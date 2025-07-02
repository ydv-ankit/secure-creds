"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

	useEffect(() => {
		// Check if user is already logged in
		const token = localStorage.getItem("token");
		setIsLoggedIn(!!token);
	}, []);

	if (isLoggedIn === null) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (isLoggedIn) {
		router.push("/dashboard");
		return null;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			{/* Navigation */}
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<h1 className="text-2xl font-bold text-blue-600">
								🔐 Secure Creds
							</h1>
						</div>
						<div className="flex space-x-4">
							<button
								onClick={() => router.push("/login")}
								className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Login
							</button>
							<button
								onClick={() => router.push("/signup")}
								className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
							>
								Get Started
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="text-center">
					<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
						Secure Password Management <br />
						<span className="text-blue-600">Made Simple</span>
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
						Store, manage, and access your passwords securely. Never forget a
						password again with our intuitive password manager.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={() => router.push("/signup")}
							className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
						>
							Start Free Today
						</button>
						<button
							onClick={() => router.push("/login")}
							className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
						>
							Sign In
						</button>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="bg-white py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Why Choose Secure Creds?
						</h2>
						<p className="text-lg text-gray-600">
							Everything you need to manage your passwords securely
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="text-center p-6">
							<div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl">🔒</span>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Secure Storage
							</h3>
							<p className="text-gray-600">
								Your passwords are encrypted and stored securely. Only you have
								access to your credentials.
							</p>
						</div>

						<div className="text-center p-6">
							<div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl">⚡</span>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Quick Access
							</h3>
							<p className="text-gray-600">
								One-click copy to clipboard. Access your passwords instantly
								when you need them.
							</p>
						</div>

						<div className="text-center p-6">
							<div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl">🔍</span>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Smart Search
							</h3>
							<p className="text-gray-600">
								Find your credentials quickly with our powerful search
								functionality.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* How It Works */}
			<div className="bg-gray-50 py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							How It Works
						</h2>
						<p className="text-lg text-gray-600">Get started in minutes</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
								1
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Sign Up
							</h3>
							<p className="text-gray-600">
								Create your account with email and password. It only takes a few
								seconds.
							</p>
						</div>

						<div className="text-center">
							<div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
								2
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Add Credentials
							</h3>
							<p className="text-gray-600">
								Store your website credentials securely. Add as many as you
								need.
							</p>
						</div>

						<div className="text-center">
							<div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
								3
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Access Anywhere
							</h3>
							<p className="text-gray-600">
								Log in from any device and access your passwords instantly.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="bg-blue-600 py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl font-bold text-white mb-4">
						Ready to Get Started?
					</h2>
					<p className="text-xl text-blue-100 mb-8">
						Join thousands of users who trust Secure Creds for their password
						management.
					</p>
					<button
						onClick={() => router.push("/signup")}
						className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
					>
						Create Free Account
					</button>
				</div>
			</div>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h3 className="text-2xl font-bold mb-4">🔐 Secure Creds</h3>
						<p className="text-gray-400 mb-4">
							Your passwords, secured and simplified.
						</p>

						<div className="mt-8 pt-8 border-t border-gray-800">
							<p className="text-gray-500 text-sm">
								© {new Date().getFullYear()} Secure Creds. Built with Next.js
								and MongoDB.
							</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
