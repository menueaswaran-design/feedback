import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAdminFromCookie, unauthorized } from "@/lib/auth";
import Form from "@/models/Form";

function validObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_, { params }) {
  await connectDB();

  const id = params.id;
  if (!validObjectId(id)) {
    return NextResponse.json({ error: "Invalid form id" }, { status: 400 });
  }

  const form = await Form.findById(id).lean();
  if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

  return NextResponse.json({ form });
}

export async function PUT(req, { params }) {
  await connectDB();
  const admin = await getAdminFromCookie();
  if (!admin) return unauthorized();

  const id = params.id;
  if (!validObjectId(id)) {
    return NextResponse.json({ error: "Invalid form id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const updated = await Form.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description || "",
        fields: body.fields || [],
      },
      { new: true, runValidators: true }
    );

    if (!updated) return NextResponse.json({ error: "Form not found" }, { status: 404 });

    return NextResponse.json({ form: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update form", details: error.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  await connectDB();
  const admin = await getAdminFromCookie();
  if (!admin) return unauthorized();

  const id = params.id;
  if (!validObjectId(id)) {
    return NextResponse.json({ error: "Invalid form id" }, { status: 400 });
  }

  await Form.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
