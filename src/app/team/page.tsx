"use client";
import React from "react";
// @ts-ignore
import ProfileCard from "@/components/ProfileCard";
import styles from "@/components/sections/styles.module.scss";

interface TeamMember {
  name: string;
  title: string;
  handle: string;
  avatarUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Javi A. Torres",
    title: "Software Engineer",
    handle: "javicodes",
    avatarUrl: "https://placehold.co/300x600",
  },
  {
    name: "Member 2",
    title: "Software Engineer",
    handle: "mem2",
    avatarUrl: "https://placehold.co/300x600",
  },
  {
    name: "Member 3",
    title: "Software Engineer",
    handle: "mem3",
    avatarUrl: "https://placehold.co/300x600",
  },
  {
    name: "Member 4",
    title: "Software Engineer",
    handle: "mem4",
    avatarUrl: "https://placehold.co/300x600",
  },
  {
    name: "Member 5",
    title: "Software Engineer",
    handle: "mem5",
    avatarUrl: "https://placehold.co/300x600",
  },
  {
    name: "Member 6",
    title: "Software Engineer",
    handle: "mem6",
    avatarUrl: "https://placehold.co/300x600",
  },
];

export default function TeamPage() {
  return (
    <div className={styles.teamSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Our team</h2>
        <p className={styles.subtitle}>Meet the minds behind the magic</p>
      </div>
      <div className={styles.grid}>
        {teamMembers.map((member, index) => (
          <ProfileCard
            key={index}
            name={member.name}
            title={member.title}
            handle={member.handle}
            status="Online"
            contactText="Contact Me"
            avatarUrl={member.avatarUrl}
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => window.location.href = "https://example.com"}
            miniAvatarUrl={null}
            behindGlowEnabled={false}
            behindGlowColor="rgba(0,0,0,0)"
            behindGlowSize={0}
            showShine={false}
            innerGradient="none"
          />
        ))}
      </div>
    </div>
  );
}
