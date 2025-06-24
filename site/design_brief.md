# Aris Landing Page Design Brief - Updated

This document outlines the design decisions for the Aris marketing landing page, aiming for a modern, human-first, and professional aesthetic that effectively communicates Aris's value proposition.

---

## **I. Overall Aesthetic & Brand Guidelines**

* **Human-First, Modern, Scientific:** The design should convey a sense of approachability, innovation, and intellectual rigor.
* **Clean & Intuitive:** Prioritize clarity, ease of navigation, and a sense of visual order.
* **Color Palette:** Utilize the provided CSS variables from the `master.css` file for all colors.
    * `--primary-500` (`#0E9AE9`), `--primary-600` (`#0B7EC2`), `--primary-700` (`#096195`), `--primary-800` (`#07456E`), `--primary-900` (`#0C456E`), `--primary-100` (`#E0F1FE`), `--primary-50` (`#F0F8FF`)
    * `--secondary-500` (`#8B5CF6`), etc. (full secondary palette available in CSS)
    * `--gray-0` (`#FFFFFF`), `--gray-50` (`#FAFAFA`), `--gray-75` (`#F5F7F8`), `--gray-100` (`#EDF0F2`), `--gray-200` (`#E2E6EB`), `--gray-300` (`#C5CBD3`), `--gray-400` (`#A8B2BD`), `--gray-500` (`#8994A1`), `--gray-600` (`#677382`), `--gray-700` (`#475261`), `--gray-800` (`#2E3743`), `--gray-900` (`#1F252D`)
* **Typography:**
    * Headings (`h1`, `h2`, `h3`, etc.): **Montserrat** (bold where appropriate for impact).
    * Body Text: **Source Sans 3**.
    * Line Height: Adhere to `--body-line-height` for body text.

---

## **II. Section-by-Section Design Breakdown**

### **A. Navbar (Header)**

* **Height:** Fixed at **64px**.
* **Position:** **Fixed at the top** of the page, always visible on scroll.
* **Transparency Effect:**
    * Starts **transparent** over the Hero section.
    * Transitions smoothly to a **solid background of `var(--surface-page)` (white)** as the user scrolls down past the Hero.
* **Layout:**
    * **Logo:** Aris logo (linking to homepage) on the far left.
    * **Primary Navigation (Left Side):**
        * `About` (This page will now encompass the core Aris philosophy, including **ResOps**.)
        * `AI Copilot` (Dedicated page for this central feature/philosophy, including ethical considerations.)
        * `Pricing` (This page will cover both individual and institutional pricing models and features.)
        * `Resources` (Dropdown: `Documentation`, `Blog`)
    * **Utility Links / CTAs (Right Side):**
        * `Login` (text link)
        * `Sign Up` (text link)
        * `Try the Demo` (text link, subtly less prominent than Hero CTA)
* **Mobile:** Will collapse into a hamburger menu (standard mobile behavior).

### **B. Hero Section**

* **Layout:** Full-width section up to a max-width (e.g., 960px content width), with content **left-aligned**.
* **Visual:** A **static, high-quality illustration/rendering of an Aris manuscript in a layered isometric exploded view**. This visual should convey the core concept of Aris.
* **Content:**
    * A compelling, concise headline (`h1` equivalent).
    * A brief, impactful sub-headline/description.
    * **Primary CTA Button:** "Try the Demo" (prominent, `var(--surface-action)` background, `var(--white)` text, larger size, clear hover `var(--surface-action-hover)`).
    * **Secondary CTA Link:** "Or, sign up for the beta waitlist" (text link, subordinate to primary).
* **Background:** White or a very light gray from the palette to ensure the visual stands out.

### **C. Section 2: The Research Experience, Reimagined by Aris**

* **Purpose:** Present common research problems and Aris's high-level solutions.
* **Layout:** **2x2 grid of cards** on desktop, stacking vertically on mobile.
* **Background:** `var(--gray-75)` (`#F5F7F8`) to visually separate it from the Hero section.
* **Individual Card Design:**
    * **Visual:** **Tabler.io icons** (e.g., `ti-git-fork`, `ti-messages-off`, `ti-hourglass-high`, `ti-file-off`). Icons should be clearly visible and styled consistently (e.g., in a brand color or as outlines).
    * **Content:** Bolded problem sub-heading, problem description, bolded solution statement, solution explanation.
    * **Style:** Clean `var(--surface-page)` (white) background, subtle `var(--shadow-soft)`, thin `var(--border-primary)` border, `8px` `border-radius`.
    * **Padding:** Approximately `2em` (`32px`) all around, possibly `2.5em` (`40px`) vertical.

### **D. Section 3: How Aris Transforms Your Research Experience**

* **Purpose:** Showcase Aris's core features through demonstration.
* **Layout:** **2x2 grid of cards** on desktop, stacking vertically on mobile.
* **Background:** `var(--surface-page)` (white) to provide visual contrast with Section 2.
* **Individual Card Design:**
    * **Visual:** **Prominent, short, looping animated GIFs/videos** demonstrating each feature in action. These should be at the top of each card and take up significant vertical space.
    * **Content:** Clear, bolded feature heading, concise explanation.
    * **Style:** Consistent with Section 2 cards (`var(--surface-page)` background, `var(--shadow-soft)`, `var(--border-primary)` border, `8px` `border-radius`).
    * **Hover Effect:** Subtle animation (e.g., `transform: translateY(-5px);` and transition to a slightly stronger shadow) for interactivity.

### **E. Section 4: Who Aris Empowers**

* **Purpose:** Tailor benefits and empower specific user roles.
* **Layout:** **3-column grid of cards** on desktop, stacking vertically on mobile.
* **Background:** `var(--gray-75)` (`#F5F7F8`) to provide visual contrast with Section 3.
* **Individual Card Design:**
    * **Visual:** **Role-specific Tabler.io icons** (e.g., `ti-feather` for Authors, `ti-book-2` for Readers, `ti-clipboard-check` for Reviewers). These icons should be prominent and distinct (e.g., larger, potentially with a subtle colored background shape).
    * **Content:** Bolded user type heading (e.g., "For Authors & Researchers"), concise paragraph detailing benefits.
    * **Style:** Consistent with other card sections (`var(--surface-page)` background, `var(--shadow-soft)`, `var(--border-primary)` border, `8px` `border-radius`).
    * **Hover Effect:** Consistent with Section 3 cards (subtle lift and increased shadow).

### **F. Section 5: Call to Action**

* **Purpose:** Drive final conversions for the landing page.
* **Layout:** Centered content for maximum focus.
* **Background:** **`var(--blue-100)` (`#E0F1FE`)** for an inviting, distinct visual break.
* **Content:**
    * **Heading:** "Experience what research should feel like." (Prominent, `h1` or `h2` equivalent).
    * **Primary CTA Button:** "Try the Demo" (Large, `var(--primary-500)` background, `var(--white)` text, strong hover effect).
    * **Secondary CTA Link:** "Or, sign up for the beta waitlist" (simple text link, `var(--link-default)`).

---

## **III. Footer**

* **Background:** **`var(--blue-900)` (`#0C456E`)** for a strong visual anchor.
* **Layout:** Multi-column layout on desktop, stacking vertically on mobile.
* **Text & Link Color:** Light colors (e.g., `var(--gray-100)` or `var(--gray-200)`) for readability against the dark blue.
* **Content:**
    * **Column 1: Resources** (Heading)
        * Blog
        * Documentation
        * Contact
    * **Column 2: Product** (Heading)
        * Pricing
        * Demo
        * GitHub
    * **Column 3: Connect** (Heading)
        * Social Media Icons: Bluesky, LinkedIn, X (Twitter)
    * **Bottom Section:**
        * Aris Logo (smaller, monochromatic version)
        * Copyright information (e.g., "© [Current Year] Aris. All rights reserved.")
        * Terms & Conditions (link)
        * Cookie Policy (link)

---

## **IV. Overall Linking Strategy**

* **Navbar:** Primary navigation to core pages (`About`, `AI Copilot`, `Pricing`, `Resources` dropdown, `Login`, `Sign Up`, `Try the Demo` link).
* **Hero CTAs:** Direct conversion to demo/beta.
* **Contextual Links:** Strategic text links within content sections (e.g., Sections 3 and 4) to guide users to deeper dives on `Features`, `About`, or `Pricing` pages.
* **Footer:** Comprehensive secondary navigation and legal links.
* **Consistency:** All links will maintain a consistent visual style using `var(--link-default)` and `var(--link-hover)`.# Aris Landing Page Design Brief

---

Project Goal: To create a compelling, high-converting landing page for Aris that clearly communicates its unique value proposition, appeals to its target audience, and drives sign-ups for the demo or beta waitlist.

## Core Principles for the Designer:

* Human-First Philosophy: The entire page should subtly reinforce this. Think intuitive, approachable, empowering, and focused on the researcher's experience.

* Web-Native & Interactive: Convey that Aris is "beyond PDF." Use visuals that imply dynamism, interactivity, and modern digital experiences.

* Scannability & Clarity: Break up text. Utilize strong visual hierarchy, whitespace, clear headings, bolding, and icons/illustrations. Avoid "walls of text."

* Progression: The page should tell a story, moving from a high-level hook to specific
  problems, solutions, and finally, a clear call to action.


## Landing Page Sections & Content Outline:

### 1. Hero Section

* Purpose: Immediate hook, clearly state what Aris is and its core philosophy.

* Headline: Aris: The Unified Platform for Human-First Scientific Research.

* Sub-headline: Experience an integrated platform for collaborative writing, intelligent peer review, and interactive publishing, making your science more discoverable, understandable, and deeply engaging.

* Visual Suggestion: A compelling image or short video/animation. It should quickly convey the essence of Aris – perhaps showing seamless collaboration, interactive research elements, or a clean, modern UI. Avoid generic stock photos.

* Call to Action (Primary): Large, prominent button: Try the Demo

* Call to Action (Secondary): Slightly less prominent button/link: Or, sign up for the beta waitlist

### 2. The Research Experience, Reimagined by Aris

* Purpose: Acknowledge core problems researchers face and present Aris's high-level solutions.

* Presentation: Four distinct "cards" or blocks. Each should feature:
  - A unique, relevant icon or small illustration at the top.
  - A bolded sub-heading for the problem statement.
  - Concise problem description (1-2 sentences).
  - Bolded solution statement ("Aris provides..." or "Aris offers...").
  - Concise explanation of the solution (1-3 sentences).

* Content:
  - Card 1: The Unified Research Environment.
    + Problem: Fragmented tools, lost time, battling software.
    + Aris Solution: Integrated platform, eliminates friction, regains version control,
      focuses on discoveries.

  - Card 2: Clunky Collaboration.
    + Problem: Obscured context, hindered feedback, lack of precision.
    + Aris Solution: Elevates collaboration with intelligent assistance (semantic diffs, AI Copilot inviting human interaction), empowering human agency.

  - Card 3: Peer Review Bottleneck.
    + Problem: Opaque, inefficient, sometimes lacking depth or empathy.
    + Aris Solution: Redefines peer review with built-in, efficient system, AI-powered reviewer recommendations for quality and integrity.

  - Card 4: Impersonal Digital Engagement.
    + Problem: Static articles, limiting engagement, hard to grasp complex concepts, losing personal connection.
    + Aris Solution: Transforms research into dynamic, web-native experiences, making it more discoverable, understandable, and deeply engaging.

### 3. How Aris Transforms Your Research Experience

* Purpose: Dive deeper into Aris's core value propositions and unique features, showing how it delivers on the promises from Section 2.

* Presentation: Four distinct "cards" or blocks, similar to Section 2, but with slightly more descriptive text.
  - Each card should be accompanied by a compelling screenshot or short animated GIF/video demonstrating the feature in action.
  - Clear, bolded heading for each feature.
  - Concise explanation of the feature and its key benefit.

* Content:
  - Card 1: The Unified Research Environment.
    Description: Aris integrates writing, collaboration, review, and publishing into a
    single, cohesive environment, solving fragmentation and reclaiming time lost to
    tool-juggling and email exchanges.

  - Card 2: Intelligent, Human-First Collaboration.
    Description: Focuses on semantic diffs for meaningful change tracking, and the AI Copilot's role in facilitating human interaction by suggesting feedback requests and proposing collaborators (not generating content).

  - Card 3: Streamlined Peer Review, Focused on Quality.
    Description: Explains the built-in system for peer review, highlighting how AI recommendations for reviewers lead to more relevant, insightful, and robust evaluations, emphasizing quality and integrity.

  - Card 4: Interactive Science for Deeper Engagement.
    Description: Describes the power of web-native content (embedding data/multimedia), how it boosts discoverability (intelligent tagging/search), understandability (tooltips/smart navigation), and engagement (layered reading, annotations, direct feedback).

### 4. Who Aris Empowers

* Purpose: Help specific user roles see themselves and their needs met by Aris. Shift from problem/solution to direct benefit.

* Presentation: Three distinct "cards" or blocks. Each should feature:
  - A role-specific icon/illustration.
  - A bolded heading clearly stating the user type (e.g., "For Authors & Researchers").
  - A concise paragraph detailing the specific benefits and empowerment Aris offers that role.

* Content:
  - Card 1: For Authors & Researchers
    Benefit: Integrated platform to craft, collaborate on, and publish research with
    control and clarity. Focus on ideas, streamline workflow, reach an engaged audience.

  - Card 2: For Readers & Learners
    Benefit: Transforms engagement with scientific knowledge, making it personal and
    interactive. Dive into dynamic manuscripts, add private notes, connect with authors
    for richer learning.

  - Card 3: For Reviewers & Editors
    Benefit: Streamlines peer review for efficiency and quality. Leverage intelligent reviewer recommendations, manage submissions, facilitate structured, empathetic feedback.

### 5. Call to Action (Final Conversion Point)

* Purpose: Guide the user to the desired next step.

* Presentation: A visually prominent and distinct section.
  - Large, impactful heading.
  - Clear buttons for the CTAs.

* Content:
  - Heading: Experience what research should feel like.
  - Primary CTA Button: Try the Demo
  - Secondary CTA Button/Link: Or, sign up for the beta waitlist

### Content for Separate Pages (Linked from Landing Page):

  - "About Aris" / "Our Philosophy" Page:
    + Detailed explanation of the "Human-First" philosophy.
    + Description of the "Stories of Science" feature (its purpose, how it works, why it's not gamification).
    + More on the concept of "Research Ops" (ResOps) and how Aris embodies it.

  - "Features" Page:
    + More in-depth details about the AI Copilot capabilities.
    + Comprehensive breakdown of all collaboration tools, publishing options, reading features, etc.

  - "For Institutions" / "Enterprise" Page:
    + Details on self-hosting options for research labs and institutions.
    + Specific benefits and features for larger organizations.

  - "Pricing" Page: (Once you have a pricing model).
