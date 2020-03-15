<template>
  <div id="q-app">
    <Panel>
      <Menus refresh debug />
      <loading-bar position="top" ref="loader" />
      <router-view />
    </Panel>
  </div>
</template>

<script>
// Dynamic CSS variables that automatically handle all app themes and changes:
// https://github.com/Inventsable/starlette
import starlette from "starlette";

// Utility components, see here:
// https://github.com/Inventsable/lokney
import { Menus, Panel } from "lokney";
/*
  Panel component above also includes:
    - Starlette UI theme and color library: 
      https://github.com/Inventsable/starlette
    - CEP-Spy identification and app utility:
      https://github.com/Inventsable/cep-spy
 These are still installed into this panel and can be used when needed like so:
 import spy from 'cep-spy'

 NOTES: 
  - Starlette is already active in your panel! There's no need to initialize it.
  - Need CSInterface or a script? You can use the script-path attribute of Panel to launch scripts or utilities:
    https://github.com/Inventsable/lokney/tree/master/components/Panel
*/

// Dynamic identification object that reports all panel and host information:
// https://github.com/Inventsable/CEP-Spy
import spy from "cep-spy";

import { Dialog, Loading, Notify, LoadingBar } from "quasar";
import showErrorMessage from "src/functions/function-show-error-message.js";

export default {
  name: "App",
  components: {
    Menus,
    Panel,
    "loading-bar": require("src/components/panel/LoadingBar").default
  },
  data: () => ({
    // required
    csInterface: null,
    isMounted: false,
    identity: null,
    menus: null,
    // optional
    modal: null,
    loading: false,
    loadingBar: null
  }),
  watch: {
    loading(state) {
      if (state) {
        Loading.show();
      } else {
        Loading.hide();
      }
    }
  },
  computed: {
    storage() {
      return window.localStorage;
    },
    // If extensionID has "modal" we know it's not the panel:
    notModal() {
      return !/modal/.test(spy.extID);
    }
  },
  mounted() {
    this.loading = false;

    // The modal and panel share the same Vue instance.
    // If this is the modal window (we know by it's ID from manifest.xml), push it to the Modal route.
    if (!this.notModal) {
      this.$router.push({ path: "/modal" });
      // this.modal.init();
    } else {
      this.csInterface.addEventListener(
        // General a name-specific close event listener for that modal (but doesn't work if X is pressed)
        `${spy.extID.match(/.*\./)[0]}modal-close`,
        evt => {
          // Show a snackbar notification as proof we communicated and print input data to Quasar dialog
          console.log(evt);
          Dialog.create({
            title: "Text from Modal",
            message: evt.data
          });
        }
      );
    } //
    this.$q.notify.setDefaults({
      timeout: 2500,
      actions: [{ icon: "close", color: "white" }]
    });
  },
  methods: {
    notify(text) {
      this.$q.notify(text);
    },
    error(text) {
      showErrorMessage(text);
    },
    launchModal() {
      console.log(`${spy.extID.match(/.*\./)[0]}modal`);
      // Dynamically open the modal at any time
      this.csInterface.requestOpenExtension(
        `${spy.extID.match(/.*\./)[0]}modal`,
        ""
      );
    },
    dispatchEvent(name, data) {
      var event = new CSEvent(name, "APPLICATION");
      event.data = data;
      this.csInterface.dispatchEvent(event);
    },
    getCSS(prop) {
      // Returns current value of CSS variable
      // prop == typeof String as name of variable, with or without leading dashes:
      // this.getCSS('color-bg') || this.getCSS('--scrollbar-width')
      return window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(`${/^\-\-/.test(prop) ? prop : "--" + prop}`);
    },
    setCSS(prop, data) {
      // Sets value of CSS variable
      // prop == typeof String as name of variable, with or without leading dashes:
      // this.setCSS('color-bg', 'rgba(25,25,25,1)') || this.setCSS('--scrollbar-width', '20px')
      document.documentElement.style.setProperty(
        `${/^\-\-/.test(prop) ? prop : "--" + prop}`,
        data
      );
    }
  }
};
</script>

<style>
/* Quasar specific helpers. Starlette via <Panel> already takes care of CSS loading and general theme */
.q-card.q-dialog-plugin {
  background-color: var(--color-bg);
  color: var(--color-default);
}
.q-drawer {
  background: var(--color-header);
}

.q-item__label--caption {
  color: var(--color-default);
}

.q-item__label--header {
  color: var(--color-text-label);
}

.q-layout__section--marginal {
  color: var(--color-default);
}
.quasar-logo-text {
  fill: var(--color-default);
}
.q-notification {
  background-color: var(--color-header);
}
</style>
