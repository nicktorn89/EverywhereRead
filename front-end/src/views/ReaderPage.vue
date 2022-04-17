<template>
  <div>
  <base-button
    type="primary"
    className="logout-button"
    :onClick="handleLogOutUser"
  >
    Log out
  </base-button>

  <the-attach-book 
    :onChange="handleChangeInputFile" 
    :userBookId="userBookId"
    :onRefresh="getUserBook"
   />

  <the-reader :userBookId="userBookId" :userImages="userImages" />
  <div/>
</template>

<script>
import BaseButton from "../components/BaseButton";
import axios from "axios";
import TheAttachBook from "../components/TheAttachBook.vue";
import TheReader from "../components/TheReader.vue";

export default {
  components: {
    BaseButton,
    TheAttachBook,
    TheReader,
  },
  data: () => ({
    userBookId: "",
    isFormatted: false,
    userImages: [],
  }),
  mounted() {
    this.getUserBook();
  },
  methods: {
    async getUserBook() {
      try {
        const { data } = await axios.get("/rest/books");

        this.userBookId = data.userBookId;

        this.isFormatted = data.isFormatted;
        this.userImages = data.isFormatted ? data.userImages : [];
      } catch (error) {
        console.error("Error while getting user book");
      }
    },
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
