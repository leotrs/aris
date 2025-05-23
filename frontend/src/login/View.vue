<script setup>
  import {} from "vue";
  import { useRouter } from "vue-router";

  const router = useRouter();

  const onLogin = () => {
    router.push("/");
  };
</script>

<template>
  <div class="view">
    <div class="left">
      <div class="logo"></div>
      <div class="tagline">
        <p>Scientific publishing.</p>
        <p>Web-native. Human-first</p>
      </div>
    </div>
    <div class="right">
      <div class="wrapper">
        <div class="top">
          <label>Email</label>
          <input type="text" />
          <label>Password</label>
          <input type="password" />
          <div class="forgot"><p>Forgot password?</p></div>
        </div>
        <div class="bottom">
          <Button kind="primary" text="Login" @click="onLogin" />
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
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
  }

  .right .wrapper {
    width: 60%;
  }

  .right .wrapper .top {
    display: flex;
    flex-direction: column;
  }

  .right .bottom button {
    width: 100%;
  }
</style>
