<template>
  <div>
  <base-button
    type="primary"
    className="logout-button"
    :onClick="handleLogOutUser"
  >
    Log out
  </base-button>

  <the-attach-book :onChange="handleChangeInputFile" />
  <div/>
</template>

<script>
import BaseButton from "../components/BaseButton";
import axios from "axios";
import TheAttachBook from "../components/TheAttachBook.vue";

export default {
  components: {
    BaseButton,
    TheAttachBook,
  },
  methods: {
    async handleLogOutUser() {
      try {
        const {
          data: { redirect },
        } = await axios.post("/rest/logout");

        this.$router.go(redirect);
      } catch (error) {
        console.error("Error while trying to logout", error);
      }
    },
  },
};
</script>

<style scoped></style>
