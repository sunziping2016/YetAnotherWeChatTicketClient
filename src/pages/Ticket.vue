<template>
  <v-container v-touch="swipeAction">
    <v-layout row justify-space-around>
      <h2>我的票夹</h2>
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
              this.$router.push('/account');
          },
          right: () => {
            if (this.$store.state.appshell.breakpoint.xs)
              this.$router.push('/');
          }
        }
      };
    }
  }
</script>
