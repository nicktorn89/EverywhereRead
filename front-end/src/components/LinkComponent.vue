<template>
  <a :class="['link-item', className]" :href="url">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: "LinkComponent",
  props: {
    url: {
      type: String,
      default: "#",
    },
    className: String,
  },
};
</script>

<style scoped>
.link-item {
  font-family: Roboto;
  font-size: 18px;

  text-align: center;
  text-decoration-line: underline;

  color: #ffffff;
}
</style>
