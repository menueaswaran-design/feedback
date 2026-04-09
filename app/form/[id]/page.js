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
    <div className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(45,212,191,0.12),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.12),transparent_38%),radial-gradient(circle_at_50%_95%,rgba(16,185,129,0.1),transparent_42%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(45,212,191,0.22),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.25),transparent_38%),radial-gradient(circle_at_50%_95%,rgba(16,185,129,0.18),transparent_42%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="self-start rounded-3xl border border-cyan-200/70 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-cyan-400/20 dark:bg-slate-900/75 dark:shadow-2xl dark:shadow-cyan-950/40">
          <p className="mb-3 inline-flex rounded-full border border-cyan-300/60 bg-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-cyan-800 dark:border-cyan-300/35 dark:bg-cyan-300/10 dark:text-cyan-200">
            Student Feedback
          </p>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">{serializable.title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{serializable.description || "Share your experience and help us improve."}</p>
        </aside>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-2xl dark:shadow-black/30 md:p-7">
          <DynamicPublicForm form={serializable} />
        </div>
      </div>
    </div>
  );
}
