'use client';
import DashboardTile from '@/components/DashboardTile';

const tiles = [
  { title: 'Topical Map', imageUrl: 'https://responsegenerators.ca/wp-content/uploads/2025/07/topical-map-icon.png', href: '/topical-map', description: 'Topical maps show Google your expertise and guide visitors deeper into your content.' },
  { title: 'Articles', imageUrl: 'https://responsegenerators.ca/wp-content/uploads/2025/07/quill.png', href: '/articles', description: 'Keyword-rich content is the rent you pay for SEO—each article builds your authority and visibility.' },
  { title: 'LinkedIn Updates', imageUrl: 'https://responsegenerators.ca/wp-content/uploads/2025/07/LinkedIn-icon.png', href: '/linkedin', description: 'Engage professionals and drive authority with consistent, insightful LinkedIn posts.' },
  { title: 'Email Updates', imageUrl: 'https://responsegenerators.ca/wp-content/uploads/2025/07/email-icon.png', href: '/email', description: 'Email is your highest ROI channel—keep your leads warm and your list profitable.' },
  { title: 'Google Business Profile', imageUrl: 'https://responsegenerators.ca/wp-content/uploads/2025/07/map-icon.png', href: '/gmb', description: 'Post updates to show up in Maps, attract local searchers, and build real-world visibility.' },
  { title: 'Facebook Updates', imageUrl: 'https://responsegenerators.ca/wp-content/uploads/2025/07/facebook-icon.png', href: '/facebook', description: 'Choose your tone—professional, casual, or edgy—and build real community presence.' },
  { title: 'Video Scripts', imageUrl: 'https://responsegenerators.ca/wp-content/uploads/2025/07/video-icon.png', href: '/video', description: 'Video dominates SEO. Post daily, improve 1%, and you’ll earn attention at scale.' },
  { title: '"X" (Twitter) Updates', imageUrl: 'https://responsegenerators.ca/wp-content/uploads/2025/07/Twitter-icon.png', href: '/twitter', description: 'Twitter’s algorithm rewards rapid testing—what works here is primed to go viral.' },
  { title: 'Instagram Updates', imageUrl: 'https://responsegenerators.ca/wp-content/uploads/2025/07/instagram-image.png', href: '/instagram', description: 'Instagram keeps your brand sticky and versatile—ideal for visual-first engagement.' },
  { title: 'Quora Updates', imageUrl: 'https://responsegenerators.ca/wp-content/uploads/2025/07/quora-icon.png', href: '/quora', description: 'Answer questions, build authority, and own search results with long-tail intent.' },
  { title: 'Images', imageUrl: 'https://responsegenerators.ca/wp-content/uploads/2025/07/images-icon.png', href: '/images', description: 'Use geo-tagged photos or AI visuals to boost local SEO and trust with every post.' },
  { title: 'Agents', imageUrl: 'https://responsegenerators.ca/wp-content/uploads/2025/07/agents-icon.png', href: '/agents', description: 'Coming soon: Smart agents to handle posting, outreach, and automation in the background.' },
];

export default function DashboardPage() {
  return (
    <main className="max-w-[1240px] mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-10 text-center">GENSEN Operations Dashboard</h1>
      <div className="grid grid-cols-3 gap-x-6 [row-gap:60px] justify-center">
        {tiles.map((tile) => (
          <div key={tile.title} className="w-[285px]">
            <DashboardTile {...tile} />
          </div>
        ))}
      </div>
    </main>
  );
}
