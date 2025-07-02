import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable in .env.local"
	);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGODB_URI, {
				bufferCommands: false,
			})
			.then((mongoose) => {
				return mongoose;
			});
	}
	cached.conn = await cached.promise;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(global as any).mongoose = cached;
	return cached.conn;
}
