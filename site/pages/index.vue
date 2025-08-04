<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="navbar">
      <a href="/" class="nav-brand">
        <img src="/studio-logo-64.svg" alt="RSM Studio Logo" class="nav-logo" />
        <div class="nav-text">
          <span class="nav-rsm">RSM</span>
          <span class="nav-studio">Studio</span>
        </div>
      </a>

      <div class="nav-links">
        <a href="#demo" class="nav-link">Demo</a>
        <a href="#benefits" class="nav-link">Benefits</a>
        <a href="#faq" class="nav-link">FAQ</a>
      </div>

      <a href="#signup" class="nav-cta-button">Get early access</a>

      <button class="nav-hamburger" :aria-expanded="mobileMenuOpen" @click="toggleMobileMenu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <div class="nav-mobile" :class="{ 'nav-mobile-open': mobileMenuOpen }">
        <a href="#demo" class="nav-link" @click="closeMobileMenu">Demo</a>
        <a href="#benefits" class="nav-link" @click="closeMobileMenu">Benefits</a>
        <a href="#faq" class="nav-link" @click="closeMobileMenu">FAQ</a>
        <a href="#signup" class="nav-cta-button" @click="closeMobileMenu">Get early access</a>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-brand">
          <img src="/studio-logo-64.svg" alt="RSM Studio Logo" class="hero-logo" />
          <div class="hero-text">
            <span class="brand-rsm">RSM</span>
            <span class="brand-studio">Studio</span>
          </div>
        </div>
        <h1 class="hero-title">Craft scholarly work designed for pixels, not&nbsp;paper</h1>
        <p class="hero-subtitle">
          Describe your ideas and structure. Generate stunning web documents without the formatting
          fight.
        </p>
        <a href="#signup" class="hero-cta-button">Get early access</a>
      </div>
    </section>

    <!-- Live Demo Section -->
    <section id="demo" class="demo-section">
      <div class="container">
        <h2 class="section-header">Introducing Readable Science Markup (RSM)</h2>
        <p class="section-subheader">A modern markup language for scientific writing</p>

        <div class="intro-content">
          <p>
            RSM is built for screens from day one. Unlike traditional publishing tools designed
            around printed pages, RSM creates responsive, interactive documents that work
            beautifully on any device.
          </p>
        </div>
        <div class="demo-controls">
          <div class="demo-tabs">
            <button
              :class="['tab-button', { active: activeTab === 'simple' }]"
              @click="activeTab = 'simple'"
            >
              Simple
            </button>
            <button
              :class="['tab-button', { active: activeTab === 'complex' }]"
              @click="activeTab = 'complex'"
            >
              Complex
            </button>
          </div>

          <div class="view-controls">
            <button
              v-for="mode in viewModes"
              :key="mode.value"
              :class="['view-button', { active: viewMode === mode.value }]"
              @click="viewMode = mode.value"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>

        <div class="demo-content">
          <div v-if="viewMode === 'markup' || viewMode === 'both'" class="demo-panel markup-panel">
            <h3>Markup</h3>
            <pre class="markup-content">{{ currentExample.markup }}</pre>
          </div>

          <div v-if="viewMode === 'output' || viewMode === 'both'" class="demo-panel output-panel">
            <h3>Output</h3>
            <div class="output-content" v-html="currentExample.output"></div>
          </div>
        </div>

        <div class="demo-callouts">
          <p
            v-if="viewMode === 'markup' || viewMode === 'both'"
            class="demo-context demo-context-left"
          >
            {{ currentExample.context }}
          </p>
          <p
            v-if="viewMode === 'output' || viewMode === 'both'"
            class="demo-context demo-context-right"
          >
            Try resizing your browser to see responsiveness in action
          </p>
        </div>
      </div>
    </section>

    <!-- Key Benefits Section -->
    <section id="benefits" class="benefits-section">
      <div class="container">
        <h2 class="section-header">Why RSM Studio?</h2>
        <p class="section-subheader">The features that make academic writing effortless</p>
        <div class="benefits-grid">
          <div class="benefit-card">
            <h3>Personalized reading experience</h3>
            <p>
              Built-in dark mode, customizable fonts, and adjustable spacing let readers tailor work
              to their preferences without losing formatting
            </p>
          </div>

          <div class="benefit-card">
            <h3>Interactive by design</h3>
            <p>
              Share living documents with embedded citations, expandable sections, and dynamic
              content that static PDFs can't deliver
            </p>
          </div>

          <div class="benefit-card">
            <h3>Web-native formatting</h3>
            <p>
              Semantic markup ensures proper heading hierarchy, citation linking, and search engine
              indexing that print-first formats lose
            </p>
          </div>

          <div class="benefit-card">
            <h3>Real-time collaboration</h3>
            <p>
              Co-authors work together in the same document with live updates, inline comments, and
              threaded discussions
            </p>
          </div>

          <div class="benefit-card">
            <h3>Accessible to all readers</h3>
            <p>
              Built-in screen reader support, keyboard navigation, and customizable reading
              preferences ensure your work reaches everyone
            </p>
          </div>

          <div class="benefit-card">
            <h3>Web-native publishing</h3>
            <p>
              Skip the PDF conversion—publish directly to the web with SEO optimization and instant
              sharing capabilities
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Signup Section -->
    <section class="signup-section">
      <div class="container">
        <div class="signup-content">
          <h2 id="signup" class="section-header">Be notified at launch</h2>
          <p class="signup-subtitle">Coming late 2025</p>

          <form v-if="!signupComplete" class="signup-form" @submit.prevent="handleSignup">
            <div class="form-group">
              <label for="email">Email <span class="required-asterisk">*</span></label>
              <input id="email" v-model="formData.email" type="email" required class="form-input" />
            </div>

            <div class="form-group">
              <label>Which tools will you use for your next publication?</label>
              <div class="checkbox-group">
                <label v-for="tool in authoringTools" :key="tool" class="checkbox-label">
                  <input
                    v-model="formData.authoringTools"
                    :value="tool"
                    type="checkbox"
                    class="checkbox-input"
                  />
                  {{ tool }}
                </label>
                <div class="other-tool">
                  <label class="checkbox-label">
                    <input
                      v-model="formData.otherToolSelected"
                      type="checkbox"
                      class="checkbox-input"
                    />
                    Other:
                  </label>
                  <input
                    v-model="formData.otherTool"
                    type="text"
                    placeholder="Please specify"
                    class="form-input other-input"
                    :disabled="!formData.otherToolSelected"
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="improvements"
                >What do you wish your current tool did better for web publishing?</label
              >
              <textarea
                id="improvements"
                v-model="formData.improvements"
                rows="4"
                class="form-textarea"
              ></textarea>
            </div>

            <div v-if="signupError" class="error-message">
              {{ signupError }}
            </div>

            <button type="submit" class="cta-button" :disabled="submitting">
              {{ submitting ? "Submitting..." : "Be notified at launch" }}
            </button>
          </form>

          <div v-else class="thank-you-message">
            <h3>Thank you for your interest!</h3>
            <p>We'll be in touch with early access details as we approach the Q4 2025 launch.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="faq-section">
      <div class="container">
        <h2 class="section-header">Frequently Asked Questions</h2>
        <div class="faq-grid">
          <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
            <button class="faq-question" @click="toggleFaq(index)">
              <h3>{{ faq.question }}</h3>
              <svg
                class="faq-chevron"
                :class="{ open: isFaqOpen(index) }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            <div class="faq-answer" :class="{ open: isFaqOpen(index) }">
              <p>
                <template v-if="faq.hasScrollPress">
                  RSM documents can export to traditional formats like PDF when needed for journal
                  submission, while also offering modern web publishing options through platforms
                  like
                  <a href="https://scroll.press" target="_blank" rel="noopener noreferrer"
                    >Scroll Press</a
                  >.
                </template>
                <template v-else-if="faq.hasArisProgram">
                  <a href="https://aris.pub" target="_blank" rel="noopener noreferrer"
                    >The Aris Program</a
                  >{{ faq.answer }}
                </template>
                <template v-else>
                  {{ faq.answer }}
                </template>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-links">
          <a href="/contact">Contact</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/legal">Legal (Impressum)</a>
        </div>
        <div class="footer-copyright">
          © 2025 RSM Studio. Part of
          <a href="https://aris.pub" target="_blank" rel="noopener noreferrer">The Aris Program</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
  import { ref, computed } from "vue";

  // Reactive data
  const activeTab = ref("simple");
  const viewMode = ref("both");
  const signupComplete = ref(false);
  const submitting = ref(false);
  const signupError = ref("");
  const openFaqs = ref(new Set());
  const mobileMenuOpen = ref(false);

  // Form data
  const formData = ref({
    email: "",
    authoringTools: [],
    otherToolSelected: false,
    otherTool: "",
    improvements: "",
  });

  // Static data
  const authoringTools = [
    "LaTeX (including Overleaf)",
    "Markdown (any variant)",
    "Typst",
    "Quarto",
    "MS Word",
    "Google Docs",
  ];

  const faqs = [
    {
      question: "How is RSM different from LaTeX?",
      answer:
        "LaTeX was designed for print publishing in the 1980s. RSM is built for the web from day one, with responsive layouts, interactive elements, and accessibility features that work automatically without additional packages or configuration.",
    },
    {
      question: "Can I import my existing LaTeX documents?",
      answer:
        "Yes! RSM Studio will include conversion tools to help migrate your existing LaTeX manuscripts, preserving your content while upgrading to web-native formatting.",
    },
    {
      question: "Will journals accept RSM submissions?",
      answer:
        "RSM documents can export to traditional formats like PDF when needed for journal submission, while also offering modern web publishing options through platforms like Scroll Press.",
      hasScrollPress: true,
    },
    {
      question: "Is RSM suitable for complex mathematical content?",
      answer:
        "Absolutely. RSM supports LaTeX-style math notation that renders beautifully on the web with proper accessibility support, including screen reader compatibility for mathematical expressions.",
    },
    {
      question: "When will RSM Studio be available?",
      answer:
        "We're targeting a late 2025 launch with full registration open to all academic writers. Sign up above to be notified when we go live.",
    },
    {
      question: "What's The Aris Program?",
      answer:
        " is our initiative to modernize academic publishing infrastructure, with RSM Studio as the flagship writing platform designed for the web era.",
      hasArisProgram: true,
    },
  ];

  const viewModes = computed(() => {
    if (process.client && window.innerWidth < 768) {
      return [
        { label: "Show Markup", value: "markup" },
        { label: "Show Output", value: "output" },
      ];
    }
    return [
      { label: "Markup", value: "markup" },
      { label: "Output", value: "output" },
      { label: "Both", value: "both" },
    ];
  });

  const examples = {
    simple: {
      markup: `# The Future of Academic Publishing

Recent advances in *semantic markup* have enabled new approaches to scholarly communication. This **web-native** approach separates content from presentation.`,
      output: `<h1>The Future of Academic Publishing</h1>
<p>Recent advances in <em>semantic markup</em> have enabled new approaches to scholarly communication. This <strong>web-native</strong> approach separates content from presentation.</p>`,
      context: "Looks familiar? RSM builds on markdown's simplicity",
    },
    complex: {
      markup: `# Advanced Research Methods
## Abstract
This paper presents novel approaches to [@smith2023] data analysis.

## Introduction
Cross-references work seamlessly: see [](#methods) for details.

## Methods {#methods}
Our methodology builds on established frameworks.

### Data Collection
We collected samples from multiple sources[^1].

## References
[@smith2023]: Smith, J. (2023). *Modern Analytics*. Academic Press.

[^1]: Sample collection followed ethical guidelines.`,
      output: `<h1>Advanced Research Methods</h1>
<h2>Abstract</h2>
<p>This paper presents novel approaches to <a href="#ref-smith2023" class="citation">Smith (2023)</a> data analysis.</p>

<h2>Introduction</h2>
<p>Cross-references work seamlessly: see <a href="#methods">Methods</a> for details.</p>

<h2 id="methods">Methods</h2>
<p>Our methodology builds on established frameworks.</p>

<h3>Data Collection</h3>
<p>We collected samples from multiple sources<a href="#fn1" class="footnote">¹</a>.</p>

<h2>References</h2>
<div class="references">
<p id="ref-smith2023">Smith, J. (2023). <em>Modern Analytics</em>. Academic Press.</p>
</div>

<div class="footnotes">
<p id="fn1">¹ Sample collection followed ethical guidelines.</p>
</div>`,
      context: "Here's where RSM goes beyond markdown",
    },
  };

  const currentExample = computed(() => examples[activeTab.value]);

  // Methods
  const handleSignup = async () => {
    submitting.value = true;
    signupError.value = "";

    try {
      // Prepare authoring tools data
      const tools = [...formData.value.authoringTools];
      if (formData.value.otherToolSelected && formData.value.otherTool.trim()) {
        tools.push(formData.value.otherTool.trim());
      }

      // Get runtime config for backend URL
      const config = useRuntimeConfig();
      const backendUrl = config.public.backendUrl || "http://localhost:8000";

      const response = await fetch(`${backendUrl}/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.value.email,
          authoring_tools: tools.length > 0 ? tools : null,
          improvements: formData.value.improvements || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.message || "Signup failed");
      }

      signupComplete.value = true;
    } catch (error) {
      console.error("Signup error:", error);
      signupError.value = error.message || "Something went wrong. Please try again.";
    } finally {
      submitting.value = false;
    }
  };

  const toggleFaq = (index) => {
    if (openFaqs.value.has(index)) {
      openFaqs.value.delete(index);
    } else {
      openFaqs.value.add(index);
    }
  };

  const isFaqOpen = (index) => {
    return openFaqs.value.has(index);
  };

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };

  const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
  };
</script>

<style scoped>
  .landing-page {
    min-height: 100vh;
    background: var(--surface-page);
    overflow-x: hidden;
  }

  /* Navigation */
  .navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: var(--surface-page);
    border-bottom: var(--border-thin) solid var(--border-primary);
    z-index: 1000;
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 3rem;
    height: 4rem;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.1rem;
    font-size: 1.25rem;
    font-weight: var(--weight-semi);
    color: var(--primary-900);
    text-decoration: none;
    letter-spacing: 0.02em;
  }

  .nav-logo {
    width: 32px;
    height: 32px;
  }

  .nav-text {
    display: flex;
    gap: 0.15rem;
  }

  .nav-rsm {
    font-family: "Montserrat", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-weight: var(--weight-bold);
  }

  .nav-studio {
    font-family: Georgia, serif;
    font-weight: var(--weight-regular);
    letter-spacing: -0.02em;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 3rem;
  }

  .nav-mobile {
    display: none;
  }

  .nav-link {
    font-family: "Source Sans 3", sans-serif;
    font-weight: var(--weight-medium);
    font-size: 0.95rem;
    color: var(--text-body);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .nav-link:hover {
    color: var(--primary-600);
  }

  .nav-cta-button {
    padding: 0.4rem 1.2rem;
    background: var(--surface-action);
    color: var(--primary-50);
    border: var(--border-thin) solid var(--surface-action);
    border-radius: 12px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: var(--weight-semi);
    font-size: 0.9rem;
    text-decoration: none;
    transition: var(--transition-bg-color), var(--transition-bd-color);
  }

  .nav-cta-button:hover {
    background: var(--surface-action-hover);
    border-color: var(--surface-action-hover);
  }

  .nav-hamburger {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .hamburger-line {
    width: 25px;
    height: 3px;
    background: var(--text-body);
    margin: 3px 0;
    transition: 0.3s;
    border-radius: 2px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Hero Section */
  .hero-section {
    padding: 8rem 0;
    padding-top: calc(8rem + 4rem);
    text-align: center;
    background: linear-gradient(135deg, var(--primary-200) 0%, var(--purple-50) 100%);
    min-height: 60vh;
    display: flex;
    align-items: center;
    position: relative;
  }

  /* Section Dividers */
  .hero-section::after,
  .demo-section::after,
  .benefits-section::after,
  .signup-section::after {
    content: "";
    position: absolute;
    bottom: -1.5px;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--secondary-300) 25%,
      var(--primary-300) 75%,
      transparent 100%
    );
    z-index: 10;
  }

  .hero-section::after {
    width: 240px;
  }

  .hero-brand {
    font-size: 3.5rem;
    font-weight: var(--weight-semi);
    color: var(--primary-900);
    margin: 0 0 2rem 0;
    letter-spacing: 0.05em;
    line-height: var(--header-line-height);
    display: inline-flex;
    align-items: center;
    gap: 0.1rem;
  }

  .hero-logo {
    width: 56px;
    height: 56px;
  }

  .hero-text {
    display: flex;
    gap: 0.15rem;
  }

  .brand-rsm {
    font-family: "Montserrat", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: var(--weight-bold);
  }

  .brand-studio {
    font-family: Georgia, serif;
    font-weight: var(--weight-regular);
    letter-spacing: -0.02em;
  }

  .hero-title {
    font-family: "Montserrat", sans-serif;
    font-size: 2.25rem;
    font-weight: var(--weight-semi);
    color: var(--extra-dark);
    margin: 0 0 2rem 0;
    line-height: var(--header-line-height);
  }

  .hero-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: 1.25rem;
    color: var(--extra-dark);
    margin: 0 0 2rem 0;
    line-height: var(--body-line-height);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-cta-button {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: var(--surface-action);
    color: var(--primary-50);
    border: var(--border-thin) solid var(--surface-action);
    border-radius: 16px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 1.1rem;
    font-weight: var(--weight-semi);
    text-decoration: none;
    cursor: pointer;
    transition: var(--transition-bg-color), var(--transition-bd-color);
    box-shadow: var(--shadow-soft), var(--shadow-strong);
  }

  .hero-cta-button:hover {
    background: var(--surface-action-hover);
    border-color: var(--surface-action-hover);
  }

  /* Section Headers */
  .section-header {
    font-family: "Georgia", serif;
    font-size: var(--h2-size);
    font-weight: var(--weight-semi);
    color: var(--text-body);
    text-align: center;
    margin: 3rem 0 0.75rem 0;
    line-height: var(--header-line-height);
  }

  .section-subheader {
    font-family: "Source Sans 3", sans-serif;
    font-size: 1.1rem;
    color: var(--dark);
    text-align: center;
    margin: 0 0 3rem 0;
    line-height: var(--body-line-height);
  }

  /* Common Section Styles */
  .demo-section,
  .benefits-section,
  .signup-section,
  .faq-section {
    padding: 7rem 0;
    background: var(--surface-page);
    position: relative;
  }

  .intro-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .intro-content p {
    font-family: "Source Sans 3", sans-serif;
    font-size: 1.1rem;
    color: var(--text-body);
    line-height: var(--body-line-height);
    margin: 0 0 1.5rem 0;
  }

  .demo-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
  }

  .demo-tabs {
    display: flex;
    gap: 0.5rem;
  }

  .tab-button {
    padding: 6px 8px;
    border: var(--border-thin) solid var(--border-action);
    background: var(--surface-page);
    color: var(--text-action);
    border-radius: 8px;
    cursor: pointer;
    font-family: "Source Sans 3", sans-serif;
    font-weight: var(--weight-medium);
    transition: var(--transition-bg-color), var(--transition-bd-color);
    outline: none;
  }

  .tab-button:hover {
    background: var(--surface-information);
    border-color: var(--border-action-hover);
    color: var(--text-action-hover);
  }

  .tab-button:focus-visible {
    outline: var(--border-med) solid var(--border-action);
    outline-offset: var(--border-extrathin);
  }

  .tab-button.active {
    background: var(--surface-action);
    color: var(--primary-50);
    border-color: var(--surface-action);
  }

  .view-controls {
    display: flex;
    gap: 0.5rem;
  }

  .view-button {
    padding: 6px 8px;
    border: var(--border-thin) solid var(--border-primary);
    background: var(--surface-page);
    color: var(--text-body);
    border-radius: 8px;
    cursor: pointer;
    font-family: "Source Sans 3", sans-serif;
    font-weight: var(--weight-medium);
    transition: var(--transition-bg-color), var(--transition-bd-color);
    outline: none;
  }

  .view-button:hover {
    background: var(--surface-hover);
    border-color: var(--secondary-400);
  }

  .view-button:focus-visible {
    outline: var(--border-med) solid var(--secondary-400);
    outline-offset: var(--border-extrathin);
  }

  .view-button.active {
    background: var(--secondary-500);
    color: var(--white);
    border-color: var(--secondary-500);
  }

  .demo-content {
    display: flex;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .demo-panel {
    flex: 1;
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 16px;
    overflow: hidden;
    background: var(--surface-page);
    display: flex;
    flex-direction: column;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .demo-panel h3 {
    margin: 0;
    padding: 0.75rem 1rem;
    font-family: "Montserrat", sans-serif;
    font-size: var(--h6-size);
    font-weight: var(--weight-semi);
    color: var(--text-body);
    border-bottom: var(--border-extrathin) solid var(--border-primary);
  }

  .markup-panel h3 {
    background: var(--primary-300);
  }

  .output-panel h3 {
    background: var(--secondary-300);
  }

  .markup-content {
    padding: 1rem;
    font-family: "Source Code Pro", monospace;
    font-size: 0.875rem;
    line-height: var(--body-line-height);
    margin: 0;
    background: var(--surface-page);
    color: var(--text-body);
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    flex: 1;
  }

  .output-content {
    padding: 1rem;
    font-family: "Source Sans 3", sans-serif;
    line-height: var(--body-line-height);
    color: var(--text-body);
    flex: 1;
    background: var(--surface-page);
  }

  .output-content h1 {
    font-family: "Montserrat", sans-serif;
    font-size: 1.8rem;
    margin: 0 0 1rem 0;
  }

  .output-content h2 {
    font-family: "Montserrat", sans-serif;
    font-size: 1.4rem;
    margin: 1.5rem 0 1rem 0;
  }

  .output-content h3 {
    font-family: "Montserrat", sans-serif;
    font-size: 1.2rem;
    margin: 1.25rem 0 0.75rem 0;
  }

  .output-content .citation {
    color: #007acc;
    text-decoration: none;
  }

  .output-content .footnote {
    color: #007acc;
    text-decoration: none;
    font-size: 0.8rem;
    vertical-align: super;
  }

  .output-content .references {
    margin-top: 2rem;
    border-top: 1px solid #eee;
    padding-top: 1rem;
  }

  .output-content .footnotes {
    margin-top: 1.5rem;
    border-top: 1px solid #eee;
    padding-top: 1rem;
    font-size: 0.9rem;
  }

  .demo-callouts {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
  }

  .demo-context {
    font-family: "Source Sans 3", sans-serif;
    font-style: italic;
    color: var(--medium);
    margin: 0;
    font-size: 0.875rem;
    flex: 1;
  }

  .demo-context-left {
    text-align: left;
  }

  .demo-context-right {
    text-align: right;
  }

  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .benefit-card {
    background: var(--surface-page);
    padding: 2rem;
    border-radius: 16px;
    border: var(--border-extrathin) solid var(--border-primary);
    box-shadow: var(--shadow-soft);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
  }

  .benefit-card:hover {
    transform: translateY(-2px);
    border-color: var(--primary-400);
    box-shadow:
      var(--shadow-soft),
      0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .benefit-card h3 {
    font-family: "Montserrat", sans-serif;
    font-size: var(--h5-size);
    font-weight: var(--weight-semi);
    color: var(--text-body);
    margin: 0 0 1rem 0;
    line-height: var(--header-line-height);
  }

  .benefit-card p {
    font-family: "Source Sans 3", sans-serif;
    color: var(--dark);
    line-height: var(--body-line-height);
    margin: 0;
  }

  .signup-content {
    max-width: 600px;
    margin: 0 auto 3rem auto;
    text-align: center;
  }

  .signup-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: 1.1rem;
    color: var(--medium);
    margin: 0 0 2rem 0;
    font-weight: var(--weight-medium);
  }

  .signup-form {
    text-align: left;
  }

  .form-group {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-family: "Source Sans 3", sans-serif;
    font-weight: var(--weight-semi);
    color: var(--text-body);
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 1rem;
    background: transparent;
    color: var(--text-body);
    transition: var(--transition-bd-color);
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--border-action);
    background-color: var(--surface-page);
  }

  .checkbox-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem 1rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    font-weight: var(--weight-regular) !important;
    cursor: pointer;
    font-family: "Source Sans 3", sans-serif;
    height: 28px;
  }

  .checkbox-input {
    width: auto;
    margin-right: 0.75rem;
    flex-shrink: 0;
  }

  .other-tool {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 28px;
  }

  .other-tool .checkbox-label {
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .other-input {
    flex: 1;
    margin-left: 0;
    padding: 0;
    font-size: 0.9rem;
    height: 28px;
    line-height: 1;
    box-sizing: border-box;
    padding: 0 0.5rem;
  }

  .other-input:disabled {
    background: #f5f5f5;
    color: #999;
  }

  .required-asterisk {
    color: var(--primary-600);
    font-weight: var(--weight-bold);
  }

  .cta-button {
    width: 100%;
    padding: 0.75rem 2rem;
    background: var(--surface-action);
    color: var(--primary-50);
    border: var(--border-thin) solid var(--surface-action);
    border-radius: 16px;
    font-family: "Source Sans 3", sans-serif;
    font-size: 1.1rem;
    font-weight: var(--weight-semi);
    cursor: pointer;
    transition: var(--transition-bg-color), var(--transition-bd-color);
    box-shadow: var(--shadow-soft), var(--shadow-strong);
    outline: none;
  }

  .cta-button:hover:not(:disabled) {
    background: var(--surface-action-hover);
    border-color: var(--surface-action-hover);
  }

  .cta-button:focus-visible {
    outline: var(--border-med) solid var(--border-action);
    outline-offset: var(--border-extrathin);
  }

  .cta-button:disabled {
    background: var(--surface-disabled);
    border-color: var(--surface-disabled);
    color: var(--text-disabled);
    cursor: not-allowed;
    box-shadow: none;
  }

  .error-message {
    padding: 1rem;
    background: var(--red-50);
    border: var(--border-thin) solid var(--red-300);
    border-radius: 12px;
    color: var(--red-700);
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }

  .thank-you-message {
    padding: 2rem;
    background: var(--surface-success);
    border-radius: 16px;
    border: var(--border-extrathin) solid var(--border-success);
  }

  .thank-you-message h3 {
    font-family: "Montserrat", sans-serif;
    font-size: var(--h4-size);
    font-weight: var(--weight-semi);
    color: var(--success-700);
    margin: 0 0 1rem 0;
  }

  .thank-you-message p {
    font-family: "Source Sans 3", sans-serif;
    color: var(--text-body);
    margin: 0;
    line-height: var(--body-line-height);
  }

  .faq-section::before,
  .footer::before {
    content: "";
    position: absolute;
    top: -1.5px;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--secondary-300) 25%,
      var(--primary-300) 75%,
      transparent 100%
    );
    z-index: 10;
  }

  .footer::before {
    width: 240px;
  }

  .faq-grid {
    display: block;
    margin-top: 2rem;
  }

  .faq-item {
    border-bottom: 1px solid var(--border-primary);
    transition: var(--transition-bd-color);
  }

  .faq-item:last-child {
    border-bottom: none;
  }

  .faq-question {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
    transition: var(--transition-bg-color);
  }

  .faq-question:hover {
    background: var(--surface-hover);
  }

  .faq-question h3 {
    font-family: "Montserrat", sans-serif;
    font-size: 1.1rem;
    font-weight: var(--weight-semi);
    color: var(--text-body);
    margin: 0;
    line-height: 1.4;
    flex: 1;
  }

  .faq-chevron {
    width: 20px;
    height: 20px;
    color: var(--medium);
    transition:
      transform 0.3s ease,
      color 0.2s ease;
    flex-shrink: 0;
    margin-left: 1rem;
  }

  .faq-question:hover .faq-chevron {
    color: var(--primary-400);
  }

  .faq-chevron.open {
    transform: rotate(180deg);
  }

  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .faq-answer.open {
    max-height: 200px;
  }

  .faq-answer p {
    font-family: "Source Sans 3", sans-serif;
    font-size: 0.95rem;
    color: var(--text-body);
    margin: 0;
    padding: 0 1.5rem 1.5rem 1.5rem;
    line-height: var(--body-line-height);
  }

  .faq-answer p a {
    color: var(--primary-600);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .faq-answer p a:hover {
    color: var(--primary-600);
    text-decoration: underline;
  }

  /* Footer */
  .footer {
    padding: 2rem 0;
    background: var(--very-light);
    position: relative;
  }

  .footer-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1rem;
  }

  .footer-links a {
    font-family: "Source Sans 3", sans-serif;
    color: var(--dark);
    text-decoration: none;
    transition: color 0.2s;
    font-weight: var(--weight-medium);
  }

  .footer-links a:hover {
    color: var(--text-action);
  }

  .footer-copyright {
    text-align: center;
    font-family: "Source Sans 3", sans-serif;
    color: var(--medium);
    font-size: 0.875rem;
  }

  .footer-copyright a {
    color: var(--primary-600);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .footer-copyright a:hover {
    color: var(--primary-600);
    text-decoration: underline;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .navbar {
      padding: 0 1rem;
    }

    .nav-links,
    .nav-cta-button {
      display: none;
    }

    .nav-mobile {
      display: none;
      position: fixed;
      top: 4rem;
      left: 0;
      width: 100%;
      background: var(--surface-page);
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      gap: 2rem;
      border-bottom: var(--border-thin) solid var(--border-primary);
    }

    .nav-mobile.nav-mobile-open {
      display: flex;
    }

    .nav-mobile .nav-link {
      font-size: 1.5rem;
      font-weight: var(--weight-semi);
      text-align: center;
    }

    .nav-mobile .nav-cta-button {
      font-size: 1.25rem;
      padding: 1rem 2rem;
    }

    .nav-hamburger {
      display: flex;
    }

    .nav-hamburger[aria-expanded="true"] .hamburger-line:nth-child(1) {
      transform: rotate(-45deg) translate(-5px, 6px);
    }

    .nav-hamburger[aria-expanded="true"] .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .nav-hamburger[aria-expanded="true"] .hamburger-line:nth-child(3) {
      transform: rotate(45deg) translate(-5px, -6px);
    }
    .container {
      padding: 0 1rem;
    }

    .hero-section {
      padding-top: calc(4rem + 4rem) !important;
      padding-bottom: 4rem !important;
    }

    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
    }

    .demo-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .demo-content {
      flex-direction: column;
    }

    .demo-callouts {
      flex-direction: column;
      gap: 1rem;
    }

    .demo-context-left,
    .demo-context-right {
      text-align: center;
    }

    .benefits-grid {
      grid-template-columns: 1fr;
    }

    .checkbox-group {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .other-tool {
      gap: 0.5rem;
    }

    .other-input {
      margin-top: 0;
    }

    .footer-links {
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }
  }

  @media (max-width: 480px) {
    .hero-section,
    .demo-section,
    .benefits-section,
    .signup-section,
    .faq-section {
      padding: 2rem 0;
    }

    .hero-title {
      font-size: 1.75rem;
    }
  }
</style>
