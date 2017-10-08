<template>
  <v-container v-touch="swipeAction">
    <v-layout row justify-space-around>
      <h2>主页</h2>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        swipeAction: {
          left: () => {
            if (this.$store.state.appshell.breakpoint.xs)
              this.$router.push('/ticket');
          }
        }
      };
    }
  }
</script>
