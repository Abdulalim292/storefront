'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ScrollRevealedText({ children }: { children: string }) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const paragraph = paragraphRef.current;
    if (!paragraph) return;

    const words = children.split(' ');
    paragraph.innerHTML = words.map((word) => `<span class="reveal-word">${word}</span>`).join(' ');

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        paragraph.querySelectorAll('.reveal-word'),
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: paragraph,
            start: 'top 78%',
            end: 'bottom 45%',
            scrub: 0.7,
          },
        },
      );
    });

    return () => {
      media.revert();
      paragraph.textContent = children;
    };
  }, [children]);

  return <p ref={paragraphRef} className="mt-7 max-w-xl text-lg leading-8 text-white/65">{children}</p>;
}
