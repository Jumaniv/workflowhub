import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  name: string;
  organization: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", projectSchema);
