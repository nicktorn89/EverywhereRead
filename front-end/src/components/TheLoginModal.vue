<template>
  <modal name="login-modal">
    <h2 class="login-modal-title">Login in your account</h2>

    <text-field
      v-model="login"
      label="Username or email"
      id="login-text-field"
    />

    <text-field
      v-model="password"
      type="password"
      label="Password"
      id="password-text-field"
    />
  </modal>
</template>

<script>
import TextField from "./TextField";

export default {
  name: "TheLoginModal",
  components: {
    TextField,
  },
  props: {
    onOpen: Function,
  },
  data: () => ({
    login: "",
    password: "",
  }),
};
</script>

<style scoped></style>
