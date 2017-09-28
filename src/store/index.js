import Vuex from 'vuex';
import Vue from 'vue';
import global from './global';
import appshell from './appshell';
import users from './users';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    global,
    appshell,
    users
  }
});
