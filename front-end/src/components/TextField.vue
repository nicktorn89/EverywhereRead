<template>
  <div :class="['text-field-container', className]">
    <label :for="id" class="text-field-label">{{ label }}</label>

    <input
      class="text-field-input"
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
    className: String,
  },
};
</script>

<style scoped>
.text-field-container {
  display: flex;
  flex-direction: column;
}

.text-field-label {
  font-family: Roboto;
  font-size: 18px;

  color: #000000;

  margin-bottom: 16px;
}

.text-field-input {
  height: 40px;
  width: 260px;

  background: #FFFFFF;
  border: 1.5px solid #C4C6CB;
  box-sizing: border-box;
  border-radius: 3px;
}
</style>
