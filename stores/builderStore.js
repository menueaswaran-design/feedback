import { create } from "zustand";

const makeField = () => ({
  key: `field_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  label: "",
  type: "text",
  required: false,
  options: [],
  placeholder: "",
  min: 1,
  max: 5,
});

export const useBuilderStore = create((set) => ({
  title: "",
  description: "",
  fields: [],
  setMeta: (key, value) => set((s) => ({ ...s, [key]: value })),
  loadForm: (form) =>
    set({
      title: form?.title || "",
      description: form?.description || "",
      fields: form?.fields || [],
    }),
  addField: () => set((s) => ({ fields: [...s.fields, makeField()] })),
  removeField: (index) =>
    set((s) => ({ fields: s.fields.filter((_, i) => i !== index) })),
  updateField: (index, key, value) =>
    set((s) => ({
      fields: s.fields.map((f, i) => (i === index ? { ...f, [key]: value } : f)),
    })),
  moveField: (index, direction) =>
    set((s) => {
      const next = [...s.fields];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return s;
      [next[index], next[target]] = [next[target], next[index]];
      return { fields: next };
    }),
  reset: () => set({ title: "", description: "", fields: [] }),
}));
