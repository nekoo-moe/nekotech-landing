import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { useThemeContext } from "@/components/providers/ThemeProvider";
import Hamburger from "@/assets/icons/Hamburger";
import { NavigationConfig } from "@/configs/app.config";
import NorthStudioIcon from "@/assets/icons/NorthStudio";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AppHeader() {
  const { heroColors } = useThemeContext();
  const { t, language, setLanguage } = useLanguage();

  return <div
    className={styles.container}
    style={{
      color: heroColors.text,
      background: "transparent"
    }}
  >
    <div className={styles.headerContent}>

      <div className={styles.links}>
        {NavigationConfig.map(item => (
          <a
            href={item.url} key={item.key} style={{ color: heroColors.text }}
            onClick={function (e) {
              const href = (e.target as HTMLLinkElement).href;
              if (!href.includes('#')) return;
              e.preventDefault();
              const id = href.split('#').pop();
              if (!id) return;
              document.querySelector(`#${id}`)?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
          >
            {t.navigation[item.key as keyof typeof t.navigation]}
          </a>
        ))}
        <button
          onClick={() => {
             const newLang = language === 'en' ? 'vi' : 'en';
             setLanguage(newLang);
             window.location.reload(); // User explicitly asked for refresh
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '5px 15px',
            color: heroColors.text,
            cursor: 'pointer',
            marginLeft: '20px',
            fontSize: '0.9rem',
            backdropFilter: 'blur(5px)',
            transition: 'all 0.3s ease'
          }}
        >
          {language === 'en' ? '🇺🇸 EN' : '🇻🇳 VN'}
        </button>
        <a className={styles.hamburgerBtn}>
          <Hamburger color={heroColors.text} />
        </a>
      </div>
    </div>
  </div>
}
