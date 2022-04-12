<template>
  <div>
    <input type="file" name="book-upload" @change="handleChangeInputFile" />

    <base-button
      className="save-book-button"
      type="primary"
      :onClick="handleSaveBook"
    >
      Save book
    </base-button>
  </div>
</template>

<script>
import BaseButton from "./BaseButton";
import axios from "axios";

export default {
  name: "TheAttachBook",
  components: {
    BaseButton,
  },
  data() {
    return {
      file: null,
    };
  },
  methods: {
    handleChangeInputFile(e) {
      if (e.currentTarget.files && e.currentTarget.files[0]) {
        this.file = e.currentTarget.files[0];
      }
    },
    async handleSaveBook() {
      try {
        const formData = new FormData();

        formData.append("data", this.file);

        await axios.post("/rest/books", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.error("Error while saving book", error);
      }
    },
  },
};
</script>
