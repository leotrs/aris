<template>
  <section class="process">
    <p class="label text-label">Process</p>
    <h2>From idea to publication — all in one space</h2>
    <p>
      Aris supports your research from first draft to final publication, with built-in tools for writing, reviewing, and sharing.
    </p>
    <div class="steps">
      <div class="step">
        <h3>Step 1: Write</h3>
        <p>Start with a clean editor built for research. No templates or formatting battles.</p>
      </div>
      <div class="step">
        <h3>Step 2: Collaborate</h3>
        <p>Invite co-authors, reviewers, and colleagues to read and comment in real time.</p>
      </div>
      <div class="step">
        <h3>Step 3: Share</h3>
        <p>Publish a polished document that's accessible and professional — instantly and online.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
  section {
    padding: 4rem 1rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  h2, h3 {
    font-weight: var(--weight-semi);
    margin-bottom: 1rem;
  }

  p {
    margin: 0 auto;
    max-width: 65ch;
  }

  .process {
    background: var(--gray-100);
    text-align: center;
  }

  .label {
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .step p {
    line-height: 1.6;
  }

  .steps {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 2rem;
    justify-content: center;
  }

  .step {
    flex: 1 1 250px;
    background: var(--gray-75);
    padding: 1.5rem;
    border-radius: 8px;
    text-align: left;
  }
</style>