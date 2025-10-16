'use client';

import { useGeneratorStore } from '@/lib/store';
import clsx from 'clsx';

export default function IntentButtons() {
  const { intent, setIntent } = useGeneratorStore();

  return (
    <div className="flex justify-center gap-[12px] mt-[20px]">
      <button
        className={clsx(
          'px-[20px] py-[10px] rounded-[10px] border transition-transform duration-200 transform hover:scale-105',
          intent === 'informational'
            ? 'bg-[#f66630] text-white border-[#f66630]'
            : 'bg-[#f2f2f2] text-black border-[#f66630]'
        )}
        onClick={() => setIntent('informational')}
      >
        Informational
      </button>

      <button
        className={clsx(
          'px-[20px] py-[10px] rounded-[10px] border transition-transform duration-200 transform hover:scale-105',
          intent === 'transactional'
            ? 'bg-[#f66630] text-white border-[#f66630]'
            : 'bg-[#f2f2f2] text-black border-[#f66630]'
        )}
        onClick={() => setIntent('transactional')}
      >
        Transactional
      </button>
    </div>
  );
}
