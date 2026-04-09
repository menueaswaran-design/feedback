import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAdminFromCookie, unauthorized } from "@/lib/auth";
import Form from "@/models/Form";

export async function PATCH(req, { params }) {
  await connectDB();
  const admin = await getAdminFromCookie();
  if (!admin) return unauthorized();

  const id = params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid form id" }, { status: 400 });
  }

  const body = await req.json();
  const form = await Form.findByIdAndUpdate(
    id,
    { isPublished: !!body.isPublished },
    { new: true }
  );

  if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

  return NextResponse.json({ form });
}
