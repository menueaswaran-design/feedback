import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAdminFromCookie, unauthorized } from "@/lib/auth";
import Form from "@/models/Form";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const publishedOnly = searchParams.get("published") === "true";

  if (!publishedOnly) {
    const admin = await getAdminFromCookie();
    if (!admin) return unauthorized();
  }

  const query = publishedOnly ? { isPublished: true } : {};
  const forms = await Form.find(query).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ forms });
}

export async function POST(req) {
  await connectDB();
  const admin = await getAdminFromCookie();
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    if (!body?.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const form = await Form.create({
      title: body.title,
      description: body.description || "",
      fields: body.fields || [],
      isPublished: !!body.isPublished,
    });

    return NextResponse.json({ form }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create form", details: error.message }, { status: 500 });
  }
}
