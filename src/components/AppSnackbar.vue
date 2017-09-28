<template>
  <v-snackbar v-model="snackbar"
              :timeout="message.timeout || 6000">
    {{ message.content || '' }}
    <v-btn flat
           :class="message.actionClass || 'pink--text'"
           @click.native="handleClick">
      {{ message.actionText || '关闭' }}
    </v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    computed: {
      message() {
        return this.$store.state.appshell.snackbarMessages[0] || {};
      },
      messageLength() {
        return this.$store.state.appshell.snackbarMessages.length;
      },
      snackbar: {
        get() {
          return this.$store.state.appshell.snackbar;
        },
        set(value) {
          if (value !== this.snackbar)
            this.$store.commit('appshell/setSnackbar', value);
        }
      }
    },
    methods: {
      handleClick() {
        this.snackbar = false;
        if (this.message.callback)
          this.message.callback();
      }
    },
    watch: {
      messageLength(value) {
        if (value)
          this.snackbar = !this.snackbar;
      },
      snackbar(value) {
        if (!value)
          setTimeout(() => {
            this.$store.commit('appshell/popSnackbarMessage');
          }, 440);
      }
    }
  };
</script>
