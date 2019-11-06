<template>
  <q-layout view="hHh lpR fFf">
    <toolbar @openDrawer="leftDrawerOpen = !leftDrawerOpen" />

    <drawer :leftDrawerOpen="leftDrawerOpen" />

    <q-footer class="q-pr-md q-pa-xs justify-right">
      <!-- <q-space></q-space> -->
      <div class="text-right">{{ extVersion }}</div>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import getExtVersion from "src/utils/main/getExtVersion";

export default {
  name: "MyLayout",
  components: {
    drawer: require("components/panel/Drawer.vue").default,
    toolbar: require("components/panel/Toolbar.vue").default
  },
  data: () => ({
    leftDrawerOpen: false
  }),
  computed: {
    extVersion() {
      return getExtVersion();
    }
  }
};
</script>

<style>
.q-layout__section--marginal {
  background-color: var(--color-header);
}
</style>
