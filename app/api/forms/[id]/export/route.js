import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Parser } from "json2csv";
import { connectDB } from "@/lib/db";
import { getAdminFromCookie, unauthorized } from "@/lib/auth";
import Form from "@/models/Form";
import ResponseModel from "@/models/Response";

export async function GET(_, { params }) {
  await connectDB();
  const admin = await getAdminFromCookie();
  if (!admin) return unauthorized();

  const id = params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid form id" }, { status: 400 });
  }

  const form = await Form.findById(id).lean();
  if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

  const responses = await ResponseModel.find({ formId: id }).sort({ submittedAt: -1 }).lean();

  const rows = responses.map((item) => {
    const row = {
      submittedAt: item.submittedAt,
    };

    form.fields.forEach((field) => {
      const value = item.answers?.[field.key];
      row[field.label] = Array.isArray(value) ? value.join(" | ") : value ?? "";
    });

    return row;
  });

  const parser = new Parser();
  const csv = parser.parse(rows);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=form-${id}-responses.csv`,
    },
  });
}
