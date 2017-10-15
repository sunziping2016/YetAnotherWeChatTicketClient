<template>
  <div class="bg-color">
    <v-container class="xs-pa-0">
      <v-layout column>
        <v-flex v-if="menu !== null && available !== null"
                xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
          <v-card class="xs-fullscreen">
            <v-list>
              <v-subheader>微信抢票菜单</v-subheader>
              <template v-for="(item,i) in menu">
                <v-divider v-if="i != 0"></v-divider>
                <v-list-tile :key="item + 'menu'" class="wechat-menu-tile">
                  <v-list-tile-content>
                    <v-list-tile-title>{{item}}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn icon :ripple="false"
                           :disabled="i === menu.length - 1"
                           @click="menu.splice(i + 1, 0, menu.splice(i, 1)[0])"
                    >
                      <v-icon>keyboard_arrow_down</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                  <v-list-tile-action>
                    <v-btn icon :ripple="false"
                           :disabled="i === 0"
                           @click="menu.splice(i - 1, 0, menu.splice(i, 1)[0])"
                    >
                      <v-icon>keyboard_arrow_up</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                  <v-list-tile-action>
                    <v-btn icon :ripple="false"
                           @click="menu.splice(i, 1)"
                    >
                      <v-icon>remove</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
              <v-subheader>可用抢票菜单</v-subheader>
              <template v-for="(item,i) in realAvailable">
                <v-divider v-if="i != 0"></v-divider>
                <v-list-tile :key="item + 'available'">
                  <v-list-tile-content>
                    <v-list-tile-title>{{item}}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn icon :ripple="false"
                           :disabled="menu.length >= 5"
                           @click="menu.push(item)"
                    >
                      <v-icon>add</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex v-else class="pa-2">
          <v-layout justify-space-around>
            <v-progress-circular indeterminate>
            </v-progress-circular>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-btn
        v-if="menu !== null && available !== null"
        class="save-btn"
        dark
        absolute
        right
        fab
        primary
        @click="onSave"
        :disabled="loading"
        :loading="loading"
      >
        <v-icon>save</v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'wechatMenu',
    data() {
      return {
        menu: null,
        available: null,
        loading: false
      };
    },
    computed: {
      user() {
        return this.$store.getters['auth/user']
      },
      realAvailable() {
        return this.available.filter(x => this.menu.indexOf(x) === -1);
      }
    },
    watch: {
      user() {
        if (this.user)
          this.fetchMenuAndAvailable();
      }
    },
    methods: {
      fetchMenuAndAvailable() {
        if (this.user) {
          this.$store.dispatch('global/getWechatMenu').then(data => {
            this.menu = data.menu;
            this.available = data.available;
          }).catch(err => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
          });
        }
      },
      onSave() {
        this.loading = true;
        this.$store.dispatch('global/setWechatMenu', this.menu).then(data => {
          this.$store.commit('appshell/addSnackbarMessage', '成功更新微信菜单！');
          return this.$store.dispatch('global/getWechatMenu');
        }).then(data => {
          this.menu = data.menu;
          this.available = data.available;
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        }).then(() => {
          this.loading = false;
        });
      },
    },
    mounted() {
      this.fetchMenuAndAvailable()
    }
  };
</script>

<style lang="stylus" scoped>
  .save-btn
    bottom 16px
</style>

<style lang="stylus">
  .wechat-menu-tile
    .list__tile__action
      min-width 36px
</style>
