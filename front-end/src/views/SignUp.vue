<template>
  <main class="sign-up-container">
    <logo-title />

    <h3 class="sign-up-title">Sign up</h3>

    <p class="terms-of-use-text">
      By signing up, I agree to the EverywhereRead‘s
    </p>

    <link-component className="terms-of-use-link"
      >Terms of service</link-component
    >

    <div class="sign-up-fields">
      <text-field
        v-model="email"
        label="Email"
        id="email-text-field"
        className="sign-up-email-text-field"
        labelClassName="sign-up-label"
      />

      <text-field
        v-model="password"
        type="password"
        label="Password"
        id="password-text-field"
        className="sign-up-password-text-field"
        labelClassName="sign-up-label"
      />

      <base-button className="sign-up-button" :onClick="handleSignUpUser">
        Sign up
      </base-button>
    </div>
  </main>
</template>

<script>
import LogoTitle from "../components/LogoTitle";
import LinkComponent from "../components/LinkComponent";
import TextField from "../components/TextField";
import BaseButton from "../components/BaseButton";

export default {
  components: {
    LogoTitle,
    LinkComponent,
    BaseButton,
    TextField,
  },
  data: () => ({
    password: "",
    email: "",
  }),
  methods: {
    async handleSignUpUser() {
      // TODO: change for using axios
      await fetch("/rest/signup", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      });
    },
  },
};
</script>

<style scoped>
main.sign-up-container {
  height: 100%;
  width: 100%;

  background: #4d5ae5;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.sign-up-title {
  font-family: Roboto;

  font-size: 36px;
  margin-top: 55px;

  color: #ffffff;
}

.terms-of-use-text {
  margin-top: 32px;
  font-family: Roboto;

  font-size: 18px;

  color: #ffffff;
}

.terms-of-use-link {
  margin-top: 8px;
}

.sign-up-fields {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sign-up-button {
  margin-top: 54px;
}

label.sign-up-label {
  color: white;
}

.text-field-container:not(:first-of-type) {
  margin-top: 16px;
}
</style>
