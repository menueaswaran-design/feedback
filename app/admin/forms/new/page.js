import Link from "next/link";
import FormBuilder from "@/components/admin/FormBuilder";

export default function NewFormPage() {
  return (
    <div className="space-y-4">
      <Link href="/admin" className="text-sm font-semibold text-slate-600 hover:underline dark:text-slate-300">
        ← Back to Dashboard
      </Link>
      <FormBuilder />
    </div>
  );
}
