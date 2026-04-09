"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full border border-slate-300/80 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
    >
      {isDark ? "Dark" : "Light"} mode
    </button>
  );
}
