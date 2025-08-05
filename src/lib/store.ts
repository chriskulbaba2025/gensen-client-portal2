// src/lib/store.ts
import { create } from 'zustand'

interface GeneratorState {
  keywords: string
  audience: string
  length: 'standard' | 'pillar' | ''
  internalLinks: string[]
  intent: 'informational' | 'transactional' | ''
  setKeywords: (value: string) => void
  setAudience: (value: string) => void
  setLength: (value: 'standard' | 'pillar' | '') => void
  setInternalLinks: (links: string[]) => void
  setIntent: (value: 'informational' | 'transactional' | '') => void
  reset: () => void
}

export const useGeneratorStore = create<GeneratorState>((set) => ({
  keywords: '',
  audience: '',
  length: '',
  internalLinks: ['', '', '', '', ''],
  intent: '',
  setKeywords: (value) => set({ keywords: value }),
  setAudience: (value) => set({ audience: value }),
  setLength: (value) => set({ length: value }),
  setInternalLinks: (links) => set({ internalLinks: links }),
  setIntent: (value) => set({ intent: value }),
  reset: () =>
    set({
      keywords: '',
      audience: '',
      length: '',
      internalLinks: ['', '', '', '', ''],
      intent: '',
    }),
}))
