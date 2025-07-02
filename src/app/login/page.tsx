"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		const data = await res.json();
		if (res.ok && data.token) {
			localStorage.setItem("token", data.token);
			router.push("/dashboard");
		} else {
			setError(data.error || "Login failed");
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded shadow-md w-80 flex flex-col gap-4"
			>
				<h2 className="text-2xl font-bold mb-4">Login</h2>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="border p-2 rounded"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="border p-2 rounded"
					required
				/>
				{error && <div className="text-red-500 text-sm">{error}</div>}
				<button
					type="submit"
					className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
				>
					Login
				</button>
				<p className="text-sm mt-2">
					Don't have an account?{" "}
					<a href="/signup" className="text-blue-600 underline">
						Sign Up
					</a>
				</p>
			</form>
		</div>
	);
}
