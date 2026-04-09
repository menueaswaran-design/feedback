import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Form from "@/models/Form";
import DynamicPublicForm from "@/components/forms/DynamicPublicForm";

export const dynamic = "force-dynamic";

export default async function PublicFormPage({ params }) {
  await connectDB();
  const form = await Form.findById(params.id).lean();

  if (!form || !form.isPublished) notFound();

  const serializable = {
    ...form,
    _id: form._id.toString(),
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white shadow-lg">
          <h1 className="text-3xl font-black tracking-tight">{serializable.title}</h1>
          <p className="mt-2 text-sm text-cyan-50">{serializable.description}</p>
        </div>

        <DynamicPublicForm form={serializable} />
      </div>
    </div>
  );
}
