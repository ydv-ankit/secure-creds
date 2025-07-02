import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
	await connectToDatabase();
	const { email, password } = await req.json();
	if (!email || !password) {
		return NextResponse.json(
			{ error: "Email and password are required." },
			{ status: 400 }
		);
	}
	const user = await User.findOne({ email });
	if (!user) {
		return NextResponse.json(
			{ error: "Invalid credentials." },
			{ status: 401 }
		);
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return NextResponse.json(
			{ error: "Invalid credentials." },
			{ status: 401 }
		);
	}
	const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
		expiresIn: "7d",
	});
	return NextResponse.json({ token }, { status: 200 });
}
