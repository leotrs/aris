<script setup>
  import { ref, inject } from "vue";
  import { useRouter } from "vue-router";
  import { createFileStore } from "../FileStore.js";

  const router = useRouter();
  const email = ref("");
  const password = ref("");
  const isLoading = ref(false);
  const error = ref("");
  const api = inject("api");

  const user = inject("user");
  const fileStore = inject("fileStore");
  const onLogin = async () => {
    if (!email.value || !password.value) {
      error.value = "Please fill in all fields";
      return;
    }

    isLoading.value = true;
    error.value = "";
    try {
      const response = await api.post("/login", {
        email: email.value,
        password: password.value,
      });
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);

      const userData = await api.get("/me");
      user.value = userData.data;

      fileStore.value = createFileStore(api, user.value);
      await fileStore.value.loadFiles();
      await fileStore.value.loadTags();

      router.push("/");
    } catch (err) {
      error.value = err.response?.data?.detail || err.message || "Login failed";
    } finally {
      isLoading.value = false;
    }
  };
</script>

<template>
  <div class="view">
    <!-- <div class="left">
         <div class="logo"></div>
         <div class="tagline">
         <p>Scientific publishing.</p>
         <p>Web-native. Human-first</p>
         </div>
         </div> -->
    <div class="right">
      <div class="wrapper">
        <div class="top">
          <div class="text-input">
            <label class="text-label">Email</label>
            <input v-model="email" type="text" />
          </div>
          <div class="text-input">
            <label class="text-label">Password</label>
            <input v-model="password" type="password" />
            <div class="footer text-caption"><p>Forgot password?</p></div>
          </div>
        </div>
        <div class="bottom">
          <div v-if="error" class="error-message">{{ error }}</div>
          <Button
            kind="primary"
            :text="isLoading ? 'Logging in...' : 'Login'"
            :disabled="isLoading"
            @click="onLogin"
          />
          <Button kind="secondary" text="Register" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .view {
    --transition-duration: 0.3s;

    display: flex;
    flex-grow: 2;
    height: 100%;
    width: 100%;
  }

  .left {
    background-color: var(--information-50);
    height: 100%;
    width: 50%;
  }

  .right {
    background-color: var(--surface-primary);
    height: 100%;
    /* width: 50%; */
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .right .wrapper {
    width: 60%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;

    & > * {
      width: 100%;
    }
  }

  .right .wrapper .top {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .right .bottom {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .right .bottom button {
    width: 100%;

    & :deep(.btn-text) {
      margin: 0 auto;
    }
  }

  .text-input {
    display: flex;
    flex-direction: column;
  }

  .text-input label {
    padding-left: 8px;
  }

  .text-input input {
    height: 36px;
    background-color: transparent;
    border-radius: 12px;
    border: var(--border-thin) solid var(--border-primary);
    padding-inline: 8px;
  }

  .text-input input:focus-visible {
    background-color: var(--white);
    border-color: var(--border-action);
  }

  .text-input .footer {
    margin-top: 4px;
    padding-left: 8px;
  }
</style>
