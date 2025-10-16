import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GeneratorState {
  keywords: string;
  audience: string;
  icp: string;
  brandStatement: string;
  length: 'standard' | 'pillar' | '';
  internalLinks: string[];
  intent: 'informational' | 'transactional' | '';
  setKeywords: (value: string) => void;
  setAudience: (value: string) => void;
  setIcp: (value: string) => void;
  setBrandStatement: (value: string) => void;
  setLength: (value: 'standard' | 'pillar' | '') => void;
  setInternalLinks: (links: string[]) => void;
  setIntent: (value: 'informational' | 'transactional' | '') => void;
  reset: () => void;
}

export const useGeneratorStore = create<GeneratorState>()(
  persist(
    (set) => ({
      keywords: '',
      audience: '',
      icp: '',
      brandStatement: '',
      length: '',
      internalLinks: ['', '', '', '', ''],
      intent: '',
      setKeywords: (value) => set({ keywords: value }),
      setAudience: (value) => set({ audience: value }),
      setIcp: (value) => set({ icp: value }),
      setBrandStatement: (value) => set({ brandStatement: value }),
      setLength: (value) => set({ length: value }),
      setInternalLinks: (links) => set({ internalLinks: links }),
      setIntent: (value) => set({ intent: value }),
      reset: () =>
        set({
          keywords: '',
          audience: '',
          icp: '',
          brandStatement: '',
          length: '',
          internalLinks: ['', '', '', '', ''],
          intent: '',
        }),
    }),
    { name: 'generator-storage' } // persisted in localStorage
  )
);
