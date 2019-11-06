<template>
  <div id="q-app">
    <identity />
    <menus />
    <loading-bar position="top" ref="loader" />
    <router-view />
  </div>
</template>

<script>
// Dynamic CSS variables that automatically handle all app themes and changes:
// https://github.com/Inventsable/starlette
import starlette from "starlette";

import { Dialog, Loading, Notify, LoadingBar } from "quasar";
import showErrorMessage from "src/functions/function-show-error-message.js";

export default {
  name: "App",
  components: {
    identity: require("src/components/dev/identity.vue").default,
    menus: require("src/components/dev/menus.vue").default,
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
      return this.identity ? !/modal/.test(this.identity.extID) : null;
    }
  },
  mounted() {
    console.clear();
    starlette.init();
    this.loading = false;
    this.csInterface = new CSInterface();
    this.csInterface.addEventListener("console", this.consoler);

    // Utility components already mounted prior to this
    console.log(
      `${this.identity.extName} ${this.identity.extVersion} : ${
        this.identity.isDev ? "DEV" : "BUILD"
      }`
    );

    // The modal and panel share the same Vue instance.
    // If this is the modal window (we know by it's ID from manifest.xml), push it to the Modal route.
    if (!this.notModal) {
      this.$router.push({ path: "/modal" });
      // this.modal.init();
    } else {
      this.csInterface.addEventListener(
        // General a name-specific close event listener for that modal (but doesn't work if X is pressed)
        `${this.identity.extID.match(/.*\./)[0]}modal-close`,
        evt => {
          // Show a snackbar notification as proof we communicated and print input data to Quasar dialog
          console.log(evt);
          Dialog.create({
            title: "Text from Modal",
            message: evt.data
          });
        }
      );
    }
    this.loadUniversalScripts();
    //
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
      console.log(`${this.identity.extID.match(/.*\./)[0]}modal`);
      // Dynamically open the modal at any time
      this.csInterface.requestOpenExtension(
        `${this.identity.extID.match(/.*\./)[0]}modal`,
        ""
      );
    },
    dispatchEvent(name, data) {
      var event = new CSEvent(name, "APPLICATION");
      event.data = data;
      this.csInterface.dispatchEvent(event);
    },
    loadScript(path) {
      // Correctly loads a script regardless of whether Animate or regular CEP app
      if (!/FLPR/.test(this.identity.appName))
        this.csInterface.evalScript(`$.evalFile('${path}')`);
      else
        this.csInterface.evalScript(
          `fl.runScript(FLfile.platformPathToURI("${path}"))`
        );
    },
    loadUniversalScripts() {
      // Preloads any script located inside ./src/host/universal
      let utilFolder = window.cep.fs.readdir(
        `${this.identity.root}/src/host/universal/`
      );
      if (!utilFolder.err) {
        let valids = utilFolder.data.filter(file => {
          return /\.(jsx|jsfl)$/.test(file);
        });
        valids.forEach(file => {
          this.loadScript(`${this.identity.root}/src/host/universal/${file}`);
        });
      }
      // Preloads any script located in ./src/host/[appName]/
      let hostFolder = window.cep.fs.readdir(
        `${this.identity.root}/src/host/${this.identity.appName}/`
      );
      if (!hostFolder.err) {
        let valids = hostFolder.data.filter(file => {
          return /\.(jsx|jsfl)$/.test(file);
        });
        valids.forEach(file => {
          this.loadScript(
            `${this.identity.root}/src/host/${this.identity.appName}/${file}`
          );
        });
      } else {
        console.log(
          `${this.identity.root}/src/host/${this.identity.appName} has no valid files or does not exist`
        );
      }
    },
    consoler(msg) {
      // Catches all console.log() usage in .jsx files via CSEvent
      console.log(`${this.identity.appName}: ${msg.data}`);
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
@import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");
:root {
  --quad: cubic-bezier(0.48, 0.04, 0.52, 0.96);
  --quart: cubic-bezier(0.76, 0, 0.24, 1);
  --quint: cubic-bezier(0.84, 0, 0.16, 1);
  --toolbar-height: 48px;
  --bottombar-height: 30px;

  background-color: var(--color-bg);
  color: var(--color-default);
  font-family: "Open Sans", sans-serif;
}

body::-webkit-scrollbar {
  width: 16px;
}
#app::-webkit-scrollbar {
  display: block;
  width: 16px;
}
::-webkit-scrollbar {
  background-color: var(--color-scrollbar);
  width: 16px;
}
::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar-thumb);
  border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-scrollbar-thumb-hover);
}
::-webkit-scrollbar-resizer {
  display: none;
}
::-webkit-scrollbar-button {
  height: 0px;
}

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
