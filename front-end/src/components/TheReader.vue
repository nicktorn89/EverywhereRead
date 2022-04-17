<template>
  <main class="reader-container">
    <div class="reader-inner">
      <img
        v-for="image in userImages"
        :key="image"
        :src="image"
        loading="lazy"
      />
    </div>
  </main>
</template>

<script>
export default {
  name: "TheReader",
  props: {
    userBookId: String,
    originalName: String,
    userImages: Array,
  },
};
</script>

<style scoped>
.reader-container {
  padding: 0 30%;
}

.reader-inner {
  display: flex;

  flex-direction: column;
}
</style>