import styles from "./sections.module.scss";
import SectionTitle from "@/components/shared/SectionTitle";
import React from "react";
import CareerItem from "@/components/sections/CareerItem";
import ScrollReveal from "@/components/utils/ScrollReveal";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';



export default function Careers() {
  const { t } = useLanguage();

  const Positions = [{
    id: '0',
    title: 'NekoAI',
    slots: 1,
    contestlink: 'https://github.com/NekoTech-Foundation',
    description: t.careers.items.nekoai.description,
    website: 'ai.neko.tech',
    mailadress: 'nekoai@neko.tech',
    websiteLink: 'https://github.com/NekoTech-Foundation',
    mailadressLink: 'mailto:works.nekotech@proton.me'
  }, {
    id: '1',
    title: 'NekoComics',
    slots: 1,
    contestlink: 'https://github.com/NekoTech-Foundation',
    description: t.careers.items.nekocomics.description,
    website: 'comics.nekowibu.xyz',
    mailadress: 'contact@nekowibu.xyz',
    websiteLink: 'https://github.com/NekoTech-Foundation',
    mailadressLink: 'mailto:works.nekotech@proton.me'
  }, {
    id: '2',
    title: 'NekoAnime',
    slots: 1,
    contestlink: 'https://github.com/NekoTech-Foundation',
    description: t.careers.items.nekoanime.description,
    website: 'anime.nekowibu.xyz',
    mailadress: 'contact@nekowibu.xyz',
    websiteLink: 'https://github.com/NekoTech-Foundation',
    mailadressLink: 'mailto:works.nekotech@proton.me'
  }];

  return <div
    className={styles.section} id={'career'}
  >
    <div className={styles.sectionContent}>
      <ScrollReveal>
        <SectionTitle>
          {t.careers.title}
        </SectionTitle>
        <div>
          {t.careers.subtitle}
        </div>

        {Positions.map(pos => (
          <CareerItem
            key={pos.id}
            title={pos.title}
            description={pos.description}
            contestlink={pos.contestlink}
            website={pos.website}
            mailadress={pos.mailadress}
            websiteLink={pos.websiteLink}
            mailadressLink={pos.websiteLink}
          />
        ))}

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Link href="/projects" style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '1rem 2rem', 
                backgroundColor: 'white', 
                color: 'black', 
                borderRadius: '99px', 
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.0)'}
            >
                {t.sideProjects.title} <ArrowRight size={20} />
            </Link>
        </div>
      </ScrollReveal>
    </div>
  </div>
}
