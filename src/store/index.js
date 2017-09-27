import Vuex from 'vuex';
import Vue from 'vue';
import appshell from './appshell';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    appshell
  }
});
