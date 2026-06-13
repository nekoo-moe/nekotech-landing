"use client";
import React from "react";
import styles from "./styles.module.scss";
import SectionTitle from "@/components/shared/SectionTitle";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { useLanguage } from "@/components/providers/LanguageProvider";



export default function Services() {
    const { t } = useLanguage();

    const services = [
        {
            title: t.services.items.web.title,
            description: t.services.items.web.description,
            color: "#8aadf4"
        },
        {
            title: t.services.items.mobile.title,
            description: t.services.items.mobile.description,
            color: "#f5a97f"
        },
        {
            title: t.services.items.fullstack.title,
            description: t.services.items.fullstack.description,
            color: "#ff6000"
        },
        {
            title: t.services.items.minecraft.title,
            description: t.services.items.minecraft.description,
            color: "#a6da95"
        }
    ];

    return (
        <div id="services" className={styles.servicesSection}>
            <div className={styles.header}>
                <SectionTitle>{t.services.title}</SectionTitle>
                <div className={styles.subtitle}>
                    {t.services.subtitle}
                </div>
            </div>

            <div style={{ width: '100%', maxWidth: '1400px', position: 'relative' }}>
                <ScrollStack
                    itemDistance={25}
                    itemStackDistance={10}
                    stackPosition="20%"
                    useWindowScroll={true}
                >
                    {services.map((service, index) => (
                        <ScrollStackItem key={index}>
                            <div
                                style={{
                                    backgroundColor: '#1E1E1E',
                                    color: 'white',
                                    borderRadius: '2rem',
                                    padding: '2rem',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    border: `1px solid rgba(255, 255, 255, 0.4)`,
                                    boxShadow: `0 0 20px ${service.color}20`
                                }}
                            >
                                <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'white', fontWeight: 'bold' }}>{service.title}</h3>
                                <p style={{ fontSize: '1.2rem', lineHeight: '1.6rem', marginTop: '0.5rem' }}>{service.description}</p>
                            </div>
                        </ScrollStackItem>
                    ))}
                </ScrollStack>
            </div>
        </div>
    );
}
