<template>
  <q-page class="main-page">
    <quasar-logo />
    <span>Welcome to your new Quasar panel</span>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex",
  components: {
    "quasar-logo": require("src/assets/quasarLogo.vue").default
  }
};
</script>

<style>
.main-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
</style>
