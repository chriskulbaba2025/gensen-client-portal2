"use client";

import React from "react";

interface SpokeRecord {
  id: string;
  title: string;
  keywords: string;
  description: string;
  intent: string;
  status: string;
}

interface Group {
  intent: string;
  color: string;
  records: SpokeRecord[];
}

export default function SpokeClient({ grouped }: { grouped: Group[] }) {
  return (
    <div className="flex flex-col gap-[40px]">

      {grouped.map((group) => {
        if (!group.records || group.records.length === 0) return null;

        return (
          <section key={group.intent}>
            {/* SECTION HEADER */}
            <h2
              className="text-[26px] font-bold mb-[20px]"
              style={{ color: group.color }}
            >
              {group.intent} Articles
            </h2>

            {/* GRID OF CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
              {group.records.map((r) => (
                <article
                  key={r.id}
                  className="bg-white border border-[#e0e6ef] rounded-xl p-[24px] shadow-sm"
                >
                  {/* TITLE */}
                  <h3 className="text-[22px] font-bold text-[#10284a] mb-[6px]">
                    {r.title}
                  </h3>

                  {/* KEYWORDS */}
                  <p className="italic text-[15px] text-gray-600 mb-[12px]">
                    {r.keywords}
                  </p>

                  {/* DESCRIPTION */}
                  <p className="text-[16px] text-[#0b1320] leading-[26px] mb-[14px]">
                    {r.description}
                  </p>

                  {/* INTENT PILL */}
                  <span
                    className="inline-block px-[12px] py-[4px] text-white text-[14px] rounded-full mb-[14px]"
                    style={{ backgroundColor: group.color }}
                  >
                    {group.intent}
                  </span>

                  {/* PUBLISH BUTTON */}
                  <button
                    className="w-full bg-[#f8fafc] border border-[#d9e1ef] rounded-md py-[10px] text-[16px] text-[#0b1320] hover:bg-[#e8eef8] transition"
                  >
                    Publish
                  </button>

                  {/* STATUS */}
                  <p className="text-[14px] text-gray-700 mt-[14px]">
                    Status: {r.status}
                  </p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
