<script setup>
  /**
   * Section - A styled container component for grouping related content.
   *
   * This component provides a visually distinct section with optional title, main content,
   * and footer areas. It's useful for breaking down complex UIs into manageable parts.
   * It supports a `danger` variant for highlighting critical information or actions.
   *
   * @displayName Section
   * @example
   * // Basic usage with title and content
   * <Section>
   *   <template #title>My Section Title</template>
   *   <template #content><p>This is the content of the section.</p></template>
   * </Section>
   *
   * @example
   * // Section with a footer
   * <Section>
   *   <template #title>Actions</template>
   *   <template #content><p>Perform an action here.</p></template>
   *   <template #footer><Button>Save</Button></template>
   * </Section>
   *
   * @example
   * // Danger variant section
   * <Section class="danger">
   *   <template #title>Warning!</template>
   *   <template #content><p>This operation is irreversible.</p></template>
   * </Section>
   */
  import {} from "vue";
</script>

<template>
  <div class="section">
    <div v-if="$slots.title" class="title text-h5">
      <slot name="title" />
    </div>
    <div class="content"><slot name="content" /></div>
    <div v-if="$slots.footer" class="footer"><slot name="footer" /></div>
  </div>
</template>

<style scoped>
  .section {
    border-radius: calc(8px + var(--border-thin));
    background-color: var(--surface-page);
    border: var(--border-thin) solid var(--border-primary);
    margin-bottom: 16px;
    width: fit-content;
  }

  .section > * {
    padding-inline: 8px;
  }

  .section > .title {
    height: 40px;
    border-bottom: 2px solid var(--border-primary);
    margin-bottom: 8px;
    padding-inline: 8px;
    background-color: var(--gray-200);
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
  }

  .section > :is(.content, .footer) {
    display: flex;
    flex-direction: column;
    padding-inline: 8px;
    gap: 16px;
    padding-bottom: 16px;
  }

  .section.danger {
    border-color: var(--border-error);
    border-radius: 8px;
  }

  .section.danger .title {
    background-color: var(--error-50);
    border-color: var(--border-error);
  }
</style>
