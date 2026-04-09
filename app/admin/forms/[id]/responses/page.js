"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FormResponsesPage({ params }) {
  const [data, setData] = useState({ responses: [], analytics: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      const res = await fetch(`/api/forms/${params.id}/responses`);
      const body = await res.json();

      if (!res.ok) {
        setError(body.error || "Failed to load responses");
      } else {
        setData(body);
      }
      setLoading(false);
    };

    run();
  }, [params.id]);

  const exportCsv = () => {
    window.open(`/api/forms/${params.id}/export`, "_blank");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/admin" className="text-sm text-slate-600 hover:underline dark:text-slate-300">
            ← Back
          </Link>
          <h1 className="text-2xl font-black tracking-tight">Responses</h1>
        </div>
        <button onClick={exportCsv} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
          Export CSV
        </button>
      </div>

      {Object.keys(data.analytics || {}).length > 0 && (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(data.analytics).map(([key, stat]) => (
            <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase text-slate-500">{stat.label}</p>
              <p className="text-2xl font-black">{stat.avg}</p>
              <p className="text-xs text-slate-500">{stat.count} responses</p>
            </div>
          ))}
        </section>
      )}

      {loading ? <p>Loading...</p> : null}
      {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

      {!loading && !error && (
        <div className="overflow-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-4 py-3 text-left">Submitted At</th>
                <th className="px-4 py-3 text-left">Answers</th>
              </tr>
            </thead>
            <tbody>
              {data.responses.map((res) => (
                <tr key={res._id} className="border-b border-slate-100 align-top dark:border-slate-800/80">
                  <td className="px-4 py-3">{new Date(res.submittedAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(res.answers, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!data.responses.length ? (
            <p className="p-4 text-sm text-slate-500">No responses yet.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
