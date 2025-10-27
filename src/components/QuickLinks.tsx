// src/components/QuickLinks.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const ICON_SIZE = 48;

const items = [
  {
    id: 'articles',
    label: 'Articles',
    href: '/dashboard/articles',
    src: 'https://omnipressence.com/wp-content/uploads/2025/10/clear_articles.png',
  },
  {
    id: 'emails',
    label: 'Email',
    href: '/dashboard/emails',
    src: 'https://omnipressence.com/wp-content/uploads/2025/10/clear_Email.png',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: '/dashboard/linkedin',
    src: 'https://omnipressence.com/wp-content/uploads/2025/10/clear_linkedin.png',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: '/dashboard/facebook',
    src: 'https://omnipressence.com/wp-content/uploads/2025/10/clear_fb.png',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    src: 'https://omnipressence.com/wp-content/uploads/2025/10/clear_dashboard.png',
  },
];

const variants = {
  collapsed: { width: ICON_SIZE },
  expanded: { width: 180 },
};

const labelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1 } },
};

export default function QuickLinks({ inline = false }: { inline?: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav
      aria-label="Quick Links"
      className={`${
        inline ? '' : 'fixed left-[20px] top-[100px] z-50'
      } flex flex-col space-y-3 overflow-visible`}
    >
      <div className="px-2 mb-4 text-[15px] font-semibold text-[#10284a] dark:text-[#dbe9ff]">
        Quick Links
      </div>

      {items.map(({ id, label, href, src }) => {
        const isHover = hovered === id;
        return (
          <motion.div
            key={id}
            initial="collapsed"
            animate={isHover ? 'expanded' : 'collapsed'}
            variants={variants}
            onHoverStart={() => setHovered(id)}
            onHoverEnd={() => setHovered(null)}
            onFocus={() => setHovered(id)}
            onBlur={() => setHovered(null)}
            className="relative overflow-visible z-20 rounded-[15px] bg-white/90 dark:bg-[#0f172a]/80 border border-[#076aff] hover:shadow-[0_0_12px_rgba(7,106,255,0.6)] transition-all duration-200"
          >
            <Link
              href={href}
              aria-label={label}
              className="flex items-center h-[48px] px-3"
            >
              <img
                src={src}
                alt={label}
                aria-hidden="true"
                className="w-[28px] h-[28px] rounded-[8px] object-contain"
              />
              <AnimatePresence>
                {isHover && (
                  <motion.span
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={labelVariants}
                    className="ml-[15px] text-[15px] font-medium text-[#10284a] dark:text-[#f5f5f5] whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
