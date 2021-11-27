<template>
  <div>
    <label :for="id">{{ label }}</label>

    <input
      :id="id"
      :type="type"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "TextField",
  props: {
    id: String,
    placeholder: String,
    label: String,
    value: String,
    type: String,
  },
};
</script>

<style scoped></style>
