'use client';

import Image from 'next/image';

export default function BrandVoiceTile() {
  return (
    <button
      onClick={() =>
        (window.location.href = 'https://gensen-v2-voice.vercel.app/')
      }
      className="group flex flex-col items-center p-[25px] bg-white border border-[#0aa2fb] rounded-[15px] hover:bg-[#0aa2fb] hover:text-white hover:shadow-[0_0_15px_rgba(10,162,251,0.6)] transition-all"
    >
      <Image
        src="https://omnipressence.com/wp-content/uploads/2025/10/voice_main.png"
        alt="Brand Voice Icon"
        width={150}
        height={150}
        className="rounded-[15px] mb-[20px] object-contain"
      />
      <h3 className="font-semibold mb-[10px] group-hover:text-white text-center">
        Brand Voice
      </h3>
      <p className="text-center leading-snug group-hover:text-white">
        Capture and define your unique brand tone.
      </p>
    </button>
  );
}
