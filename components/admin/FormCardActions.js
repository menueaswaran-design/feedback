"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormCardActions({ id, isPublished }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const togglePublish = async () => {
    setLoading(true);
    await fetch(`/api/forms/${id}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !isPublished }),
    });
    setLoading(false);
    router.refresh();
  };

  const remove = async () => {
    const ok = window.confirm("Delete this form?");
    if (!ok) return;

    setLoading(true);
    await fetch(`/api/forms/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  const copyLink = async () => {
    const link = `${window.location.origin}/form/${id}`;
    await navigator.clipboard.writeText(link);
    alert("Share link copied");
  };

  return (
    <>
      <button
        type="button"
        onClick={togglePublish}
        disabled={loading}
        className="rounded-full border px-3 py-1.5"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </button>
      <button type="button" onClick={copyLink} className="rounded-full border px-3 py-1.5">
        Share Link
      </button>
      <button
        type="button"
        onClick={remove}
        disabled={loading}
        className="rounded-full bg-rose-600 px-3 py-1.5 text-white"
      >
        Delete
      </button>
    </>
  );
}
