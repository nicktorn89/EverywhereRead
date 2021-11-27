<template>
  <div :class="['text-field-container', className]">
    <label :for="id" :class="['text-field-label', labelClassName]">{{ label }}</label>

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
    labelClassName: String,
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

  background: #ffffff;
  border: 1.5px solid #c4c6cb;
  box-sizing: border-box;
  border-radius: 3px;

  outline: none;
}

.text-field-input:focus {
  border-color: hsl(197, calc(var(--saturation-factor, 1) * 100%), 47.8%);
}
</style>
