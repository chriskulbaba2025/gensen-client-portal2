'use client';

import { useState, useEffect } from 'react';
import DashboardTile from '@/components/DashboardTile';

interface Tile {
  title: string;
  imageUrl: string;
  href: string;
  description: string;
}

// All icons are stored locally in /public/icons
const base = '/icons';

const tiles: Tile[] = [
  {
    title: 'Topical Map',
    imageUrl: `${base}/topical_maps.webp`,
    href: '/dashboard/topical-map',
    description:
      'Topical maps show Google your expertise and guide visitors deeper into content.',
  },
  {
    title: 'Articles',
    imageUrl: `${base}/articles.webp`,
    href: '/dashboard/articles',
    description:
      'Keyword-rich content builds authority and fuels search visibility.',
  },
  {
    title: 'Emails',
    imageUrl: `${base}/email.webp`,
    href: '/dashboard/emails',
    description: 'Nurture leads and customers with conversion-ready sequences.',
  },
  {
    title: 'Facebook',
    imageUrl: `${base}/facebook.webp`,
    href: '/dashboard/facebook',
    description: 'Social posts optimised for reach and engagement.',
  },
  {
    title: 'GBP',
    imageUrl: `${base}/gbp.webp`,
    href: '/dashboard/gbp',
    description: 'Keep your Google Business Profile fresh and ranking.',
  },
  {
    title: 'Instagram',
    imageUrl: `${base}/instagram.webp`,
    href: '/dashboard/instagram',
    description: 'Hook scrollers with on-brand captions and visuals.',
  },
  {
    title: 'LinkedIn',
    imageUrl: `${base}/linkedin.webp`,
    href: '/dashboard/linkedin',
    description: 'Thought-leadership posts that spark conversation and leads.',
  },
  {
    title: 'Quora',
    imageUrl: `${base}/quora.webp`,
    href: '/dashboard/quora',
    description:
      'Authority-building answers that funnel traffic back to your site.',
  },
  {
    title: 'Twitter / X',
    imageUrl: `${base}/twitter.webp`,
    href: '/dashboard/twitter',
    description: 'Fast, punchy threads tailor-made for virality.',
  },
  {
    title: 'Video Scripts',
    imageUrl: `${base}/youtube.webp`,
    href: '/dashboard/videoscripts',
    description: 'Ready-to-shoot scripts for YouTube, Reels, and TikTok.',
  },
  {
    title: 'Agents',
    imageUrl: `${base}/agents.webp`,
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
