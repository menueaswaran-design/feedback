import mongoose, { Schema } from "mongoose";

const responseSchema = new Schema(
  {
    formId: { type: Schema.Types.ObjectId, ref: "Form", required: true },
    answers: { type: Schema.Types.Mixed, required: true },
    ipHash: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

responseSchema.index({ formId: 1, submittedAt: -1 });

export default mongoose.models.Response || mongoose.model("Response", responseSchema);
