<template>
  <img
    :src='imageUrl'
    :class='["image-wrapper", className]'
    :alt='altText'
    draggable='false'
  />
</template>

<script>
export default {
  name: 'ImageWrapper',
  props: {
    className: String,
    imageUrl: String,
    altText: {
      type: String,
      default: '',
    }
  },
}
</script>

<style scoped>
  .image-wrapper {
    user-select: none;
  }
</style>