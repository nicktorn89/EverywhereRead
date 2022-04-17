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

    <base-button
      className="delete-book-button"
      type="primary"
      :onClick="handleDeleteBook"
    >
      Delete book
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
  props: {
    userBookId: String,
    onRefresh: Function,
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
    async handleDeleteBook() {
      try {
        await axios.delete(`/rest/books/${this.userBookId}`);

        this.onRefresh();
      } catch (error) {
        console.error("Error while deleting book", error);
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

        this.onRefresh();
      } catch (error) {
        console.error("Error while saving book", error);
      }
    },
  },
};
</script>
