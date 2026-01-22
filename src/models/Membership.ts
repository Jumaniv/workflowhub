import mongoose, { Document, Schema } from "mongoose";

export type Role = "ADMIN" | "MANAGER" | "MEMBER";

export interface IMembership extends Document {
  user: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  role: Role;
}

const membershipSchema = new Schema<IMembership>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "MEMBER"],
      default: "MEMBER"
    }
  },
  { timestamps: true }
);

// prevent duplicate membership
membershipSchema.index({ user: 1, organization: 1 }, { unique: true });

export default mongoose.model<IMembership>(
  "Membership",
  membershipSchema
);
