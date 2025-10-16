'use client';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';

export default function AgentsPage() {
  return (
    <PageLayout>
      {/* Header */}
      <h1 className="text-[30px] font-bold text-center mb-[20px] text-[#111111] dark:text-[#f5f5f5]">
        AI Agents Overview
      </h1>

      {/* Introduction */}
      <section className="mb-[30px]">
        <h2 className="text-[24px] font-semibold mb-[12px]">What Are AI Agents?</h2>
        <p className="text-[16px] text-[#333333] dark:text-[#cccccc]">
          AI agents are autonomous software entities that perceive their environment,
          make decisions, and take actions to accomplish specific tasks—ranging from
          content generation and customer support to data analysis and workflow automation.
        </p>
      </section>

      {/* Why They Matter */}
      <section className="mb-[30px]">
        <h2 className="text-[24px] font-semibold mb-[12px]">Why AI Agents Matter</h2>
        <ul className="list-disc pl-[20px] text-[16px] text-[#333333] dark:text-[#cccccc]">
          <li>
            <strong>Scalability:</strong> Agents run 24/7, handling repetitive tasks
            without human intervention.
          </li>
          <li>
            <strong>Consistency:</strong> They follow predefined rules and learn
            best practices, delivering uniform outputs every time.
          </li>
          <li>
            <strong>Efficiency:</strong> Automating complex workflows frees teams to
            focus on strategy and creativity.
          </li>
        </ul>
      </section>

      {/* Who Benefits */}
      <section className="mb-[30px]">
        <h2 className="text-[24px] font-semibold mb-[12px]">Who Benefits from AI Agents?</h2>
        <p className="text-[16px] text-[#333333] dark:text-[#cccccc]">
          Small businesses, marketing teams, content creators, and enterprises can all
          leverage AI agents to streamline operations, reduce costs, and accelerate
          time‑to‑market for campaigns and products.
        </p>
      </section>

      {/* Impact on Business */}
      <section className="mb-[30px]">
        <h2 className="text-[24px] font-semibold mb-[12px]">Business Impact</h2>
        <ul className="list-disc pl-[20px] text-[16px] text-[#333333] dark:text-[#cccccc]">
          <li>
            <strong>Faster Turnaround:</strong> Agents can generate drafts, respond to
            inquiries, and optimize content in seconds.
          </li>
          <li>
            <strong>Cost Savings:</strong> Reduce manual labor and eliminate
            repetitive tasks.
          </li>
          <li>
            <strong>Data‑Driven Decisions:</strong> Agents can analyze metrics in real
            time and adjust strategies automatically.
          </li>
        </ul>
      </section>

      {/* Our Custom Agents */}
      <section className="mb-[40px]">
        <h2 className="text-[24px] font-semibold mb-[12px]">Custom AI Agents in Development</h2>
        <p className="text-[16px] text-[#333333] dark:text-[#cccccc]">
          We are currently designing a suite of custom AI agents tailored to each client’s
          needs—whether it’s content calendar management, social media posting,
          or lead nurturing. Soon, you’ll be able to deploy these agents directly within
          your dashboard to automate your most critical workflows.
        </p>
      </section>

      {/* Back to Dashboard */}
      <div className="flex justify-center">
        <Link
          href="/dashboard"
          className="inline-block bg-[#f66630] text-[#ffffff] rounded-[6px] px-[20px] py-[8px] text-[16px] hover:bg-[#e0552b] transition"
        >
          Back to GENSEN Dashboard
        </Link>
      </div>
    </PageLayout>
  );
}
