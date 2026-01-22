import mongoose, { Document, Schema } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IOrganization>(
  "Organization",
  organizationSchema
);
