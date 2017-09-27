<template>
  <v-navigation-drawer
    persistent light enable-resize-watcher
    :mini-variant.sync="mini" v-model="drawer" overflow>
    <v-list three-line>
      <v-list-tile avatar tag="div">
        <v-list-tile-avatar>
          <icon name="user-circle-o" scale="2"></icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{'登录'}}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon @click.native.stop="mini = !mini">
            <v-icon>{{ `chevron_${mini ? 'right' : 'left'}` }}</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-list>
      <v-divider></v-divider>
      <v-list-tile exact to="/" @click.native.stop>
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>主页</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  import 'vue-awesome/icons/user-circle-o';

  export default {
    computed: {
      drawer: {
        get() {
          return this.$store.state.appshell.drawer;
        },
        set(value) {
          if (value !== this.drawer)
            this.$store.commit('appshell/setDrawer', value);
        }
      },
      mini: {
        get() {
          return this.$store.state.appshell.drawerMini;
        },
        set(value) {
          if (value !== this.mini)
            this.$store.commit('appshell/setDrawerMini', value);
        }
      }
    },
    mounted() {
      this.drawer = window.innerWidth > 1024;
    }
  }
</script>

<style lang="stylus">
  .avatar .fa-icon
    color rgba(0,0,0,0.54)!important
  @media (max-width: 1424px) and (orientation: landscape)
    .navigation-drawer--mini-variant {
      margin-top: 64px!important;
      max-height: calc(100vh - 64px)!important;
    }
  .clickable
    cursor pointer
</style>
