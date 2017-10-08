<template>
  <v-toolbar fixed dark class="primary app-header">
    <v-toolbar-side-icon v-if="$route.meta.level === 0"
      class="hidden-xs-only"
      @click.native.stop="toggleDrawer">
    </v-toolbar-side-icon>
    <v-btn v-else
           icon
           @click.native.stop="back">
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <v-toolbar-title class="white--text">
      {{$store.state.appshell.title ||
        $route.meta.title ||
        $store.state.global.title}}
    </v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
  export default {
    methods: {
      toggleDrawer() {
        const drawer = this.$store.state.appshell.drawer;
        this.$store.commit('appshell/setDrawer', !drawer);
      },
      back() {
        if (this.$route.meta.back)
          this.$router.push(this.$route.meta.back);
        else
          this.$router.back();
      }
    }
  };
</script>

<style lang="stylus">
</style>
