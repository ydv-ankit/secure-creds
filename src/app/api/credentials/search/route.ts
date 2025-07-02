import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Credential from "@/lib/models/Credential";
import { connectToDatabase } from "@/lib/mongodb";
import { decryptPassword } from "@/lib/encryption";

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

export async function GET(req: NextRequest) {
	await connectToDatabase();
	const userId = getUserIdFromRequest(req);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { searchParams } = new URL(req.url);
	const sitename = searchParams.get("sitename");
	if (!sitename) {
		return NextResponse.json(
			{ error: "Missing sitename query." },
			{ status: 400 }
		);
	}
	const credentials = await Credential.find({
		userId,
		sitename: { $regex: sitename, $options: "i" },
	});

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
