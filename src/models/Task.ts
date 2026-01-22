import mongoose, { Document, Schema } from "mongoose";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  project: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  fingerprint?: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO"
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true
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
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    fingerprint: {
      type: String,
      unique: true,
      sparse: true
    },
  },
  { timestamps: true }
);
taskSchema.index(
  { title: 1, project: 1, organization: 1 },
  { unique: true }
);

export default mongoose.model<ITask>("Task", taskSchema);
