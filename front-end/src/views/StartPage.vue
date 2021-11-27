<template>
  <main class="start-page-container">
    <logo-title />

    <the-description />

    <div class="start-page-buttons-container">
      <base-button
        className="login-button"
        type="primary"
        :onClick="handleOpenModal"
      >
        Login
      </base-button>

      <base-button className="sign-up-button" :onClick="redirectToSignUp">
        Sign Up
      </base-button>
    </div>

    <the-login-modal />
  </main>
</template>

<script>
import LogoTitle from "../components/LogoTitle";
import TheDescription from "../components/TheDescription";
import BaseButton from "../components/BaseButton";
import TheLoginModal from "../components/TheLoginModal";

export default {
  name: "StartPage",
  components: {
    LogoTitle,
    TheDescription,
    BaseButton,
    TheLoginModal,
  },
  methods: {
    redirectToSignUp() {
      this.$router.push("signup");
    },
    handleOpenModal() {
      this.$modal.show("login-modal");
    },
    handleCloseModal() {
      this.$modal.hide("login-modal");
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
