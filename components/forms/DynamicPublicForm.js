"use client";

import { useMemo, useState } from "react";

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl ${value >= star ? "text-amber-400" : "text-slate-300"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function DynamicPublicForm({ form }) {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requiredFields = useMemo(() => form.fields.filter((f) => f.required).map((f) => f.key), [form.fields]);

  const setValue = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const missing = requiredFields.filter((key) => {
      const value = answers[key];
      if (Array.isArray(value)) return value.length === 0;
      return value === undefined || value === null || value === "";
    });

    if (missing.length) {
      setError("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    const res = await fetch(`/api/forms/${form._id}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    setSubmitting(false);
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Submission failed");
      return;
    }

    setSuccess("Thank you! Your feedback has been submitted.");
    setAnswers({});
    localStorage.setItem(`submitted_${form._id}`, "true");
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {form.fields.map((field) => (
        <div key={field.key} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
            {field.label} {field.required ? <span className="text-rose-600">*</span> : null}
          </label>

          {field.type === "text" && (
            <input
              value={answers[field.key] || ""}
              onChange={(e) => setValue(field.key, e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder={field.placeholder}
            />
          )}

          {field.type === "textarea" && (
            <textarea
              value={answers[field.key] || ""}
              onChange={(e) => setValue(field.key, e.target.value)}
              className="min-h-[110px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder={field.placeholder}
            />
          )}

          {field.type === "number" && (
            <input
              type="number"
              min={field.min ?? 1}
              max={field.max ?? 5}
              value={answers[field.key] || ""}
              onChange={(e) => setValue(field.key, Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          )}

          {field.type === "rating" && (
            <Stars value={Number(answers[field.key] || 0)} onChange={(value) => setValue(field.key, value)} />
          )}

          {field.type === "slider" && (
            <div className="space-y-2">
              <input
                type="range"
                min={field.min ?? 1}
                max={field.max ?? 5}
                value={Number(answers[field.key] || field.min || 1)}
                onChange={(e) => setValue(field.key, Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-slate-600 dark:text-slate-300">Value: {answers[field.key] ?? field.min ?? 1}</p>
            </div>
          )}

          {field.type === "select" && (
            <select
              value={answers[field.key] || ""}
              onChange={(e) => setValue(field.key, e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="">Select</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {field.type === "radio" && (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={field.key}
                    checked={answers[field.key] === option}
                    onChange={() => setValue(field.key, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {field.type === "checkbox" && (
            <div className="space-y-2">
              {field.options?.map((option) => {
                const list = answers[field.key] || [];
                const checked = list.includes(option);

                return (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked ? list.filter((v) => v !== option) : [...list, option];
                        setValue(field.key, next);
                      }}
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Feedback"}
      </button>

      {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}
      {success ? <p className="text-sm font-semibold text-emerald-600">{success}</p> : null}
    </form>
  );
}
