import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'FR' | 'EN';

interface LanguageState {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: 'FR',
      setLang: (lang) => set({ lang }),
      toggleLang: () => set((state) => ({ lang: state.lang === 'FR' ? 'EN' : 'FR' })),
    }),
    { name: 'language-storage' }
  )
);
