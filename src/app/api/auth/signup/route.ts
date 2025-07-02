import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
	await connectToDatabase();
	const { email, password } = await req.json();
	if (!email || !password) {
		return NextResponse.json(
			{ error: "Email and password are required." },
			{ status: 400 }
		);
	}
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return NextResponse.json(
			{ error: "User already exists." },
			{ status: 409 }
		);
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = new User({ email, password: hashedPassword });
	await user.save();
	return NextResponse.json(
		{ message: "User created successfully." },
		{ status: 201 }
	);
}
