'use client';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function BrandVoicePage() {
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVoice() {
      try {
        const res = await fetch('/api/brand-voice');
        const data = await res.json();
        setReportUrl(data?.reportUrl || null);
      } catch (e) {
        console.error('Error fetching brand voice', e);
      } finally {
        setLoading(false);
      }
    }
    fetchVoice();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!reportUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-[20px] bg-[#f5f8ff]">
        <h1 className="text-[28px] text-[#10284a] mb-[12px] font-semibold">
          Brand Voice Report
        </h1>

        <div className="max-w-[750px] bg-white shadow-soft rounded-[15px] px-[32px] py-[40px] border border-[#e0e6f5] leading-relaxed text-[17px] text-[#0b1320]">
          <h1 className="text-[32px] font-semibold text-[#002c71] mb-[20px] text-center">
            Your Brand Voice Is in Progress
          </h1>

          <section className="space-y-[14px] text-left">
            <div>
              <h2 className="text-[18px] font-semibold text-[#10284a] mb-[6px]">
                Who you are
              </h2>
              <p>
                Every brand already speaks. The rhythm and vocabulary you use have
                been telling your story since the first post and the first client
                email. GENSEN is not inventing a voice. It is revealing the one that
                has always been there. It listens between the lines, translates
                personality into pattern, and prepares a language system that feels
                natural like conversation yet distinct like your logo.
              </p>
            </div>

            <div>
              <h2 className="text-[18px] font-semibold text-[#10284a] mb-[6px]">
                What is happening
              </h2>
              <p>
                GENSEN is analyzing your written world right now. It studies
                statements and captions, replies and reviews, long form and short
                form. It measures warmth that invites, authority that convinces,
                energy that sustains. Sentence by sentence it maps how your brand
                breathes. From words and phrases to rhythm and structure, it is
                forming a unified voice architecture that scales from ad copy to case
                study, from headline to help desk.
              </p>
              <ul className="list-disc pl-[20px] mt-[10px]">
                <li>Clarity and character</li>
                <li>Precision and personality</li>
                <li>Consistency and flexibility</li>
              </ul>
            </div>

            <div>
              <h2 className="text-[18px] font-semibold text-[#10284a] mb-[6px]">
                Where it is going
              </h2>
              <p>
                Your report will appear here complete and interactive. You will see
                tone anchors, phrasing guides, and applied examples. You will trace
                how identity carries across channels and topics. It is a mirror and a
                roadmap in one place.
              </p>
            </div>

            <div>
              <h2 className="text-[18px] font-semibold text-[#10284a] mb-[6px]">
                When to expect it
              </h2>
              <p>
                Most reports finalize in a few minutes. When ready this space updates
                automatically with your Brand Voice Report. A link also appears in
                your dashboard for quick return.
              </p>
            </div>

            <div>
              <h2 className="text-[18px] font-semibold text-[#10284a] mb-[6px]">
                Why it matters
              </h2>
              <p>
                A defined voice separates signal from noise and turns scrolls into
                stops. It helps teams write faster with fewer edits. It builds
                recognition and trust that compounds. Speak to many or to one. Plan
                for today or for tomorrow. Your sound stays unmistakably yours.
              </p>
            </div>

            <p className="text-[#002c71] font-medium text-center mt-[10px]">
              Your next conversation with your audience begins here.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={reportUrl}
      className="w-full h-[100vh] border-0"
      title="Brand Voice Report"
    />
  );
}
