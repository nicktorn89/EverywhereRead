<template>
  <main class="start-page-container">
    <logo-title />

    <the-description />

    <div class="start-page-buttons-container">
      <base-button text="Login" className="login-button" type="primary" />
      <base-button text="Sign Up" className="sign-up-button" :onClick="redirectToSignUp" />
    </div>
  </main>
</template>

<script>
import LogoTitle from "../components/LogoTitle";
import TheDescription from "../components/TheDescription";
import BaseButton from "../components/BaseButton";

export default {
  name: "StartPage",
  components: {
    LogoTitle,
    TheDescription,
    BaseButton,
  },
  methods: {
    redirectToSignUp: function() {
      this.$router.push('signup');
    },
  },
};
</script>

<style scoped>
main.start-page-container {
  height: 100%;
  width: 100%;

  background: #4d5ae5;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.start-page-buttons-container {
  margin-top: 130px;

  display: flex;
  flex-direction: column;
}

.sign-up-button {
  margin-top: 27px;
}
</style>
