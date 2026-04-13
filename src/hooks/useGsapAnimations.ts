import { useEffect } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useGsapAnimations = () => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const splitTextToWhite = () => {
        const pageHeading =
          document.querySelector<HTMLHeadingElement>('#page2>h1');

        if (!pageHeading || pageHeading.querySelector('span')) {
          return;
        }

        const fragment = document.createDocumentFragment();

        Array.from(pageHeading.textContent ?? '').forEach((character) => {
          const span = document.createElement('span');
          span.textContent = character;
          fragment.appendChild(span);
        });

        pageHeading.textContent = '';
        pageHeading.appendChild(fragment);

        gsap.to('#page2>h1>span', {
          color: '#fff',
          scrollTrigger: {
            end: 'top 20%',
            scrub: 1.4,
            start: 'top bottom',
            trigger: '#page2>h1>span',
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
        gsap.from('#nav', {
          duration: 1.3,
          ease: 'power1.out',
          scrollTrigger: {
            end: 'top 50%',
            start: 'top 80%',
            trigger: '#nav',
          },
          y: -90,
        });

        gsap.from('#menu-btn', {
          duration: 1.3,
          ease: 'power1.out',
          scrollTrigger: {
            end: 'top 50%',
            start: 'top 80%',
            toggleActions: 'play none none none',
            trigger: '#menu-btn',
          },
          y: -90,
        });

        gsap.from('#scroll-btn', {
          duration: 1.2,
          ease: 'power1.out',
          y: 90,
        });

        gsap.from('.learn-more-btn-wrapper', {
          duration: 0.6,
          ease: 'power1.out',
          y: 120,
        });

        gsap.to('.learn-more-btn-wrapper', {
          delay: 0.62,
          duration: 0.8,
          ease: 'power1.out',
          x: 100,
        });

        gsap.from('.bottom-page1-inner>h4', {
          delay: 0.67,
          duration: 1,
          ease: 'power2.out',
          opacity: 0,
          y: 6,
        });
      };

      const animateHeroHeading = () => {
        const heading =
          document.querySelector<HTMLElement>('.animated-heading');

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

              lineSpan.appendChild(wordSpan);

              if (wordIndex < words.length - 1) {
                lineSpan.appendChild(document.createTextNode('\u00A0'));
              }
            });

          fragment.appendChild(lineSpan);
        });

        heading.textContent = '';
        heading.appendChild(fragment);

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
              delay: lineIndex * 0.3,
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
        const timeline =
          document.querySelector<HTMLElement>('.roadmap-timeline');
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

      const animateFeaturedProjectsSticky = () => {
        const section = document.querySelector<HTMLElement>(
          '#featured-projects-section',
        );
        const stickyPanel = document.querySelector<HTMLElement>(
          '.featured-projects-sticky',
        );
        const cardsList = document.querySelector<HTMLElement>(
          '.featured-projects-list',
        );

        if (!section || !stickyPanel || !cardsList) {
          return;
        }

        if (!window.matchMedia('(min-width: 1100px)').matches) {
          return;
        }

        ScrollTrigger.create({
          end: 'bottom bottom',
          endTrigger: cardsList,
          invalidateOnRefresh: true,
          pin: stickyPanel,
          pinSpacing: false,
          start: 'top 14%',
          trigger: section,
        });
      };

      splitTextToWhite();
      animateNav();
      initialAnimations();
      animateHeroHeading();
      animateHeadingClasses();
      animateRoadmapWords();
      animateRoadmapTimeline();
      animateFeaturedProjectsSticky();
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);
};

export default useGsapAnimations;
