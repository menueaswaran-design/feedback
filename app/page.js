import Link from "next/link";
import { connectDB } from "@/lib/db";
import Form from "@/models/Form";

export const dynamic = "force-dynamic";

export default async function Home() {
  let publishedForms = [];

  try {
    await connectDB();
    const forms = await Form.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .select("title description fields createdAt")
      .lean();

    publishedForms = forms.map((form) => ({
      id: form._id.toString(),
      title: form.title,
      description: form.description,
      fieldCount: form.fields?.length || 0,
      createdAt: form.createdAt,
    }));
  } catch {
    publishedForms = [];
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-lime-300/20 blur-3xl" />

      <main className="relative mx-auto w-full max-w-6xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-2xl backdrop-blur md:p-10 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">Student Portal</p>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">Fill Your Feedback</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Select your published feedback form below and submit your response. No student login is needed.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/admin/login"
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white dark:bg-cyan-500 dark:text-slate-950"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-xl backdrop-blur md:p-8 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight">Available Feedback Forms</h2>
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200">
              {publishedForms.length} published
            </span>
          </div>

          {publishedForms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
              No feedback forms are published yet. Please check back later.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {publishedForms.map((form) => (
                <article
                  key={form.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-950"
                >
                  <h3 className="line-clamp-2 text-base font-extrabold">{form.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                    {form.description || "No description provided."}
                  </p>
                  <p className="mt-3 text-xs text-slate-500">Fields: {form.fieldCount}</p>
                  <p className="text-xs text-slate-500">
                    Created: {new Date(form.createdAt).toLocaleDateString()}
                  </p>

                  <Link
                    href={`/form/${form.id}`}
                    className="mt-4 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
                  >
                    Fill Feedback
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
