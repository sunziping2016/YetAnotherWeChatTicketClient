<template>
  <v-app toolbar id="app" v-resize="onResize">
    <app-drawer></app-drawer>
    <app-header></app-header>
    <main>
      <div class="outer-frame">
        <transition appear
                    :name="transitionName"
                    :mode="transitionMode">
          <keep-alive
            include="home,bindEmail,register,drafts,tickets">
            <router-view class="inner-frame"
            ></router-view>
          </keep-alive>
        </transition>
      </div>
      <bottom-navigation class="hidden-sm-and-up"></bottom-navigation>
    </main>
    <app-snackbar></app-snackbar>
    <bind-wechat-dialog></bind-wechat-dialog>
  </v-app>
</template>

<script>
  import Breakpoint from 'vuetify/src/util/breakpoint';

export default {
  mixins: [Breakpoint],
  computed: {
    transitionName() {
      return this.$store.state.appshell.routerTransition;
    },
    transitionMode() {
      if (this.transitionName === 'slide-y')
        return 'out-in';
      return '';
    }
  },
  watch: {
    breakpoint() {
      this.$store.commit('appshell/updateBreakpoint', this.breakpoint);
    }
  }
};
</script>

<style lang="stylus">
  @import './assets/global'

  html
    overflow-y auto!important

  .bg-color
    background-color #fafafa

  .outer-frame
    position relative
  &>.inner-frame
    position absolute
    left 0
    right 0
    background-color #fafafa

  input:-webkit-autofill
    -webkit-box-shadow 0 0 0 30px white inset;

  .slide-y
    &-enter-active, &-leave-active
      transition $primary-transition
    &-enter, &-leave-to
      opacity 0
      transform translateY(40px)

  .slide-left
    &-enter-active, &-leave-active
      transition $primary-transition
    &-enter, &-leave-to
      opacity 0
    &-leave-to
      transform translate(-100%, 0)
    &-enter
      transform translate(100%, 0)

  .slide-right
    &-enter-active, &-leave-active
      transition $primary-transition
    &-enter, &-leave-to
      opacity 0
    &-leave-to
      transform translate(100%, 0)
    &-enter
      transform translate(-100%, 0)

  @media $display-breakpoints.xs-only
    .xs-pa-0
      padding 0
    .xs-pa-1
      padding 8px
    .xs-pa-2
      padding 16px
    .xs-fullscreen
      min-height calc(100vh - 56px)
    .xs-fullscreen-withnav
      min-height calc(100vh - 56px)
      padding-bottom 56px

</style>
