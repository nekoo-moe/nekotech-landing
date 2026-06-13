"use client";
import styles from './page.module.css'
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import HomeHero from "@/components/landing/HomeHero";
import AppHeader from "@/components/shared/Header";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Story from "@/components/sections/Story";
import Careers from "@/components/sections/Careers";
import Team from "@/components/sections/Team";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import LanguageProvider from "@/components/providers/LanguageProvider";

export default function Home() {
    return (
        <main className={styles.main}>
            <ThemeProvider>
                <LanguageProvider>
                    <AppHeader />
                    <HomeHero />
                    <Services />
                    <Team />
                    <Story />
                    <Careers />
                    <Contact />
                    <Analytics />
                    <SpeedInsights />
                </LanguageProvider>
            </ThemeProvider>
        </main>
    )
}
