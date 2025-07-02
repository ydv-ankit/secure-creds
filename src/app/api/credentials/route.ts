import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Credential from "@/lib/models/Credential";
import { connectToDatabase } from "@/lib/mongodb";
import { encryptPassword, decryptPassword } from "@/lib/encryption";

const JWT_SECRET = process.env.JWT_SECRET as string;

function getUserIdFromRequest(req: NextRequest) {
	const auth = req.headers.get("authorization");
	if (!auth) return null;
	const token = auth.replace("Bearer ", "");
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
		return decoded.userId;
	} catch {
		return null;
	}
}

export async function POST(req: NextRequest) {
	await connectToDatabase();
	const userId = getUserIdFromRequest(req);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { sitename, username, email, password, other } = await req.json();
	if (!sitename || !username || !email || !password) {
		return NextResponse.json(
			{ error: "Missing required fields." },
			{ status: 400 }
		);
	}
	const encryptedPassword = encryptPassword(password);
	const credential = new Credential({
		sitename,
		username,
		email,
		password: encryptedPassword,
		other,
		userId,
	});
	await credential.save();
	return NextResponse.json({ message: "Credential saved." }, { status: 201 });
}

export async function GET(req: NextRequest) {
	await connectToDatabase();
	const userId = getUserIdFromRequest(req);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const credentials = await Credential.find({ userId });

	// Decrypt passwords before sending to client
	const decryptedCredentials = credentials.map((credential) => ({
		...credential.toObject(),
		password: decryptPassword(credential.password),
	}));

	return NextResponse.json(
		{ credentials: decryptedCredentials },
		{ status: 200 }
	);
}
