"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import NekoTechLogo from "@/assets/nekotech-logo.png";
import NorthStudioPattern from "@/assets/northstudio-pattern.svg";
import NorthStudioPatternLight from "@/assets/northstudio-pattern-light.svg";
import HomeHeroContent from "@/components/landing/HomeHeroContent";
import { useThemeContext } from "@/components/providers/ThemeProvider";
import section1img01 from "@/assets/homepage/section1/img01.jpeg";
import section1img02 from "@/assets/homepage/section1/img02.png";
import section2img01 from "@/assets/homepage/section2/img01.jpeg";
import section2img02 from "@/assets/homepage/section2/img02.png";
import section3img01 from "@/assets/homepage/section3/img01.jpeg";
import section3img02 from "@/assets/homepage/section3/img02.png"
import Aurora from "@/components/react-bits/Aurora";
import { useLanguage } from "@/components/providers/LanguageProvider";

export interface HeroItem {
  title: string;
  bgColor: string;
  txtColor: string;
  meta: {
    images: string[];
    title: string;
    description: string;
  }
}



export default function HomeHero() {
  const [textColor, setTextColor] = useState('#ffffff');
  const [locked, setLocked] = useState(false);
  const [bgColor, setBgColor] = useState('black');
  const [isLight, setIsLight] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [studio, setStudio] = useState('Studio');
  const { setHeroColors } = useThemeContext();
  const { t } = useLanguage();

  const items: HeroItem[] = [
    {
      title: t.hero.learn.title,
      bgColor: '#8aadf4',
      txtColor: '#ffffff',
      meta: {
        images: [section1img01.src, section1img02.src],
        title: t.hero.learn.metaTitle,
        description: t.hero.learn.description
      }
    },
    {
      title: t.hero.inspire.title,
      bgColor: '#ff6000',
      txtColor: '#ffffff',
      meta: {
        images: [section2img01.src, section2img02.src],
        title: t.hero.inspire.metaTitle,
        description: t.hero.inspire.description
      }
    },
    {
      title: t.hero.grow.title,
      bgColor: '#232323',
      txtColor: '#ffffff',
      meta: {
        images: [section3img01.src, section3img02.src],
        title: t.hero.grow.metaTitle,
        description: t.hero.grow.description
      }
    }
  ];

  const [selectedItem, setSelectedItem] = useState<HeroItem>(items[0]);

  // Update selected item when language changes if content is showing
  useEffect(() => {
      // Find the currently selected item by index or just reset?
      // Resetting might be safer to avoid stale state
      setSelectedItem(items[0]); 
  }, [t]);

  const reset = () => {
    if (locked) return;
    setTextColor('#ffffff');
    setBgColor('black');
    setIsLight(true);
    setShowContent(false);
  }

  useEffect(() => {
    if (setHeroColors) setHeroColors({
      text: textColor,
      background: bgColor,
    })
  }, [bgColor, textColor]);


  useEffect(() => {
    setTimeout(() => {
      setLocked(false);
    }, 30000);
  }, [locked]);


  return <div
    id={'home'}
    className={styles.homeHero}
    style={{
      backgroundColor: bgColor,
      color: textColor,
      overflow: 'hidden', // Ensure Aurora doesn't overflow
    }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={1}
      />
    </div>
    <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.homeHeroMeta}>
        {showContent ? (
          <HomeHeroContent
            item={selectedItem}
          />
        ) : (
          <div className={styles.logoWrapper}>
            <img
              src={NekoTechLogo.src}
              alt="NekoTech Logo"
              className={styles.icon}
            />
            <div className={styles.companyMeta}>
              <div className={styles.companyName}>
                NekoTech Foundation
              </div>
              <div className={styles.slogan}>
                {t.hero.landing.slogan}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.companyKeyPoints}>
        {items.map(item => (
          <div
            key={item.title}
            onMouseEnter={() => {
              if (!locked) {
                setBgColor(item.bgColor);
                setTextColor(item.txtColor);
                setShowContent(true);
                setSelectedItem(item);
              }
            }}
            onMouseLeave={reset}
            onClick={() => {
              setBgColor(item.bgColor);
              setTextColor(item.txtColor);
              setShowContent(true);
              setSelectedItem(item);
              setLocked(!(locked && selectedItem.title === item.title));
            }}
            className={(selectedItem.title === item.title && locked) ? styles.pickerSelected : undefined}
            style={{
              backgroundColor: showContent ? textColor : 'rgba(255, 255, 255, 0.1)',
              color: showContent ? bgColor : 'white',
              backdropFilter: !showContent ? 'blur(4px)' : undefined,
              border: !showContent ? '1px solid rgba(255, 255, 255, 0.1)' : undefined
            }}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  </div>

}
