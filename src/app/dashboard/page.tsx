'use client';

import { useState, useEffect } from 'react';
import DashboardTile from '@/components/DashboardTile';

interface Tile {
  title: string;
  imageUrl: string;
  href: string;
  description: string;
}

const tiles: Tile[] = [
  {
    title: 'Brand Voice',
    imageUrl: 'https://omnipressence.com/wp-content/uploads/2025/10/brand-voice-opp-map-icon.png',
    href: '/dashboard/brand-voice',
    description: 'Define your unique tone, language, and positioning for consistent messaging.',
  },
  {
    title: 'Topical Map',
    imageUrl: 'https://omnipressence.com/wp-content/uploads/2025/10/topical_maps.webp',
    href: '/dashboard/topical-map',
    description: 'Topical maps show Google your expertise and guide visitors deeper into content.',
  },
  {
    title: 'Articles',
    imageUrl: 'https://omnipressence.com/wp-content/uploads/2025/10/articles.webp',
    href: '/dashboard/articles',
    description: 'Keyword-rich content builds authority and fuels search visibility.',
  },
  {
    title: 'Emails',
    imageUrl: 'https://omnipressence.com/wp-content/uploads/2025/10/email.webp',
    href: '/dashboard/emails',
    description: 'Nurture leads and customers with conversion-ready sequences.',
  },
  {
    title: 'Facebook',
    imageUrl: 'https://omnipressence.com/wp-content/uploads/2025/10/facebook.webp',
    href: '/dashboard/facebook',
    description: 'Social posts optimised for reach and engagement.',
  },
  {
    title: 'GBP',
    imageUrl: 'https://omnipressence.com/wp-content/uploads/2025/10/gbp.webp',
    href: '/dashboard/gbp',
    description: 'Keep your Google Business Profile fresh and ranking.',
  },
  {
    title: 'Instagram',
    imageUrl: 'https://omnipressence.com/wp-content/uploads/2025/10/instagram.webp',
    href: '/dashboard/instagram',
    description: 'Hook scrollers with on-brand captions and visuals.',
  },
  {
    title: 'LinkedIn',
    imageUrl: 'https://omnipressence.com/wp-content/uploads/2025/10/linkedin.webp',
    href: '/dashboard/linkedin',
    description: 'Thought-leadership posts that spark conversation and leads.',
  },
  {
    title: 'Quora',
    imageUrl: 'https://omnipressence.com/wp-content/uploads/2025/10/quora.webp',
    href: '/dashboard/quora',
    description: 'Authority-building answers that funnel traffic back to your site.',
  },
  {
    title: 'Twitter / X',
    imageUrl: 'https://omnipressence.com/wp-content/uploads/2025/10/twitter.webp',
    href: '/dashboard/twitter',
    description: 'Fast, punchy threads tailor-made for virality.',
  },
  {
    title: 'YouTube Scripts',
    imageUrl: 'https://omnipressence.com/wp-content/uploads/2025/10/youtube.webp',
    href: '/dashboard/videoscripts',
    description: 'Ready-to-shoot scripts for YouTube, Reels, and TikTok.',
  },
  {
    title: 'Agents',
    imageUrl: 'https://omnipressence.com/wp-content/uploads/2025/10/agents.webp',
    href: '/dashboard/agents',
    description: 'Automate workflows with custom AI agents tuned to your process.',
  },
];

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserEmail(parsed.email || '');
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <main className="max-w-[1400px] mx-auto px-[16px] py-[24px]">
      <h2 className="text-[20px] font-medium mb-[16px] text-center text-[#10284a]">
        {userEmail ? `Welcome back, ${userEmail}!` : 'Welcome back!'}
      </h2>

      <h1 className="text-[28px] font-bold mb-[40px] text-center text-[#10284a]">
        GENSEN Operations Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-x-[30px] gap-y-[30px] justify-items-center">
        {tiles.map((tile) => (
          <div key={tile.title} className="w-[260px]">
            <DashboardTile {...tile} />
          </div>
        ))}
      </div>
    </main>
  );
}
