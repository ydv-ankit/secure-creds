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

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
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

	try {
		const encryptedPassword = encryptPassword(password);
		const credential = await Credential.findOneAndUpdate(
			{ _id: id, userId },
			{ sitename, username, email, password: encryptedPassword, other },
			{ new: true }
		);

		if (!credential) {
			return NextResponse.json(
				{ error: "Credential not found or unauthorized" },
				{ status: 404 }
			);
		}

		// Decrypt password before sending response
		const decryptedCredential = {
			...credential.toObject(),
			password: decryptPassword(credential.password),
		};

		return NextResponse.json(
			{ credential: decryptedCredential },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update credential" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	await connectToDatabase();
	const userId = getUserIdFromRequest(req);
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const credential = await Credential.findOneAndDelete({
			_id: (await params).id,
			userId,
		});

		if (!credential) {
			return NextResponse.json(
				{ error: "Credential not found or unauthorized" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Credential deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to delete credential" },
			{ status: 500 }
		);
	}
}
