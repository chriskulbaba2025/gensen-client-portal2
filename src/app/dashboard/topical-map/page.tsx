'use client';
import PageLayout from '@/components/PageLayout';

export default function TopicalMapPage() {
  return (
    <PageLayout>
      {/* Header */}
      <h1 className="text-[30px] font-bold text-center mb-[20px] text-[#111111] dark:text-[#f5f5f5]">
        Topical Maps & Hub‑and‑Spoke Model
      </h1>

      {/* Introduction */}
      <section className="mb-[30px]">
        <h2 className="text-[24px] font-semibold mb-[12px]">What Is a Topical Map?</h2>
        <p className="text-[16px] text-[#333333] dark:text-[#cccccc]">
          A topical map is a strategic blueprint that organizes your site’s content
          into clearly defined topics and subtopics. It visually lays out a central
          theme—known as the “pillar”—surrounded by supporting articles that dive
          deeper into related sub‑areas. By grouping content in clusters, you create
          a roadmap that guides both users and search engines through your expertise.
        </p>
      </section>

      {/* Why They Matter */}
      <section className="mb-[30px]">
        <h2 className="text-[24px] font-semibold mb-[12px]">Why Topical Maps Matter</h2>
        <ul className="list-disc pl-[20px] text-[16px] text-[#333333] dark:text-[#cccccc]">
          <li>
            <strong>Improved SEO Relevance:</strong> Interlinked clusters signal to
            search engines that your site covers each topic in depth.
          </li>
          <li>
            <strong>Enhanced User Experience:</strong> Visitors navigate naturally
            from high‑level overviews to detailed answers without getting lost.
          </li>
          <li>
            <strong>Authority Building:</strong> A clear topical structure positions
            you as an expert, boosting trust and engagement.
          </li>
        </ul>
      </section>

      {/* Hub‑and‑Spoke Model */}
      <section className="mb-[30px]">
        <h2 className="text-[24px] font-semibold mb-[12px]">The Hub‑and‑Spoke Model</h2>
        <p className="text-[16px] text-[#333333] dark:text-[#cccccc] mb-[12px]">
          In the hub‑and‑spoke model, a “hub” page serves as the central pillar,
          linking out to “spoke” pages that each explore a specific subtopic in depth.
        </p>
        <ul className="list-disc pl-[20px] text-[16px] text-[#333333] dark:text-[#cccccc]">
          <li>
            <strong>Hub (Pillar):</strong> A comprehensive overview of the main topic,
            acting as the anchor for all related content.
          </li>
          <li>
            <strong>Spokes (Clusters):</strong> Individual pages that dive into
            subtopics, each linking back to the hub and, where relevant, to each other.
          </li>
        </ul>
      </section>

      {/* Next Steps */}
      <section className="mb-[40px]">
        <h2 className="text-[24px] font-semibold mb-[12px]">Next Steps</h2>
        <p className="text-[16px] text-[#333333] dark:text-[#cccccc]">
          • Replace this placeholder with your refined definitions and examples from
          your Notion document.<br/>
          • Build your pillar (hub) page and then create individual spoke pages.<br/>
          • Use clear internal linking to reinforce topic authority and guide readers.
        </p>
      </section>
    </PageLayout>
  );
}
