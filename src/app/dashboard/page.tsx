"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Credential {
	_id: string;
	sitename: string;
	username: string;
	email: string;
	password: string;
	other?: string;
}

export default function DashboardPage() {
	const [credentials, setCredentials] = useState<Credential[]>([]);
	const [sitename, setSitename] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [other, setOther] = useState("");
	const [search, setSearch] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editForm, setEditForm] = useState({
		sitename: "",
		username: "",
		email: "",
		password: "",
		other: "",
	});
	const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
		new Set()
	);
	const router = useRouter();

	// Check auth
	useEffect(() => {
		if (typeof window !== "undefined" && !localStorage.getItem("token")) {
			router.push("/login");
		}
	}, [router]);

	// Fetch all credentials
	async function fetchCredentials() {
		setLoading(true);
		setError("");
		const token = localStorage.getItem("token");
		const res = await fetch("/api/credentials", {
			headers: { Authorization: `Bearer ${token}` },
		});
		const data = await res.json();
		if (res.ok) {
			setCredentials(data.credentials);
		} else {
			setError(data.error || "Failed to fetch credentials");
		}
		setLoading(false);
	}

	useEffect(() => {
		fetchCredentials();
	}, []);

	// Add new credential
	async function handleAdd(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		const token = localStorage.getItem("token");
		const res = await fetch("/api/credentials", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ sitename, username, email, password, other }),
		});
		if (res.ok) {
			setSitename("");
			setUsername("");
			setEmail("");
			setPassword("");
			setOther("");
			fetchCredentials();
		} else {
			const data = await res.json();
			setError(data.error || "Failed to add credential");
		}
	}

	// Search credentials
	async function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		const token = localStorage.getItem("token");
		const res = await fetch(
			`/api/credentials/search?sitename=${encodeURIComponent(search)}`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const data = await res.json();
		if (res.ok) {
			setCredentials(data.credentials);
		} else {
			setError(data.error || "Search failed");
		}
	}

	function handleLogout() {
		localStorage.removeItem("token");
		router.push("/login");
	}

	// Start editing a credential
	function startEdit(credential: Credential) {
		setEditingId(credential._id);
		setEditForm({
			sitename: credential.sitename,
			username: credential.username,
			email: credential.email,
			password: credential.password,
			other: credential.other || "",
		});
	}

	// Cancel editing
	function cancelEdit() {
		setEditingId(null);
		setEditForm({
			sitename: "",
			username: "",
			email: "",
			password: "",
			other: "",
		});
	}

	// Update credential
	async function handleUpdate(e: React.FormEvent) {
		e.preventDefault();
		if (!editingId) return;

		setError("");
		const token = localStorage.getItem("token");
		const res = await fetch(`/api/credentials/${editingId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(editForm),
		});

		if (res.ok) {
			cancelEdit();
			fetchCredentials();
		} else {
			const data = await res.json();
			setError(data.error || "Failed to update credential");
		}
	}

	// Delete credential
	async function handleDelete(id: string) {
		if (!confirm("Are you sure you want to delete this credential?")) return;

		setError("");
		const token = localStorage.getItem("token");
		const res = await fetch(`/api/credentials/${id}`, {
			method: "DELETE",
			headers: { Authorization: `Bearer ${token}` },
		});

		if (res.ok) {
			fetchCredentials();
		} else {
			const data = await res.json();
			setError(data.error || "Failed to delete credential");
		}
	}

	// Toggle password visibility for a specific credential
	function togglePasswordVisibility(id: string) {
		setVisiblePasswords((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	}

	// Copy text to clipboard
	async function copyToClipboard(text: string, fieldName: string) {
		try {
			await navigator.clipboard.writeText(text);
			// Show temporary success message
			const originalText = `${fieldName} copied!`;
			setError(originalText);
			setTimeout(() => setError(""), 2000);
		} catch (err) {
			setError("Failed to copy to clipboard");
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Password Manager</h1>
				<button
					onClick={handleLogout}
					className="bg-red-500 text-white px-4 py-2 rounded"
				>
					Logout
				</button>
			</div>
			<form
				onSubmit={handleAdd}
				className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-2 max-w-xl mx-auto"
			>
				<h2 className="text-lg font-semibold mb-2">Add New Credential</h2>
				<input
					type="text"
					placeholder="Site Name"
					value={sitename}
					onChange={(e) => setSitename(e.target.value)}
					className="border p-2 rounded"
					required
				/>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="border p-2 rounded"
					required
				/>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="border p-2 rounded"
					required
				/>
				<div className="relative">
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="border p-2 rounded w-full pr-10"
						required
					/>
					<button
						type="button"
						onClick={() => {
							const input = document.querySelector(
								'input[placeholder="Password"]'
							) as HTMLInputElement;
							if (input) {
								input.type = input.type === "password" ? "text" : "password";
							}
						}}
						className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
					>
						👁️
					</button>
				</div>
				<input
					type="text"
					placeholder="Other details"
					value={other}
					onChange={(e) => setOther(e.target.value)}
					className="border p-2 rounded"
				/>
				<button
					type="submit"
					className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
				>
					Add Credential
				</button>
			</form>
			<form
				onSubmit={handleSearch}
				className="max-w-xl mx-auto mb-4 flex gap-2"
			>
				<input
					type="text"
					placeholder="Search by site name"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="border p-2 rounded flex-1"
				/>
				<button type="submit" className="bg-gray-700 text-white px-4 rounded">
					Search
				</button>
				<button
					type="button"
					onClick={fetchCredentials}
					className="bg-gray-300 px-4 rounded"
				>
					Reset
				</button>
			</form>
			{error && (
				<div
					className={`text-center mb-4 p-2 rounded ${
						error.includes("copied!")
							? "text-green-600 bg-green-100"
							: "text-red-500 bg-red-100"
					}`}
				>
					{error}
				</div>
			)}
			<div className="max-w-xl mx-auto">
				{loading ? (
					<div>Loading...</div>
				) : credentials.length === 0 ? (
					<div className="text-gray-500">No credentials found.</div>
				) : (
					<table className="w-full bg-white rounded shadow overflow-hidden">
						<thead>
							<tr className="bg-gray-100">
								<th className="p-2 text-left">Site</th>
								<th className="p-2 text-left">Username</th>
								<th className="p-2 text-left">Email</th>
								<th className="p-2 text-left">Password</th>
								<th className="p-2 text-left">Other</th>
								<th className="p-2 text-left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{credentials.map((c) => (
								<tr key={c._id} className="border-t">
									{editingId === c._id ? (
										// Edit form row
										<td colSpan={6} className="p-2">
											<form
												onSubmit={handleUpdate}
												className="flex flex-col gap-2"
											>
												<div className="grid grid-cols-5 gap-2">
													<input
														type="text"
														value={editForm.sitename}
														onChange={(e) =>
															setEditForm({
																...editForm,
																sitename: e.target.value,
															})
														}
														className="border p-1 rounded text-sm"
														required
													/>
													<input
														type="text"
														value={editForm.username}
														onChange={(e) =>
															setEditForm({
																...editForm,
																username: e.target.value,
															})
														}
														className="border p-1 rounded text-sm"
														required
													/>
													<input
														type="email"
														value={editForm.email}
														onChange={(e) =>
															setEditForm({
																...editForm,
																email: e.target.value,
															})
														}
														className="border p-1 rounded text-sm"
														required
													/>
													<div className="relative">
														<input
															type="password"
															value={editForm.password}
															onChange={(e) =>
																setEditForm({
																	...editForm,
																	password: e.target.value,
																})
															}
															className="border p-1 rounded text-sm w-full pr-8"
															required
														/>
														<button
															type="button"
															onClick={(e) => {
																const input = e.currentTarget
																	.previousElementSibling as HTMLInputElement;
																if (input) {
																	input.type =
																		input.type === "password"
																			? "text"
																			: "password";
																}
															}}
															className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xs"
														>
															👁️
														</button>
													</div>
													<input
														type="text"
														value={editForm.other}
														onChange={(e) =>
															setEditForm({
																...editForm,
																other: e.target.value,
															})
														}
														className="border p-1 rounded text-sm"
													/>
												</div>
												<div className="flex gap-2">
													<button
														type="submit"
														className="bg-green-600 text-white px-2 py-1 rounded text-sm"
													>
														Save
													</button>
													<button
														type="button"
														onClick={cancelEdit}
														className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
													>
														Cancel
													</button>
												</div>
											</form>
										</td>
									) : (
										// Normal display row
										<>
											<td
												className="p-2 cursor-pointer hover:bg-gray-100 transition-colors"
												onClick={() => copyToClipboard(c.sitename, "Site name")}
												title="Click to copy site name"
											>
												{c.sitename}
											</td>
											<td
												className="p-2 cursor-pointer hover:bg-gray-100 transition-colors"
												onClick={() => copyToClipboard(c.username, "Username")}
												title="Click to copy username"
											>
												{c.username}
											</td>
											<td
												className="p-2 cursor-pointer hover:bg-gray-100 transition-colors"
												onClick={() => copyToClipboard(c.email, "Email")}
												title="Click to copy email"
											>
												{c.email}
											</td>
											<td className="p-2">
												<div className="flex items-center gap-2">
													<span
														className="cursor-pointer hover:bg-gray-100 transition-colors px-1 rounded"
														onClick={() =>
															copyToClipboard(c.password, "Password")
														}
														title="Click to copy password"
													>
														{visiblePasswords.has(c._id)
															? c.password
															: "••••••••"}
													</span>
													<button
														onClick={() => togglePasswordVisibility(c._id)}
														className="text-gray-500 hover:text-gray-700 text-sm"
													>
														{visiblePasswords.has(c._id) ? "🙈" : "👁️"}
													</button>
												</div>
											</td>
											<td
												className="p-2 cursor-pointer hover:bg-gray-100 transition-colors"
												onClick={() =>
													copyToClipboard(c.other || "", "Other details")
												}
												title="Click to copy other details"
											>
												{c.other}
											</td>
											<td className="p-2">
												<div className="flex gap-2">
													<button
														onClick={() => startEdit(c)}
														className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
													>
														Edit
													</button>
													<button
														onClick={() => handleDelete(c._id)}
														className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
													>
														Delete
													</button>
												</div>
											</td>
										</>
									)}
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
