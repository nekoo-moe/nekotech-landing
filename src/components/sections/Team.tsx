"use client";
import React from "react";
import styles from "./styles.module.scss";
import SectionTitle from "@/components/shared/SectionTitle";
import ProfileCard from "@/components/ProfileCard";
import ScrollReveal from "@/components/utils/ScrollReveal";

const members = [
    {
        name: "Alyosha",
        title: "Team Leader & Software Engineer",
        handle: "ssdarealest",
        avatarUrl: "https://cdn.imgchest.com/files/522ca93545bf.jpg",
        miniAvatarUrl: "https://cdn.imgchest.com/files/37d75fe91a04.jpg",
        website: "https://akk1to.tech",
        status: "the state of mind."
    },
    {
        name: "Heiznerd",
        title: "Frontend Developer",
        handle: "captainnhwuy",
        avatarUrl: "https://cdn.imgchest.com/files/ffceb2c2933a.png",
        miniAvatarUrl: "https://cdn.imgchest.com/files/3bbfb29ac0b3.jpg",
        website: "https://heiznerd.is-a.dev/",
        status: "! heiznerd."
    },
    {
        name: "maiminhdung",
        title: "Backend & Mobile Developer",
        handle: "maiminhdung",
        avatarUrl: "https://cdn.imgchest.com/files/aa2db9376aa7.jpg",
        miniAvatarUrl: "https://cdn.imgchest.com/files/ff3602e5b701.gif",
        website: "https://maiminhdung.dev/",
        status: "Mai Minh Dung"
    }
];

export default function Team() {
    return (
        <div id="team" className={styles.teamSection}>
            <ScrollReveal className={styles.header}>
                <SectionTitle>Our Team</SectionTitle>
                <div className={styles.subtitle}>
                    Meet our amazing team...
                </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className={styles.grid}>
                {members.map((member, index) => (
                    <ProfileCard
                        key={index}
                        name={member.name}
                        title={member.title}
                        handle={member.handle}
                        status={member.status}
                        contactText="Contact Me"
                        avatarUrl={member.avatarUrl}
                        miniAvatarUrl={member.miniAvatarUrl}
                        showUserInfo={true}
                        enableTilt={false}
                        enableMobileTilt={false}
                        behindGlowEnabled={false}
                        showShine={false}
                        onContactClick={() => window.location.href = member.website}
                        behindGlowColor="rgba(0,0,0,0)"
                        behindGlowSize={0}
                        innerGradient="none"
                    />
                ))}
            </ScrollReveal>
        </div>
    )
}
