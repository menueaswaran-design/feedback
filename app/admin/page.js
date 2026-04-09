import Link from "next/link";
import { connectDB } from "@/lib/db";
import Form from "@/models/Form";
import FormCardActions from "@/components/admin/FormCardActions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectDB();
  const forms = await Form.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Create and manage dynamic feedback workflows.</p>
        </div>
        <Link href="/admin/forms/new" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
          + New Form
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {forms.map((form) => (
          <article key={form._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="line-clamp-1 text-base font-bold">{form.title}</h2>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${form.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {form.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{form.description || "No description"}</p>
            <p className="mt-3 text-xs text-slate-500">Fields: {form.fields.length}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link href={`/admin/forms/${form._id}/edit`} className="rounded-full border px-3 py-1.5">Edit</Link>
              <Link href={`/admin/forms/${form._id}/responses`} className="rounded-full border px-3 py-1.5">Responses</Link>
              <Link href={`/form/${form._id}`} className="rounded-full border px-3 py-1.5">Open</Link>
              <FormCardActions id={form._id.toString()} isPublished={form.isPublished} />
            </div>
          </article>
        ))}
      </div>

      {!forms.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
          No forms yet. Start by creating your first feedback form.
        </div>
      ) : null}
    </div>
  );
}
