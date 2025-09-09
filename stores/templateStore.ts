import { create } from 'zustand';

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

export type Template = {
  id: string;
  name: string;
  exercises: Exercise[];
  createdAt: number;
};

type TemplateStore = {
  templates: Template[];
  addTemplate: (template: Omit<Template, 'id' | 'createdAt'>) => void;
  removeTemplate: (id: string) => void;
  updateTemplate: (id: string, updates: Partial<Omit<Template, 'id' | 'createdAt'>>) => void;
};

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [],
  
  addTemplate: (template) => set((state) => ({
    templates: [
      ...state.templates,
      {
        ...template,
        id: Date.now().toString(),
        createdAt: Date.now(),
      },
    ],
  })),
  
  removeTemplate: (id) => set((state) => ({
    templates: state.templates.filter((template) => template.id !== id),
  })),
  
  updateTemplate: (id, updates) => set((state) => ({
    templates: state.templates.map((template) =>
      template.id === id
        ? { ...template, ...updates }
        : template
    ),
  })),
})); 