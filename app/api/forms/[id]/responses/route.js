import crypto from "crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAdminFromCookie, unauthorized } from "@/lib/auth";
import Form from "@/models/Form";
import ResponseModel from "@/models/Response";

function validateRequired(form, answers) {
  const missing = [];

  form.fields.forEach((field) => {
    if (!field.required) return;
    const value = answers[field.key];

    if (field.type === "checkbox") {
      if (!Array.isArray(value) || value.length === 0) missing.push(field.label);
      return;
    }

    if (value === undefined || value === null || value === "") {
      missing.push(field.label);
    }
  });

  return missing;
}

function getIpHash(req) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  return crypto.createHash("sha256").update(ip).digest("hex");
}

export async function GET(_, { params }) {
  await connectDB();
  const admin = await getAdminFromCookie();
  if (!admin) return unauthorized();

  const id = params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid form id" }, { status: 400 });
  }

  const responses = await ResponseModel.find({ formId: id }).sort({ submittedAt: -1 }).lean();
  const form = await Form.findById(id).lean();

  const analytics = {};
  if (form?.fields?.length) {
    form.fields.forEach((field) => {
      if (!["rating", "slider", "number"].includes(field.type)) return;
      const values = responses
        .map((r) => Number(r.answers?.[field.key]))
        .filter((v) => !Number.isNaN(v));
      if (!values.length) return;

      const total = values.reduce((acc, v) => acc + v, 0);
      analytics[field.key] = {
        label: field.label,
        avg: Number((total / values.length).toFixed(2)),
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    });
  }

  return NextResponse.json({
    responses,
    analytics,
    form: form
      ? {
          _id: form._id?.toString?.() || id,
          title: form.title || "",
          fields: Array.isArray(form.fields)
            ? form.fields.map((f) => ({
                key: f.key,
                label: f.label,
                type: f.type,
              }))
            : [],
        }
      : null,
  });
}

export async function POST(req, { params }) {
  await connectDB();

  const id = params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid form id" }, { status: 400 });
  }

  const form = await Form.findById(id).lean();
  if (!form || !form.isPublished) {
    return NextResponse.json({ error: "Form is unavailable" }, { status: 404 });
  }

  const body = await req.json();
  const answers = body?.answers || {};

  const missing = validateRequired(form, answers);
  if (missing.length) {
    return NextResponse.json(
      { error: "Please fill required fields", missing },
      { status: 400 }
    );
  }

  const ipHash = getIpHash(req);
  const alreadySubmitted = await ResponseModel.findOne({ formId: id, ipHash });
  if (alreadySubmitted) {
    return NextResponse.json(
      { error: "Duplicate submission blocked from this network" },
      { status: 409 }
    );
  }

  const saved = await ResponseModel.create({
    formId: id,
    answers,
    ipHash,
    submittedAt: new Date(),
  });

  return NextResponse.json({ ok: true, id: saved._id }, { status: 201 });
}
