<template>
  <modal name="login-modal" classes="login-modal" height="435" width="427">
    <h2 class="login-modal-title">Login in your account</h2>

    <div class="login-modal-fields-container">
      <text-field
        v-model="login"
        label="Username"
        id="login-text-field"
        className="login-text-field"
      />

      <text-field
        v-model="password"
        type="password"
        label="Password"
        id="password-text-field"
        className="password-text-field"
      />
    </div>

    <base-button
      type="primary"
      className="login-modal-button"
      :onClick="handleLoginUser"
      >Login</base-button
    >
  </modal>
</template>

<script>
import TextField from "./TextField";
import BaseButton from "./BaseButton";
import axios from "axios";

export default {
  name: "TheLoginModal",
  components: {
    TextField,
    BaseButton,
  },
  props: {
    onOpen: Function,
  },
  data: () => ({
    login: "",
    password: "",
  }),
  methods: {
    async handleLoginUser() {
      try {
        const {
          data: { redirect },
        } = await axios.post(
          "/rest/login",
          {
            email: this.login,
            password: this.password,
          },
          {
            withCredentials: true,
          }
        );

        this.$router.go(redirect);
      } catch (error) {
        console.error("Error while trying to login", error);
      }
    },
  },
};
</script>

<style>
.login-modal {
  display: flex;
  flex-direction: column;

  justify-content: space-between;
  padding: 10px 0;
}

.login-modal-fields-container {
  display: flex;
  flex-direction: column;

  padding-left: 38px;
  box-sizing: border-box;
  height: 240px;
}

.login-modal-title {
  font-size: 30px;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;

  margin-left: 38px;
}

.login-modal-button {
  margin-left: 38px;
}

.login-text-field {
  margin-bottom: 20px;
}
</style>
