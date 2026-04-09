import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { createToken, setAuthCookie } from "@/lib/auth";
import Admin from "@/models/Admin";

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase()?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) return;

  const existing = await Admin.findOne({ email });
  if (existing) {
    const matches = await bcrypt.compare(password, existing.password);
    if (!matches) {
      const hashed = await bcrypt.hash(password, 10);
      existing.password = hashed;
      await existing.save();
    }
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ email, password: hashed });
}

export async function POST(req) {
  try {
    await connectDB();
    await ensureAdmin();

    const body = await req.json();
    const email = body?.email?.toLowerCase()?.trim();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createToken({
      role: "admin",
      email: admin.email,
      adminId: admin._id.toString(),
    });

    const response = NextResponse.json({ ok: true, email: admin.email });
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Login failed", details: error.message }, { status: 500 });
  }
}
