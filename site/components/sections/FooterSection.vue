<script setup>
  import { ref } from 'vue'
  import logoFull from "@/assets/logo-32px.svg";

  const email = ref('')
  const isSubmitting = ref(false)
  const message = ref('')

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!email.value) {
      message.value = 'Please enter your email address'
      return
    }
    
    if (!validateEmail(email.value)) {
      message.value = 'Please enter a valid email address'
      return
    }
    
    isSubmitting.value = true
    message.value = ''
    
    try {
      // TODO: Replace with actual newsletter signup API
      await new Promise(resolve => setTimeout(resolve, 800))
      message.value = 'Thank you for subscribing!'
      email.value = ''
    } catch (error) {
      message.value = 'Something went wrong. Please try again.'
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div>
        <p>Subscribe to get the latest Aris features and updates.</p>
        <form class="newsletter" @submit="handleSubmit">
          <div class="form-group">
            <input 
              type="email" 
              v-model="email"
              placeholder="Your email" 
              :disabled="isSubmitting"
              required
              aria-label="Email address for newsletter"
              class="form-input"
            />
            <button 
              type="submit" 
              :disabled="isSubmitting"
              :aria-label="isSubmitting ? 'Subscribing...' : 'Subscribe to newsletter'"
              class="btn btn-primary"
            >
              {{ isSubmitting ? 'Subscribing...' : 'Subscribe' }}
            </button>
          </div>
          <div 
            v-if="message" 
            class="form-message"
            :class="{ 'form-message--error': message.includes('Please') || message.includes('wrong') }"
          >
            {{ message }}
          </div>
        </form>
      </div>
      <div>
        <p><strong>Resources</strong></p>
        <ul>
          <li><a href="#">Documentation</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div>
        <p><strong>Connect</strong></p>
        <ul>
          <li><a href="#">Bluesky</a></li>
          <li><a href="#">LinkedIn</a></li>
          <li><a href="#">GitHub</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div>
        <p>© 2025 Aris. All rights reserved.</p>
      </div>
      <div>
        <NuxtImg 
          id="logo" 
          :src="logoFull" 
          alt="Aris logo" 
          width="30" 
          height="30" 
          format="svg" 
          loading="lazy" 
        />
      </div>
      <div>
        <ul>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Cookies</a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style scoped>
  .footer {
    background: var(--primary-950);
    color: var(--almost-white);
    padding: 3rem 1rem;
    font-size: 0.9rem;
  }

  .footer-content {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .footer-content div {
    flex: 1 1 200px;
  }

  .footer ul {
    list-style: none;
    padding: 0;
  }

  .footer a {
    color: var(--light);
    text-decoration: none;
  }

  .footer a:hover {
    text-decoration: underline;
  }

  .footer #logo {
    width: 30px;
    height: 30px;
  }

  .newsletter {
    margin-top: 1rem;
  }

  .form-group {
    display: flex;
    gap: 0.5rem;
  }

  .newsletter .form-input {
    border: none;
  }

  .newsletter .btn {
    padding: 0.5rem 1rem;
    font-weight: bold;
  }

  .form-message.form-message--error {
    background: var(--red-50);
    color: var(--red-700);
    border-color: var(--red-200);
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    border-top: var(--border-extrathin) solid var(--gray-700);
    padding-top: 1rem;
  }

  .footer-bottom > div {
    flex:1;
    display: flex;
    align-items: center;
  }

  .footer-bottom > div:nth-child(1) {
    justify-content: left;
  }

  .footer-bottom > div:nth-child(2) {
    justify-content: center;
  }

  .footer-bottom > div:nth-child(3) {
    justify-content: right;
  }

  .footer-bottom p {
    margin-bottom: 0;
  }

  .footer-bottom ul {
    display: flex;
    gap: 1rem;
  }
</style>