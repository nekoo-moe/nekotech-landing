"use client";

import React from 'react';
import styles from '@/components/sections/Services.module.scss'; // Reuse services styles for layout
import SectionTitle from '@/components/shared/SectionTitle';
import AppHeader from '@/components/shared/Header';
import Aurora from '@/components/react-bits/Aurora';
import SideProjectItem from '@/components/landing/SideProjectItem';
import ThemeProvider from '@/components/providers/ThemeProvider';
import LanguageProvider, { useLanguage } from '@/components/providers/LanguageProvider';
import SmoothScroll from '@/components/utils/SmoothScroll';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function SideProjectsContent() {
    const { t, language } = useLanguage();

    const projects = [
        {
            title: "NekoBuckets",
            description: t.sideProjects.items.nekobuckets.description,
            actions: [
                {
                    label: t.sideProjects.actions.invite,
                    url: "https://discord.com/oauth2/authorize?client_id=1372420632628822057&permissions=8&integration_type=0&scope=bot",
                    type: 'primary' as const
                }
            ]
        },
        {
            title: "NekoMusics",
            description: t.sideProjects.items.nekomusics.description,
            actions: [
                 {
                    label: t.sideProjects.actions.invite,
                    url: "https://discord.com/oauth2/authorize?client_id=1427516379912994816&permissions=8&integration_type=0&scope=bot",
                    type: 'primary' as const
                }
            ]
        },
        {
            title: "NekoComics Legacy",
            description: t.sideProjects.items.nekocomicsLegacy.description,
            actions: [
                {
                    label: t.sideProjects.actions.viewFrontend,
                    url: "https://github.com/NekoTech-Foundation/NekoComics-FE",
                    type: 'github' as const
                },
                {
                    label: t.sideProjects.actions.viewBackend,
                    url: "https://github.com/NekoTech-Foundation/NekoComics-BE",
                    type: 'github' as const
                }
            ]
        }
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', position: 'relative' }}>
             <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
                  <Aurora
                    colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={1}
                  />
            </div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
                <AppHeader />
                
                <div style={{ paddingTop: '150px', paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
                    <div style={{ marginBottom: '2rem' }}>
                         <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '1rem' }}>
                            <ArrowLeft size={20} />
                            {language === 'vi' ? 'Quay lại' : 'Back to Home'}
                         </Link>
                        <SectionTitle>{t.sideProjects.title}</SectionTitle>
                        <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginTop: '1rem' }}>
                            {t.sideProjects.subtitle}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {projects.map((project, index) => (
                            <SideProjectItem 
                                key={index}
                                title={project.title}
                                description={project.description}
                                actions={project.actions}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SideProjectsPage() {
    return (
        // We need to wrap with ThemeProvider and LanguageProvider because layout.tsx might not cover everything specifically for this new route 
        // if generic providers aren't set up globally enough or if specific context is needed. 
        // Based on page.tsx, these providers are local to the page content.
        <ThemeProvider>
            <LanguageProvider>
                <SideProjectsContent />
            </LanguageProvider>
        </ThemeProvider>
    );
}
