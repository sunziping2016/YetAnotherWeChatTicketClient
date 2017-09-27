<template>
  <v-app toolbar id="app">
    <app-drawer class="hidden-xs-only"></app-drawer>
    <app-header></app-header>
    <main>
      <transition appear
                  :name="$store.state.appshell.routerTransition"
                  mode="out-in">
        <router-view></router-view>
      </transition>
      <bottom-navigation class="hidden-sm-and-up"></bottom-navigation>
    </main>
    <!--<app-snackbar></app-snackbar>-->
  </v-app>
</template>

<style lang="stylus">
  @import './assets/global'

  html
    overflow-y auto!important

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
    &-leave-to
      transform translate(-100%, 0)
    &-enter
      transform translate(100%, 0)

  .slide-right
    &-enter-active, &-leave-active
      transition $primary-transition
    &-leave-to
      transform translate(100%, 0)
    &-enter
      transform translate(-100%, 0)
</style>
