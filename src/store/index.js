import Vuex from 'vuex';
import Vue from 'vue';
import {addSioHandler} from './utils';
import global, {sioHandlers as handlers1} from './global';
import appshell from './appshell';
import users, {sioHandlers as handlers2} from './users';
import auth, {sioHandlers as handlers3} from './auth';
import wechatUsers, {sioHandlers as handlers4} from './wechat-users';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    global,
    appshell,
    users,
    auth,
    wechatUsers
  }
});

[handlers1, handlers2, handlers3, handlers4]
  .forEach(handlers => Object.keys(handlers)
  .forEach(key => addSioHandler(key, handlers[key].bind(store))));

export default store;
