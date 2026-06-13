<script setup lang="ts">
import { ref, watch } from 'vue';
import styles from './styles.module.scss';
import NorthStudioIcon from '@/components/icons/NorthStudio.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import Envelope from '@/components/icons/Envelope.vue';

const props = defineProps<{
  open: boolean;
  member?: Member;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const closing = ref(false);

const handleClose = () => {
  emit('close');
  closing.value = true;
};

const onAnimationEnd = () => {
  closing.value = false;
};
</script>

<template>
  <div
    v-if="props.open || closing"
    :class="[styles.outer, closing ? styles.out : '']"
    @animationend="onAnimationEnd"
  >
    <div :class="styles.modalcontent">
      <div :class="styles.container">
        <div :class="styles.header">
          <div :class="styles.bg"></div>
          <div :class="styles.closeBtn" @click="handleClose">
            <CloseIcon />
          </div>
          <div
            :class="styles.avatar"
            :style="{
              backgroundImage: `url('${props.member?.photo}')`
            }"
          />
          <div :class="styles.contactArea">
            <div :class="styles.contactBtn">
              <Envelope />
              <a :href="props.member?.mail" :class="styles.mailtext">Mail</a>
            </div>
          </div>
        </div>
        <div :class="styles.contentContainer">
          <div :class="styles.name">
            {{ props.member?.name }}
          </div>
          <div :class="styles.position">
            {{ props.member?.position }}
            <div :class="styles.atSign">
              at <NorthStudioIcon :width="16" :height="16" fill="white" /> Chuyen Tin Orz
            </div>
          </div>
        </div>
        <div :class="styles.contentContainer">
          <div :class="styles.content">
            <div class="bg-white/10 border-none rounded-lg p-6 pt-6 text-center">
              <h3 :class="styles.sectionHeader">
                Skills
              </h3>
              <div :class="styles.sectionContent" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-top: 0.5rem;">
                <span
                  v-for="(skill, index) in props.member?.skills"
                  :key="index"
                  class="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div :class="styles.contentContainer">
          <div :class="styles.content">
            <div class="bg-white/10 border-none rounded-lg p-6 pt-6">
              <h3 :class="styles.sectionHeader">
                Education
              </h3>
              <div class="space-y-2" style="margin-top: 0.5rem;">
                <h4 :class="styles.sectionContent">Study at {{ props.member?.educationSchool }}</h4>
                <p :class="styles.sectionContent">{{ props.member?.educationLevel }} • Class of {{ props.member?.graduationYear }}</p>
              </div>
            </div>
          </div>  
        </div>
        <div :class="styles.contentContainer">
          <div :class="styles.content">
            <div class="bg-white/10 border-none rounded-lg p-6 pt-6">
              <h3 :class="styles.sectionHeader">
                Experience
              </h3>
              <p :class="styles.sectionContent" style="margin-top: 0.5rem;">
                Joined in {{ props.member?.onboarding }} • {{ props.member?.experience }} year{{ props.member?.experience !== 1 ? 's' : '' }} of experience
              </p>
            </div>
          </div>
        </div>
        <div :class="styles.contentContainer">
          <div :class="styles.content">
            <div class="bg-white/10 border-none rounded-lg p-6 pt-6">
              <h3 :class="styles.sectionHeader">
                Awards & Certificates
              </h3>
              <div style="margin-top: 0.5rem;">
                <h4 :class="styles.sectionContent">Awards</h4>
                <div :class="styles.sectionContent" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.25rem; margin-bottom: 0.75rem;">
                  <span
                    v-for="(award, index) in props.member?.awards"
                    :key="index"
                    class="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white"
                  >
                    {{ award }}
                  </span>
                </div>
                <h4 :class="styles.sectionContent">Certificates</h4>
                <div :class="styles.sectionContent" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.25rem;">
                  <span
                    v-for="(certificate, index) in props.member?.certificates"
                    :key="index"
                    class="inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white"
                  >
                    {{ certificate }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
