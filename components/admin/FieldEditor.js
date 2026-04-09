"use client";

const FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "rating",
  "slider",
  "select",
  "radio",
  "checkbox",
];

export default function FieldEditor({ field, index, onChange, onRemove, onMove }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Field {index + 1}</h4>
        <div className="flex gap-2">
          <button type="button" onClick={() => onMove(index, "up")} className="rounded-md border px-2 py-1 text-xs">Up</button>
          <button type="button" onClick={() => onMove(index, "down")} className="rounded-md border px-2 py-1 text-xs">Down</button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="rounded-md bg-rose-600 px-2 py-1 text-xs text-white"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
          Label
          <input
            value={field.label}
            onChange={(e) => onChange(index, "label", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            placeholder="Enter field label"
          />
        </label>

        <label className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
          Type
          <select
            value={field.type}
            onChange={(e) => onChange(index, "type", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            {FIELD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300 sm:col-span-2">
          Placeholder
          <input
            value={field.placeholder || ""}
            onChange={(e) => onChange(index, "placeholder", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            placeholder="Placeholder"
          />
        </label>

        {["select", "radio", "checkbox"].includes(field.type) && (
          <label className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300 sm:col-span-2">
            Options (comma separated)
            <input
              value={(field.options || []).join(", ")}
              onChange={(e) =>
                onChange(
                  index,
                  "options",
                  e.target.value
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean)
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Excellent, Good, Needs Improvement"
            />
          </label>
        )}

        {["slider", "rating", "number"].includes(field.type) && (
          <>
            <label className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
              Min
              <input
                type="number"
                value={field.min ?? 1}
                onChange={(e) => onChange(index, "min", Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
            <label className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
              Max
              <input
                type="number"
                value={field.max ?? 5}
                onChange={(e) => onChange(index, "max", Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
          </>
        )}
      </div>

      <label className="mt-3 inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={!!field.required}
          onChange={(e) => onChange(index, "required", e.target.checked)}
        />
        Required field
      </label>
    </div>
  );
}
