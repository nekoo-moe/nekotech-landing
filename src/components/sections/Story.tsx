import React, { useEffect, useRef, useState } from "react";
import styles from "./sections.module.scss";
import SectionTitle from "@/components/shared/SectionTitle";
import StoryCarousel from "@/components/carousels/StoryCarousel";
import Story01 from "@/assets/figures/story-1.png";
import Story02 from "@/assets/figures/8idet6.png";
import ScrollReveal from "@/components/utils/ScrollReveal";
import { useLanguage } from "@/components/providers/LanguageProvider";



export default function Story() {
  const [activated, setActivated] = useState(false);
  const [index, setIndex] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    window.addEventListener('scroll', e => {
      if (outerRef.current?.offsetTop && outerRef.current?.offsetTop - window.scrollY < 300) {
        setActivated(true);
      }
    });
  }, []);

  const Slides = [
    {
      image: Story01.src,
      date: t.story.slides.slide1.date,
      title: <>
        <h3 dangerouslySetInnerHTML={{ __html: t.story.slides.slide1.title }} />
        <span>{t.story.slides.slide1.subtitle}</span>
      </>,
      content: <>
        <p dangerouslySetInnerHTML={{ __html: t.story.slides.slide1.p1 }} />
        <p dangerouslySetInnerHTML={{ __html: t.story.slides.slide1.p2 }} />
      </>
    },
    {
      image: Story02.src,
      date: t.story.slides.slide2.date,
      title: <>
        <h3 dangerouslySetInnerHTML={{ __html: t.story.slides.slide2.title }} />
        <span>{t.story.slides.slide2.subtitle}</span>
      </>,
      content: <>
        <p dangerouslySetInnerHTML={{ __html: t.story.slides.slide2.p1 }} />
        <p dangerouslySetInnerHTML={{ __html: t.story.slides.slide2.p2 }} />
        <p dangerouslySetInnerHTML={{ __html: t.story.slides.slide2.p3 }} />
      </>
    }
  ];

  return <div
    ref={outerRef}
    id={'story'}
    className={styles.section}
  >
    <div className={styles.sectionContent}>
      <ScrollReveal>
        <SectionTitle>
          {t.story.title}
        </SectionTitle>
        <div>
          {t.story.subtitle}
        </div>

        <StoryCarousel
          slides={Slides}
          index={index}
          date={Slides[index].date}
          activated={activated} image={Slides[index].image}
          onNext={() => setIndex(i => i + 1)}
          onPrev={() => setIndex(i => i - 1)}
          canGoNext={index < Slides.length - 1}
          canGoPrev={index > 0}
        />
        {activated && (
          <div className={styles.storyText} key={index}>
            <div className={`${styles.storyTextContent}`}>
              {Slides[index].content}
            </div>
            <div className={`${styles.storyTextTitle}`}>
              {Slides[index].title}
            </div>
          </div>
        )}
      </ScrollReveal>
    </div>
  </div>
}
