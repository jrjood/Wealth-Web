import { useLayoutEffect } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useGsapAnimations = (enabled = true) => {
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    const REVEAL_DELAY_MS = 100;

    let removeResizeListener: null | (() => void) = null;
    let removeLoadListener: null | (() => void) = null;
    let revealStartTimer: null | number = null;
    let revealStarted = false;

    const balanceHeroHeadingLines = (heading: HTMLElement) => {
      const lines = heading.querySelectorAll<HTMLElement>('.line');

      if (lines.length < 2) {
        return;
      }

      const firstLineContent =
        lines[0].querySelector<HTMLElement>('.line-content');
      const secondLineContent =
        lines[1].querySelector<HTMLElement>('.line-content');

      if (!firstLineContent || !secondLineContent) {
        return;
      }

      secondLineContent.style.fontSize = '1em';

      const firstLineWidth = firstLineContent.getBoundingClientRect().width;
      const secondLineWidth = secondLineContent.getBoundingClientRect().width;

      if (firstLineWidth <= 0 || secondLineWidth <= 0) {
        return;
      }

      const secondLineScale = Math.min(1, firstLineWidth / secondLineWidth);
      secondLineContent.style.fontSize = `${secondLineScale}em`;
    };

    const splitTextToWhite = (selector: string) => {
      const textElement = document.querySelector<HTMLElement>(selector);

      if (!textElement || textElement.dataset.scrollSplitReady === 'true') {
        return;
      }

      const rawText = textElement.textContent ?? '';

      if (!rawText.trim()) {
        return;
      }

      const textNodes: Text[] = [];
      const walker = document.createTreeWalker(
        textElement,
        NodeFilter.SHOW_TEXT,
      );

      let currentNode = walker.nextNode();
      while (currentNode) {
        textNodes.push(currentNode as Text);
        currentNode = walker.nextNode();
      }

      textNodes.forEach((textNode) => {
        const originalText = textNode.textContent ?? '';
        const normalizedText = originalText.replace(/\s+/g, ' ');

        if (!normalizedText.trim()) {
          return;
        }

        const parentElement = textNode.parentElement;
        const keepColor =
          parentElement?.closest('[data-keep-color="true"]') !== null;

        const fragment = document.createDocumentFragment();

        Array.from(normalizedText).forEach((character) => {
          const span = document.createElement('span');
          span.dataset.scrollSplitChar = 'true';
          if (keepColor) {
            span.dataset.keepColor = 'true';
          }
          span.textContent = character;
          fragment.appendChild(span);
        });

        textNode.replaceWith(fragment);
      });

      textElement.dataset.scrollSplitReady = 'true';

      const letters = textElement.querySelectorAll<HTMLElement>(
        'span[data-scroll-split-char="true"]',
      );

      gsap.to(letters, {
        color: (_index, target) =>
          (target as HTMLElement).dataset.keepColor === 'true'
            ? 'hsl(var(--brand-red-300))'
            : '#fff',
        scrollTrigger: {
          end: 'top 20%',
          scrub: 1.4,
          start: 'top bottom',
          trigger: textElement,
        },
        stagger: 0.28,
      });
    };

    const animateNav = () => {
      let lastScroll = 0;
      let navVisible = true;
      let scrollButtonVisible = true;

      ScrollTrigger.create({
        end: 'bottom top',
        onUpdate: (self) => {
          const currentScroll = self.scroll();

          if (currentScroll > lastScroll && navVisible) {
            gsap.to('#nav', {
              duration: 0.8,
              ease: 'power2.out',
              y: -50,
            });
            navVisible = false;
          } else if (currentScroll < lastScroll && !navVisible) {
            gsap.to('#nav', {
              duration: 0.8,
              ease: 'power2.out',
              y: 0,
            });
            navVisible = true;
          }

          if (currentScroll > lastScroll && scrollButtonVisible) {
            gsap.to('#scroll-btn', {
              duration: 0.8,
              ease: 'power2.out',
              y: 120,
            });
            scrollButtonVisible = false;
          } else if (currentScroll < lastScroll && !scrollButtonVisible) {
            gsap.to('#scroll-btn', {
              duration: 0.8,
              ease: 'power2.out',
              y: 0,
            });
            scrollButtonVisible = true;
          }

          lastScroll = currentScroll;
        },
        start: 'top top',
        trigger: '#page1',
      });
    };

    const initialAnimations = () => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;

      gsap.from('#scroll-btn', {
        duration: 1.2,
        ease: 'power1.out',
        y: 90,
      });

      gsap.fromTo(
        '.learn-more-btn-wrapper',
        {
          opacity: 0,
          y: 120,
        },
        {
          duration: 0.6,
          ease: 'power1.out',
          opacity: 1,
          y: 0,
        },
      );

      gsap.to('.learn-more-btn-wrapper', {
        delay: 0.62,
        duration: 0.8,
        ease: 'power1.out',
        x: isDesktop ? 170 : 76,
      });

      gsap.fromTo(
        '.hero-subtext',
        {
          opacity: 0,
          y: 6,
        },
        {
          delay: 0.67,
          duration: 1,
          ease: 'power2.out',
          opacity: 1,
          y: 0,
        },
      );
    };

    const animateHeroHeading = () => {
      const heading = document.querySelector<HTMLElement>('.animated-heading');

      if (!heading || heading.querySelector('.line')) {
        return;
      }

      const nodes = Array.from(heading.childNodes);
      const lines: string[] = [];
      let currentLine = '';

      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          currentLine += node.textContent ?? '';
        } else if (node.nodeName === 'BR') {
          lines.push(currentLine);
          currentLine = '';
        }
      });

      if (currentLine.trim()) {
        lines.push(currentLine);
      }

      const fragment = document.createDocumentFragment();

      lines.forEach((lineText) => {
        const lineSpan = document.createElement('span');
        lineSpan.classList.add('line');
        lineSpan.style.display = 'block';

        const lineContentSpan = document.createElement('span');
        lineContentSpan.classList.add('line-content');
        lineContentSpan.style.display = 'inline-block';

        lineText
          .trim()
          .split(' ')
          .forEach((word, wordIndex, words) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.whiteSpace = 'nowrap';

            Array.from(word).forEach((character) => {
              const letterSpan = document.createElement('span');
              letterSpan.classList.add('letter');
              letterSpan.textContent = character;
              wordSpan.appendChild(letterSpan);
            });

            lineContentSpan.appendChild(wordSpan);

            if (wordIndex < words.length - 1) {
              lineContentSpan.appendChild(document.createTextNode('\u00A0'));
            }
          });

        lineSpan.appendChild(lineContentSpan);

        fragment.appendChild(lineSpan);
      });

      heading.textContent = '';
      heading.appendChild(fragment);
      balanceHeroHeadingLines(heading);
      gsap.set(heading, { autoAlpha: 1 });

      gsap.set('.letter', {
        opacity: 1,
        rotate: 20,
        y: 100,
      });

      document
        .querySelectorAll<HTMLElement>('.line')
        .forEach((line, lineIndex) => {
          const letters = line.querySelectorAll('.letter');

          gsap.to(letters, {
            delay: lineIndex * 0.5,
            duration: 1.1,
            ease: 'power3.out',
            rotate: 0,
            stagger: {
              each: 0.07,
            },
            y: 0,
          });
        });
    };

    const animateHeadingClasses = () => {
      const animateElements = document.querySelectorAll<HTMLElement>(
        '.animateHeading_page9, .animateHeading_page11, .animateHeading_page12',
      );

      animateElements.forEach((element) => {
        gsap.from(element, {
          duration: 1.2,
          opacity: 0,
          scrollTrigger: {
            end: 'top 50%',
            start: 'top 90%',
            trigger: element,
          },
          y: 100,
        });
      });
    };

    const animateRoadmapWords = () => {
      const wordStage = document.querySelector<HTMLElement>(
        '.roadmap-word-stage',
      );
      const timeline = document.querySelector<HTMLElement>('.roadmap-timeline');
      const words = document.querySelectorAll('.roadmap-word');

      if (!wordStage || !timeline || words.length === 0) {
        return;
      }

      if (wordStage.offsetParent === null) {
        return;
      }

      ScrollTrigger.create({
        end: 'bottom bottom',
        pin: wordStage,
        pinSpacing: false,
        start: 'top top',
        trigger: timeline,
      });
    };

    const animateRoadmapTimeline = () => {
      const items = document.querySelectorAll<HTMLElement>('.roadmap-item');
      const words = document.querySelectorAll<HTMLElement>('.roadmap-word');

      if (items.length === 0) {
        return;
      }

      const setActiveRoadmapStep = (index: number) => {
        items.forEach((item, itemIndex) => {
          item.classList.toggle('active', itemIndex === index);
        });

        words.forEach((word, wordIndex) => {
          word.classList.toggle('active', wordIndex === index);
        });
      };

      items.forEach((item, index) => {
        const isLastItem = index === items.length - 1;

        ScrollTrigger.create({
          end: 'bottom center',
          onEnter: () => setActiveRoadmapStep(index),
          onEnterBack: () => setActiveRoadmapStep(index),
          onLeave: () => {
            if (isLastItem) {
              setActiveRoadmapStep(index);
            }
          },
          onLeaveBack: () => {
            if (index === 0) {
              setActiveRoadmapStep(index);
            }
          },
          start: isLastItem ? '25% center' : '55% center',
          trigger: item,
        });
      });

      setActiveRoadmapStep(0);
    };

    const startRevealAnimations = () => {
      if (revealStarted) {
        return;
      }

      revealStarted = true;
      animateHeroHeading();
      splitTextToWhite('#page2 > h1');
      splitTextToWhite('.about-closing-reveal');
      animateNav();
      initialAnimations();
      animateHeadingClasses();
      animateRoadmapWords();
      animateRoadmapTimeline();
    };

    const scheduleRevealStart = () => {
      if (revealStartTimer !== null) {
        window.clearTimeout(revealStartTimer);
      }

      revealStartTimer = window.setTimeout(() => {
        startRevealAnimations();
      }, REVEAL_DELAY_MS);
    };

    if (document.readyState === 'complete') {
      scheduleRevealStart();
    } else {
      const handleWindowLoad = () => {
        scheduleRevealStart();
      };

      window.addEventListener('load', handleWindowLoad, { once: true });
      removeLoadListener = () => {
        window.removeEventListener('load', handleWindowLoad);
      };
    }

    const handleResize = () => {
      const heading = document.querySelector<HTMLElement>('.animated-heading');

      if (!heading || !heading.querySelector('.line')) {
        return;
      }

      balanceHeroHeadingLines(heading);
    };

    window.addEventListener('resize', handleResize);
    removeResizeListener = () => {
      window.removeEventListener('resize', handleResize);
    };

    return () => {
      if (revealStartTimer !== null) {
        window.clearTimeout(revealStartTimer);
      }

      removeLoadListener?.();
      removeResizeListener?.();
    };
  }, [enabled]);
};

export default useGsapAnimations;
