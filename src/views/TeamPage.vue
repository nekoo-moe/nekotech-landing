<script setup lang="ts">
import ProfileCard from '@/components/ProfileCard.vue';
import styles from '@/components/sections/styles.module.scss';

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

const handleContactClick = () => {
  window.location.href = "https://example.com";
};
</script>

<template>
  <div :class="styles.teamSection">
    <div :class="styles.header">
      <h2 :class="styles.title">Our team</h2>
      <p :class="styles.subtitle">Meet the minds behind the magic</p>
    </div>
    <div :class="styles.grid">
      <ProfileCard
        v-for="(member, index) in teamMembers"
        :key="index"
        :name="member.name"
        :title="member.title"
        :handle="member.handle"
        status="Online"
        contactText="Contact Me"
        :avatarUrl="member.avatarUrl"
        :showUserInfo="true"
        :enableTilt="true"
        :enableMobileTilt="false"
        :behindGlowEnabled="false"
        :showShine="false"
        @contactClick="handleContactClick"
        :miniAvatarUrl="null"
        behindGlowColor="rgba(0,0,0,0)"
        behindGlowSize="0%"
        innerGradient="none"
      />
    </div>
  </div>
</template>
