<template>
  <v-bottom-nav :value="$route.meta.level === 0" fixed
                :active.sync="currentTab" class="white">
    <v-btn v-for="tab in tabs"
           :key="tab.path"
           flat class="primary--text" :value="tab.route">
      <span>{{tab.text}}</span>
      <v-icon>{{tab.icon}}</v-icon>
    </v-btn>
  </v-bottom-nav>
</template>

<script>
  export default {
    data () {
      return {
        tabs: [
          {text: '首页', icon: 'home', route: 'home'},
          {text: '我的票夹', icon: 'collections_bookmark', route: 'ticket'},
          {text: '账户', icon: 'account_circle', route: 'account'}
        ],
      };
    },
    computed: {
      currentTab: {
        get() {
          return this.$route.name;
        },
        set(route) {
          this.$router.push({name: route});
        }
      }
    }
  }
</script>

<style lang="stylus">
  .bottom-navigation
    z-index 2
</style>
