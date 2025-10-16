'use client';

import { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="bg-[#ffffff] text-[#000000] border border-[#000000] px-[12px] py-[6px] rounded-[6px] hover:bg-[#f2f2f2] transition-all flex items-center space-x-[8px]"
      style={{ color: '#000000' }}
    >
      <span>{isDark ? '🌞' : '🌙'}</span>
      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
}
