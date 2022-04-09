<template>
  <base-button
    type="primary"
    className="logout-button"
    :onClick="handleLogOutUser"
  >
    Log out
  </base-button>
</template>

<script>
import BaseButton from "../components/BaseButton";
import axios from "axios";

export default {
  components: {
    BaseButton,
  },
  methods: {
    async handleLogOutUser() {
      try {
        const { data: { redirect } } = await axios.post("/rest/logout");

        this.$router.go(redirect);
      } catch (error) {
        console.error('Error while trying to logout', error);
      }
    },
  },
};
</script>

<style scoped></style>
