<script setup>
  import { ref, reactive } from "vue";
  import { IconQuote, IconUserEdit, IconCalendar, IconBook2 } from "@tabler/icons-vue";

  const sectionData = reactive([
    {
      label: "Reference",
      icon: IconQuote,
      content: `Dynamic Regulation of Cellular Systems in Microenvironments
        by L. Martinez, A. Chen, and R. Gupta
        Published in Web-native Research Communications, Volume 12, Issue 3, Pages 145–167 (March 2025)
        DOI: 10.5678/wrc.v12i3.10234`,
    },
    {
      label: "Author",
      icon: IconUserEdit,
      content: `
        Dr. Alice Chen
        Molecular Biology, Stanford University
        ✉️ alice.chen@stanford.edu (Corresponding Author)

        Dr. Rajesh Patel
        Biophysics, University of Cambridge
        ✉️ r.patel@cam.ac.uk

        Dr. Sophia Kim
        Genomic Research, Seoul National University
        ✉️ sophia.kim@snu.ac.kr`,
    },
    {
      label: "Source",
      icon: IconBook2,
      content: `
        📝 Web-native Research Communications
        Volume 12, Issue 4 (2025)
        🔗 DOI: 10.5678/wrc.2025.10234
        📅 2025
     `,
    },
    {
      label: "Date",
      icon: IconCalendar,
      content: `
        📝 Submitted: January 15, 2025
        ✅ Accepted: March 5, 2025
        🌐 Published Online: March 20, 2025
        📚 Published in Print: March 25, 2025
   `,
    },
  ]);
</script>

<template>
  <div class="citation">
    <div v-for="obj in sectionData" :key="obj" :class="['sec', obj.label.toLowerCase()]">
      <div class="sec-title text-label">
        <div class="left">
          <span class="sec-title-icon"><component :is="obj.icon" /></span>
          <span class="sec-title-label">{{ obj.label }}</span>
        </div>
        <div class="right">
          <SegmentedControl
            v-if="obj.label === 'Reference'"
            :labels="['Plain', 'BibTex']"
            :default-active="0"
          />
          <Button kind="tertiary" icon="Clipboard" size="sm" />
        </div>
      </div>
      <div class="sec-content">
        <p>{{ obj.content || "" }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .citation {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sec {
  }

  .sec.reference .sec-title .right :deep(.sc-wrapper .sc-btn) {
    padding-block: 0;
  }

  .sec-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: var(--border-thin) solid var(--border-information);
    margin-bottom: 8px;
  }

  .sec-title .left {
    display: flex;
    gap: 8px;
  }

  .sec-title .right {
    display: flex;
    gap: 8px;
  }

  .sec-title-icon .tabler-icon {
    margin: 0;
  }

  .sec-content {
  }
</style>
