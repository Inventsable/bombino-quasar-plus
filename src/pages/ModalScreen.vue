<template>
  <q-page class="flex flex-center">
    <span class="text-h4">Whatchu think?</span>
    <slottie id="mango" />
    <div style="width: 100%;" class="q-px-xl">
      <q-input
        class="row"
        dark
        bottom-slots
        v-model="text"
        label="Send text to panel"
      >
        <template v-slot:after>
          <q-btn round dense flat icon="send" @click="submit" />
        </template>
      </q-input>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Modal",
  components: {
    slottie: require("components/panel/slottie.vue").default
  },
  computed: {
    app() {
      return this.$root.$children[0];
    }
  },
  data: () => ({
    text: ""
  }),
  mounted() {
    console.log("Hello world");
    this.recolorMangoBG();
    //
    // Since this shares the same Vue instance, we have access to everything in App.vue.
    // If you've defined other routes/components as properties or data within App, you
    // have full range of motion between your Modal and Panel extensions and can grab/send data between.
    //
    this.app.modal = this;
    //
    // This is meant to send an event to the panel when the modal closes (when X is pressed)
    this.app.csInterface.addEventListener(
      "com.adobe.csxs.events.WindowVisibilityChanged",
      //
      // Results are unreliable, it's best not to freeze or rely on the modal's state in the event
      // the user might manually close it rather than let you programmatically do so.
      evt => {
        this.app.dispatchEvent(
          `${this.app.identity.extID.match(/.*\./)[0]}modal-close`,
          null
        );
      }
    );
  },
  methods: {
    init() {
      this.recolorMangoBG();
    },
    recolorMangoBG() {
      // Restyle our cute Mango note-taker so the background matches Starlette
      let targ = document.getElementById("mango").children[0].children[0]
        .children[1].children[0].children[0].children[0];
      targ.style.fill = this.app.getCSS("color-bg");

      // When using the overlay for the panel, oddly sending the event only works in this section.

      // Force the input to appear having focus so the user can begin to type instantly.
      // this.$nextTick(() => this.$refs.input.focus());
    },
    getTextColor() {
      return this.app.getCSS("color-default");
    },
    submit() {
      if (this.text.length) this.textMe();
    },
    textMe() {
      // Send the content inside the textarea back to the panel and close the extension (e.g., return user to panel)
      this.app.dispatchEvent(
        `${this.app.identity.extID.match(/.*\./)[0]}modal-close`,
        this.text
      );
      // Clear the contents of the modal and any state before closing.
      this.text = "";
      // Force the modal extension to close
      this.app.csInterface.closeExtension();
    }
  }
};
</script>
