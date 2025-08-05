// src/components/QuickLinks.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const ICON_SIZE = 40;

// Use the exact hyphenated filenames in public/icons/
const items = [
  { id: 'articles',  label: 'Articles',        href: '/dashboard/articles',  src: '/icons/quill.svg'        },
  { id: 'emails',    label: 'Email Updates',   href: '/dashboard/emails',    src: '/icons/email-icon.svg'    },
  { id: 'linkedin',  label: 'LinkedIn Updates',href: '/dashboard/linkedin', src: '/icons/LinkedIn-icon.svg' },
  { id: 'twitter',   label: 'Twitter Updates', href: '/dashboard/twitter',   src: '/icons/Twitter-icon.svg'  },
  { id: 'dashboard', label: 'Dashboard',       href: '/dashboard',           src: '/icons/link-icon.svg'     },
];

const variants = {
  collapsed: { width: ICON_SIZE },
  expanded:  { width: 140 },
};
const labelVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1 } },
};

export default function QuickLinks({ inline = false }: { inline?: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav
      aria-label="Quick Links"
      className={`${inline ? '' : 'fixed left-[20px] top-[100px] z-50'} flex flex-col space-y-2 overflow-visible`}
    >
      <div className="px-2 mb-4 text-[14px] font-semibold text-gray-700 dark:text-gray-200">
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
            className="relative overflow-visible z-20 rounded-r-[10px] bg-white/80 dark:bg-gray-800/80 border border-[#f66630]"
          >
            <Link href={href} aria-label={label} className="flex items-center h-[40px] px-2">
              <img
                src={src}
                alt={label}
                aria-hidden="true"
                className="w-[24px] h-[24px]"
              />
              <AnimatePresence>
                {isHover && (
                  <motion.span
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={labelVariants}
                    className="ml-3 text-[14px] font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap"
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
