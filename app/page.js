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

            <Link
              href="/admin/login"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
            >
              Login
            </Link>
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
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:from-slate-900 dark:to-slate-950"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-200/40 blur-2xl transition group-hover:bg-cyan-300/50 dark:bg-cyan-900/30" />

                  <h3 className="line-clamp-2 text-base font-extrabold">{form.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                    {form.description || "No description provided."}
                  </p>

                  <Link
                    href={`/form/${form.id}`}
                    className="mt-5 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500"
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
