<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen-withnav">
          <v-list>
            <v-list-tile class="account-header" exact
                         :to="user ? '/account/info' : '/account/login'">
              <v-avatar size="64px">
                <img v-if="avatar" :src="avatar" alt="avatar">
                <icon v-else name="user-circle" scale="4"></icon>
              </v-avatar>
              <v-list-tile-content v-if="!user">
                <v-list-tile-title>登录</v-list-tile-title>
                <v-list-tile-sub-title>登录后参与抢票</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content v-else>
                <v-list-tile-title>{{user.username}}</v-list-tile-title>
                <v-list-tile-sub-title>点击查看个人信息</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-subheader>个人</v-subheader>
            <v-list-tile v-if="!user" exact to="/account/register">
              <v-list-tile-avatar>
                <v-icon>person_add</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>注册</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile v-if="user && !user.wechatId" @click.stop="onBindWechat">
              <v-list-tile-avatar>
                <v-icon>compare_arrows</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>绑定微信</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="user && !user.wechatId" :inset="true"></v-divider>
            <v-list-tile @click="">
              <v-list-tile-avatar>
                <v-icon>settings</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>设置</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-subheader>帮助</v-subheader>
            <v-list-tile @click="">
              <v-list-tile-avatar>
                <v-icon>info</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>新手指南</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider :inset="true"></v-divider>
            <v-list-tile @click="">
              <v-list-tile-avatar>
                <v-icon>help</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>常见问题</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import 'vue-awesome/icons/user-circle';
  export default {
    computed: {
      user() {
        return this.$store.getters['auth/user']
      },
      wechatUser() {
        return this.$store.getters['auth/wechatUser'];
      },
      avatar() {
        return this.$store.getters['auth/avatarThumbnail'];
      }
    },
    methods: {
      onBindWechat() {
        this.$store.commit('appshell/setBindWechatDialog', 1);
      }
    }
  };
</script>

<style lang="stylus">
  .account-header
    height 100px
    .avatar
      margin-right 16px
    .list__tile
      height 100%
    .list__tile__title
      font-size 24px
      line-height 32px
      height 32px
    .list__tile__sub-title
      font-size 16px
      line-height 24px
      height 24px
</style>
