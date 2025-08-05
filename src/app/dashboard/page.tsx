'use client';

import { useState, useEffect } from 'react';
import DashboardTile from '@/components/DashboardTile';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Tile {
  title: string;
  imageUrl: string;
  href: string;
  description: string;
}

const tiles: Tile[] = [
  {
    title: 'Topical Map',
    imageUrl:
      'https://responsegenerators.ca/wp-content/uploads/2025/07/topical-map-icon.png',
    href: '/dashboard/topical-map',
    description:
      'Topical maps show Google your expertise and guide visitors deeper into content.',
  },
  {
    title: 'Articles',
    imageUrl:
      'https://responsegenerators.ca/wp-content/uploads/2025/07/quill.png',
    href: '/dashboard/articles',
    description:
      'Keyword-rich content is the rent you pay for SEO—each article builds authority.',
  },
  {
    title: 'Emails',
    imageUrl:
      'https://responsegenerators.ca/wp-content/uploads/2025/07/email-icon.png',
    href: '/dashboard/emails',
    description: 'Nurture leads and customers with conversion-ready sequences.',
  },
  {
    title: 'Facebook',
    imageUrl:
      'https://responsegenerators.ca/wp-content/uploads/2025/07/facebook-icon.png',
    href: '/dashboard/facebook',
    description: 'Social posts optimised for reach and engagement.',
  },
  {
    title: 'GBP',
    imageUrl:
      'https://responsegenerators.ca/wp-content/uploads/2025/07/map-icon.png',
    href: '/dashboard/gbp',
    description: 'Keep your Google Business Profile fresh and ranking.',
  },
  {
    title: 'Images',
    imageUrl:
      'https://responsegenerators.ca/wp-content/uploads/2025/07/images-icon.png',
    href: '/dashboard/images',
    description: 'AI-generated visuals sized perfectly for every channel.',
  },
  {
    title: 'Instagram',
    imageUrl:
      'https://responsegenerators.ca/wp-content/uploads/2025/07/instagram-image.png',
    href: '/dashboard/instagram',
    description: 'Hook scrollers with on-brand captions and creatives.',
  },
  {
    title: 'LinkedIn',
    imageUrl:
      'https://responsegenerators.ca/wp-content/uploads/2025/07/LinkedIn-icon.png',
    href: '/dashboard/linkedin',
    description:
      'Thought-leadership posts that spark conversation and leads.',
  },
  {
    title: 'Quora',
    imageUrl:
      'https://responsegenerators.ca/wp-content/uploads/2025/07/quora-icon.png',
    href: '/dashboard/quora',
    description:
      'Authority-building answers that funnel traffic back to your site.',
  },
  {
    title: 'Twitter / X',
    imageUrl:
      'https://responsegenerators.ca/wp-content/uploads/2025/07/Twitter-icon.png',
    href: '/dashboard/twitter',
    description: 'Fast, punchy threads tailor-made for virality.',
  },
  {
    title: 'Video Scripts',
    imageUrl:
      'https://responsegenerators.ca/wp-content/uploads/2025/07/video-icon.png',
    href: '/dashboard/videoscripts',
    description: 'Ready-to-shoot scripts for YouTube, Reels, and TikTok.',
  },
  {
    title: 'Agents',
    imageUrl:
      'https://responsegenerators.ca/wp-content/uploads/2025/07/agents-icon.png',
    href: '/dashboard/agents',
    description: 'Automate tasks with custom AI agents tuned to workflow.',
  },
];

export default function DashboardPage() {
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const loadProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, 'profiles', uid));
      if (snap.exists()) {
        setName((snap.data() as { name?: string }).name ?? '');
      }
    };
    loadProfile();
  }, []);

  return (
    <main className="max-w-[1240px] mx-auto px-[16px] py-[24px]">
      <h2 className="text-[20px] font-medium mb-[16px] text-center">
        {name ? `Welcome back, ${name}!` : 'Welcome back!'}
      </h2>

      <h1 className="text-[24px] font-bold mb-[40px] text-center">
        GENSEN Operations Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-x-[24px] gap-y-[60px] justify-items-center">
        {tiles.map((tile) => (
          <div key={tile.title} className="w-[285px]">
            <DashboardTile {...tile} />
          </div>
        ))}
      </div>
    </main>
  );
}
