"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function FormResponsesPage({ params }) {
  const [data, setData] = useState({ responses: [], analytics: {}, form: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

  const responseColumns = useMemo(() => {
    if (Array.isArray(data.form?.fields) && data.form.fields.length) {
      return data.form.fields.map((field) => ({ key: field.key, label: field.label }));
    }

    const keys = new Set();
    (data.responses || []).forEach((response) => {
      Object.keys(response.answers || {}).forEach((key) => keys.add(key));
    });
    return Array.from(keys).map((key) => ({ key, label: key }));
  }, [data.form, data.responses]);

  const filteredResponses = useMemo(() => {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
    const to = toDate ? new Date(`${toDate}T23:59:59.999`) : null;

    return (data.responses || []).filter((response) => {
      const submittedAt = new Date(response.submittedAt);
      if (from && submittedAt < from) return false;
      if (to && submittedAt > to) return false;
      return true;
    });
  }, [data.responses, fromDate, toDate]);

  const formatCellValue = (value) => {
    if (Array.isArray(value)) return value.join(", ");
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
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

      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Filter By Date</p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-slate-600 dark:text-slate-300">To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold dark:border-slate-700"
          >
            Clear
          </button>
        </div>
      </section>

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
                {responseColumns.map((column) => (
                  <th key={column.key} className="px-4 py-3 text-left whitespace-nowrap">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredResponses.map((res) => (
                <tr key={res._id} className="border-b border-slate-100 align-top dark:border-slate-800/80">
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(res.submittedAt).toLocaleString()}</td>
                  {responseColumns.map((column) => (
                    <td key={`${res._id}-${column.key}`} className="px-4 py-3">
                      {formatCellValue(res.answers?.[column.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {!filteredResponses.length ? (
            <p className="p-4 text-sm text-slate-500">No responses yet.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
