<template>
    <h1 :class='["logo-title", className]'>
        EverywhereRead
    </h1>
</template>

<script>
export default {
    name: 'LogoTitle',
    data: () => ({}),
    props: {
      className: String,
    }
}
</script>

<style scoped>
  h1.logo-title {
    font-family: Georama, sans-serif;
    font-weight: 600;
    font-size: 48px;

    color: #FFFFFF;

    margin-top: 172px;

    user-select: none;
  }
</style>