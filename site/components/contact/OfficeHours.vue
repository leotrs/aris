<template>
  <section id="office-hours" class="office-hours-section" aria-labelledby="office-hours-heading">
    <div class="office-hours-content-wrapper">
      <div class="section-header">
        <h2 id="office-hours-heading" class="section-title">Office Hours & Consultations</h2>
        <p class="section-subtitle">
          Schedule one-on-one time with our team for personalized guidance, institutional
          consultations, and in-depth discussions about your research publishing needs.
        </p>
      </div>

      <div class="office-hours-grid">
        <div class="schedule-card">
          <div class="card-header">
            <div class="card-icon">
              <IconCalendar :size="32" />
            </div>
            <h3 class="card-title">Weekly Office Hours</h3>
            <p class="card-subtitle">Open sessions for questions and guidance</p>
          </div>
          <div class="card-content">
            <div class="schedule-times">
              <div class="time-slot">
                <div class="day-info">
                  <IconClock :size="16" />
                  <span class="day">Tuesdays</span>
                </div>
                <div class="time-details">
                  <span class="time">2:00 PM - 3:00 PM EST</span>
                  <span class="timezone">11:00 AM - 12:00 PM PST</span>
                </div>
              </div>
              <div class="time-slot">
                <div class="day-info">
                  <IconClock :size="16" />
                  <span class="day">Thursdays</span>
                </div>
                <div class="time-details">
                  <span class="time">10:00 AM - 11:00 AM EST</span>
                  <span class="timezone">7:00 AM - 8:00 AM PST</span>
                </div>
              </div>
            </div>
            <div class="session-info">
              <h4 class="info-title">What to Expect:</h4>
              <ul class="info-list">
                <li>Drop-in format, no appointment needed</li>
                <li>Screen sharing for technical issues</li>
                <li>Q&A about features and workflows</li>
                <li>Community introductions</li>
              </ul>
            </div>
          </div>
          <div class="card-actions">
            <a href="https://meet.aris-platform.org/office-hours" class="btn btn-primary">
              <IconVideo :size="16" />
              Join Office Hours
            </a>
            <p class="action-note">Zoom link available 15 minutes before</p>
          </div>
        </div>

        <div class="consultation-card">
          <div class="card-header">
            <div class="card-icon">
              <IconUserCheck :size="32" />
            </div>
            <h3 class="card-title">Private Consultations</h3>
            <p class="card-subtitle">Scheduled one-on-one sessions</p>
          </div>
          <div class="card-content">
            <div class="consultation-types">
              <div class="consultation-type">
                <div class="type-icon">
                  <IconUser :size="20" />
                </div>
                <div class="type-info">
                  <h4 class="type-title">Individual Researcher</h4>
                  <p class="type-description">
                    30-minute sessions for personal workflow optimization
                  </p>
                  <span class="type-duration">Free</span>
                </div>
              </div>
              <div class="consultation-type">
                <div class="type-icon">
                  <IconBuilding :size="20" />
                </div>
                <div class="type-info">
                  <h4 class="type-title">Institutional Review</h4>
                  <p class="type-description">60-minute deep dive for institutional adoption</p>
                  <span class="type-duration">Complimentary</span>
                </div>
              </div>
              <div class="consultation-type">
                <div class="type-icon">
                  <IconSettings :size="20" />
                </div>
                <div class="type-info">
                  <h4 class="type-title">Technical Integration</h4>
                  <p class="type-description">Custom integration planning and implementation</p>
                  <span class="type-duration">Free consultation</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <a href="https://calendly.com/aris-platform/consultation" class="btn btn-primary">
              <IconCalendarPlus :size="16" />
              Schedule Consultation
            </a>
            <p class="action-note">Choose your preferred time slot</p>
          </div>
        </div>
      </div>

      <div class="availability-info">
        <div class="availability-content">
          <h3 class="availability-title">Global Availability</h3>
          <p class="availability-description">
            Our team spans multiple time zones to provide support when you need it. We offer
            flexible scheduling to accommodate researchers worldwide.
          </p>
          <div class="timezone-grid">
            <div class="timezone-card">
              <div class="timezone-header">
                <IconClock :size="20" />
                <span class="timezone-name">Eastern Time (EST/EDT)</span>
              </div>
              <div class="timezone-hours">
                <span class="hours">9:00 AM - 6:00 PM</span>
                <span class="coverage">Primary coverage</span>
              </div>
            </div>
            <div class="timezone-card">
              <div class="timezone-header">
                <IconClock :size="20" />
                <span class="timezone-name">Central European Time (CET/CEST)</span>
              </div>
              <div class="timezone-hours">
                <span class="hours">3:00 PM - 11:00 PM</span>
                <span class="coverage">Extended hours</span>
              </div>
            </div>
            <div class="timezone-card">
              <div class="timezone-header">
                <IconClock :size="20" />
                <span class="timezone-name">Pacific Time (PST/PDT)</span>
              </div>
              <div class="timezone-hours">
                <span class="hours">6:00 AM - 3:00 PM</span>
                <span class="coverage">Morning coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="consultation-prep">
        <div class="prep-content">
          <h3 class="prep-title">How to Prepare</h3>
          <div class="prep-grid">
            <div class="prep-section">
              <h4 class="prep-section-title">Before Office Hours</h4>
              <ul class="prep-list">
                <li>Have specific questions ready</li>
                <li>Share screen if needed for technical issues</li>
                <li>Bring examples of your current workflow</li>
                <li>No preparation required for general questions</li>
              </ul>
            </div>
            <div class="prep-section">
              <h4 class="prep-section-title">Before Private Consultation</h4>
              <ul class="prep-list">
                <li>Fill out pre-consultation survey</li>
                <li>Gather institutional requirements (if applicable)</li>
                <li>Prepare questions about specific use cases</li>
                <li>Consider your team size and needs</li>
              </ul>
            </div>
            <div class="prep-section">
              <h4 class="prep-section-title">Technical Requirements</h4>
              <ul class="prep-list">
                <li>Stable internet connection</li>
                <li>Zoom client or web browser</li>
                <li>Microphone and camera (optional)</li>
                <li>Screen sharing capability if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="testimonials">
        <div class="testimonials-content">
          <h3 class="testimonials-title">What Researchers Say</h3>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <div class="testimonial-content">
                <p class="testimonial-text">
                  "The office hours session helped me understand how Aris could transform our
                  multi-institutional collaboration. The team answered all our security questions."
                </p>
              </div>
              <div class="testimonial-author">
                <div class="author-info">
                  <span class="author-name">Dr. Sarah Chen</span>
                  <span class="author-title">Principal Investigator, MIT</span>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-content">
                <p class="testimonial-text">
                  "The institutional consultation was incredibly thorough. They addressed our IT
                  department's concerns and provided a clear implementation roadmap."
                </p>
              </div>
              <div class="testimonial-author">
                <div class="author-info">
                  <span class="author-name">Dr. Marcus Rodriguez</span>
                  <span class="author-title">IT Director, Stanford University</span>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-content">
                <p class="testimonial-text">
                  "Quick, helpful, and knowledgeable. The team helped me set up my first
                  collaborative manuscript in just 30 minutes."
                </p>
              </div>
              <div class="testimonial-author">
                <div class="author-info">
                  <span class="author-name">Dr. Elena Kowalski</span>
                  <span class="author-title">Postdoc, Oxford University</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import {
    IconCalendar,
    IconClock,
    IconVideo,
    IconUserCheck,
    IconUser,
    IconBuilding,
    IconSettings,
    IconCalendarPlus,
  } from "@tabler/icons-vue";
</script>

<style scoped>
  /* Office Hours Section */
  .office-hours-section {
    background: linear-gradient(135deg, var(--primary-25) 0%, var(--gray-25) 100%);
    padding: var(--space-4xl) 0;
  }

  .office-hours-content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  /* Section Header */
  .section-header {
    text-align: center;
    margin-bottom: var(--space-4xl);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-title {
    font-family: "Montserrat", sans-serif;
    font-size: clamp(28px, 6vw, 36px);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-lg);
    line-height: 1.2;
  }

  .section-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: clamp(16px, 4vw, 18px);
    line-height: 1.6;
    color: var(--gray-700);
  }

  /* Office Hours Grid */
  .office-hours-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .schedule-card,
  .consultation-card {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .schedule-card:hover,
  .consultation-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }

  .card-header {
    text-align: center;
    margin-bottom: var(--space-lg);
  }

  .card-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-md);
    color: var(--primary-600);
    box-shadow: var(--shadow-soft);
  }

  .card-title {
    font-family: "Montserrat", sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
    line-height: 1.3;
  }

  .card-subtitle {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-600);
    line-height: 1.4;
  }

  .card-content {
    flex: 1;
    margin-bottom: var(--space-lg);
  }

  /* Schedule Times */
  .schedule-times {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    margin-bottom: var(--space-lg);
  }

  .time-slot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    background: var(--gray-25);
    border-radius: 8px;
    border: 1px solid var(--border-primary);
  }

  .day-info {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .day-info svg {
    color: var(--primary-600);
  }

  .day {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .time-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-xs);
  }

  .time {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .timezone {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
  }

  /* Session Info */
  .session-info {
    background: var(--primary-25);
    border: 1px solid var(--primary-200);
    border-radius: 8px;
    padding: var(--space-md);
  }

  .info-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-sm);
  }

  .info-list {
    margin: 0;
    padding-left: var(--space-lg);
  }

  .info-list li {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    margin-bottom: var(--space-xs);
  }

  /* Consultation Types */
  .consultation-types {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .consultation-type {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--gray-25);
    border-radius: 8px;
    border: 1px solid var(--border-primary);
  }

  .type-icon {
    width: 40px;
    height: 40px;
    background: var(--primary-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .type-info {
    flex: 1;
  }

  .type-title {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-xs);
  }

  .type-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: var(--gray-700);
    margin-bottom: var(--space-xs);
  }

  .type-duration {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: var(--success-600);
    background: var(--success-50);
    padding: var(--space-xs) var(--space-sm);
    border-radius: 12px;
  }

  /* Card Actions */
  .card-actions {
    text-align: center;
  }

  .btn {
    padding: var(--space-md) var(--space-xl);
    border-radius: 8px;
    font-family: "Source Sans 3", sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    min-width: 200px;
    justify-content: center;
  }

  .btn-primary {
    background: var(--primary-500);
    color: var(--white);
  }

  .btn-primary:hover {
    background: var(--primary-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
  }

  .action-note {
    font-family: "Source Sans 3", sans-serif;
    font-size: 11px;
    color: var(--gray-600);
    margin-top: var(--space-sm);
    margin-bottom: 0;
  }

  /* Availability Info */
  .availability-info {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .availability-content {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }

  .availability-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .availability-description {
    font-family: "Source Sans 3", sans-serif;
    font-size: 18px;
    line-height: 1.6;
    color: var(--gray-700);
    margin-bottom: var(--space-xl);
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .timezone-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
  }

  .timezone-card {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-lg);
    text-align: center;
  }

  .timezone-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .timezone-header svg {
    color: var(--primary-600);
  }

  .timezone-name {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .timezone-hours {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .hours {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .coverage {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
  }

  /* Consultation Prep */
  .consultation-prep {
    background: linear-gradient(135deg, var(--success-25), var(--success-50));
    border: 1px solid var(--success-200);
    border-radius: 16px;
    padding: var(--space-2xl);
    margin-bottom: var(--space-4xl);
  }

  .prep-content {
    max-width: 1000px;
    margin: 0 auto;
  }

  .prep-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .prep-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-xl);
  }

  .prep-section {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-lg);
  }

  .prep-section-title {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--space-md);
  }

  .prep-list {
    margin: 0;
    padding-left: var(--space-lg);
  }

  .prep-list li {
    font-family: "Source Sans 3", sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    margin-bottom: var(--space-sm);
  }

  /* Testimonials */
  .testimonials {
    background: var(--surface-page);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: var(--space-2xl);
  }

  .testimonials-content {
    max-width: 1000px;
    margin: 0 auto;
  }

  .testimonials-title {
    font-family: "Montserrat", sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--gray-900);
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-lg);
  }

  .testimonial-card {
    background: var(--gray-25);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
  }

  .testimonial-content {
    flex: 1;
    margin-bottom: var(--space-md);
  }

  .testimonial-text {
    font-family: "Source Sans 3", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--gray-700);
    font-style: italic;
    margin: 0;
  }

  .testimonial-author {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .author-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .author-name {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .author-title {
    font-family: "Source Sans 3", sans-serif;
    font-size: 12px;
    color: var(--gray-600);
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .office-hours-section {
      padding: var(--space-3xl) 0;
    }

    .office-hours-grid {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }

    .schedule-card,
    .consultation-card {
      padding: var(--space-xl);
    }

    .time-slot {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-sm);
    }

    .time-details {
      align-items: flex-start;
    }

    .availability-info,
    .consultation-prep,
    .testimonials {
      padding: var(--space-xl);
    }

    .timezone-grid,
    .prep-grid,
    .testimonials-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .schedule-card,
    .consultation-card {
      padding: var(--space-lg);
    }

    .card-icon {
      width: 56px;
      height: 56px;
    }

    .availability-info,
    .consultation-prep,
    .testimonials {
      padding: var(--space-lg);
    }

    .availability-title,
    .prep-title,
    .testimonials-title {
      font-size: 24px;
    }

    .btn {
      width: 100%;
      min-width: auto;
    }
  }
</style>
