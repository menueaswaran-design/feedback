"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import FieldEditor from "./FieldEditor";
import { useBuilderStore } from "@/stores/builderStore";

export default function FormBuilder({ form }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    title,
    description,
    fields,
    setMeta,
    loadForm,
    addField,
    removeField,
    updateField,
    moveField,
    reset,
  } = useBuilderStore();

  useEffect(() => {
    if (form) loadForm(form);
    else reset();
  }, [form, loadForm, reset]);

  const canSave = useMemo(() => title.trim() && fields.length > 0, [title, fields.length]);

  const save = async () => {
    setError("");

    if (!canSave) {
      setError("Add title and at least one field.");
      return;
    }

    if (fields.some((f) => !f.label.trim())) {
      setError("Every field needs a label.");
      return;
    }

    setSaving(true);
    const payload = { title, description, fields };
    const endpoint = form ? `/api/forms/${form._id}` : "/api/forms";
    const method = form ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
          {form ? "Edit Feedback Form" : "Create Feedback Form"}
        </h2>

        <div className="grid gap-4">
          <label className="space-y-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Form Title
            <input
              value={title}
              onChange={(e) => setMeta("title", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Course Feedback - CSE 202"
            />
          </label>

          <label className="space-y-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Description
            <textarea
              value={description}
              onChange={(e) => setMeta("description", e.target.value)}
              className="min-h-[90px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Share your learning experience for this semester."
            />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <FieldEditor
            key={field.key || index}
            field={field}
            index={index}
            onChange={updateField}
            onRemove={removeField}
            onMove={moveField}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addField}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
        >
          Add Field
        </button>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Form"}
        </button>
      </div>

      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}
