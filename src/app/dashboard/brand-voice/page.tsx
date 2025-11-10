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
        console.log('Brand voice API response:', data);
        setReportUrl(typeof data?.reportUrl === 'string' ? data.reportUrl : null);
      } catch (e) {
        console.error('Error fetching brand voice', e);
      } finally {
        setLoading(false);
      }
    }
    fetchVoice();
  }, []);

  // ───────────────────────────────────────────────
  // Loading spinner
  // ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  // ───────────────────────────────────────────────
  // Placeholder copy until report exists
  // ───────────────────────────────────────────────
  if (!reportUrl || typeof reportUrl !== 'string') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-[20px] bg-[#f5f8ff]">
        <h1 className="text-[28px] text-[#10284a] mb-[12px] font-semibold">
          Brand Voice Report
        </h1>

        <div className="max-w-[750px] bg-white shadow-soft rounded-[15px] px-[32px] py-[40px] border border-[#e0e6f5] leading-relaxed text-[17px] text-[#0b1320]">
          <h1 className="text-[32px] font-semibold text-[#002c71] mb-[20px] text-center">
            Your Brand Voice Is the Core of Everything You Communicate
          </h1>

          <section className="space-y-[14px] text-left">
            <div>
              <p>
                Every brand is speaking right now, but only a few sound intentional.
                The words you choose, the rhythm of your sentences, and the tone you
                use define how people experience your business. Without a clear
                voice, messages drift from post to post and lose meaning. With a
                defined voice, every line aligns and every message builds recognition
                and trust.
              </p>
            </div>

            <div>
              <p>
                GENSEN helps you capture, clarify, and codify that voice. It studies
                how you communicate, how your audience responds, and what makes your
                message distinct. Then it builds a framework that ensures every
                caption, email, and campaign speaks in the same confident, authentic
                tone. Your Brand Voice becomes a shared language for your entire
                team.
              </p>
            </div>

            <div>
              <p>
                Defining your voice is not a task — it is the beginning of alignment
                and consistency that scales. Once you start your Brand Voice
                creation, GENSEN will generate a detailed report right here. The
                report includes tone anchors, phrasing guides, and real-world
                examples that turn your natural communication style into an
                actionable system.
              </p>
              <p>
                Imagine your team writing in harmony, your audience recognizing your
                tone instantly, and your brand sounding unified everywhere it speaks.
                That is what a defined voice creates — clarity, cohesion, and
                connection that lasts.
              </p>
            </div>

            <div>
              <p className="text-[#002c71] font-medium text-center mt-[20px]">
                A brand without a voice is noise. A brand with a voice is remembered.
              </p>
              <p className="text-[#0b1320] text-center mt-[10px]">
                Build your Brand Voice today and define how your story should sound
                before someone else defines it for you.
              </p>
            </div>
          </section>

          <div className="flex justify-center mt-[30px]">
            <a
              href="https://voice.omnipressence.com"
              className="bg-[#076aff] hover:bg-[#002c71] text-white font-medium px-[28px] py-[12px] rounded-[8px] transition-all"
            >
              Build Your Brand Voice Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────
  // Render report iframe when ready
  // ───────────────────────────────────────────────
  return (
    <iframe
      src={String(reportUrl)}
      className="w-full h-[100vh] border-0"
      title="Brand Voice Report"
    />
  );
}
