import mongoose, { Schema } from "mongoose";

const fieldSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "textarea", "number", "rating", "slider", "select", "radio", "checkbox"],
      required: true,
    },
    required: { type: Boolean, default: false },
    options: { type: [String], default: [] },
    placeholder: { type: String, default: "" },
    min: { type: Number, default: 1 },
    max: { type: Number, default: 5 },
  },
  { _id: false }
);

const formSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    fields: { type: [fieldSchema], default: [] },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Form || mongoose.model("Form", formSchema);
