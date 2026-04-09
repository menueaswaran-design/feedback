import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Form from "@/models/Form";
import FormBuilder from "@/components/admin/FormBuilder";

export const dynamic = "force-dynamic";

export default async function EditFormPage({ params }) {
  await connectDB();
  const form = await Form.findById(params.id).lean();
  if (!form) notFound();

  const serializable = {
    ...form,
    _id: form._id.toString(),
  };

  return (
    <div className="space-y-4">
      <Link href="/admin" className="text-sm font-semibold text-slate-600 hover:underline dark:text-slate-300">
        ← Back to Dashboard
      </Link>
      <FormBuilder form={serializable} />
    </div>
  );
}
