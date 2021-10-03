<template>
  <button :class='[buttonType, className]' @click='handleClick'>
    <span class="inner-text">{{ text }}</span>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    type: String,
    text: String,
    onClick: Function,
    className: String,
  },
  computed: {
    buttonType: function() {
      const baseClass = 'base-button';

      if (this.type === 'primary') return baseClass + ' primary-button';

      return baseClass + ' secondary-button';
    },
  },
  methods: {
    handleClick: function() {
      this.onClick();
    },
  },
};
</script>

<style scoped>
.base-button {
  max-width: 100%;
  width: 215px;
  height: 56px;
  border-radius: 28px;
  outline: none;
  border: none;
  cursor: pointer;
}

.primary-button {
  background: #282c35;
}

.secondary-button {
  background: #fff;
}

.inner-text {
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}

.primary-button > .inner-text {
  color: #fff;
}

.secondary-button > .inner-text {
  color: #282c35;
}
</style>
