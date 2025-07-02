import mongoose, { Schema, models, model } from "mongoose";

const CredentialSchema = new Schema(
	{
		sitename: { type: String, required: true },
		username: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		other: { type: String },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true }
);

export default models.Credential || model("Credential", CredentialSchema);
