import Vuex from 'vuex';
import Vue from 'vue';
import {addSioHandler} from './utils';
import global, {sioHandlers as handlers1} from './global';
import appshell from './appshell';
import users, {sioHandlers as handlers2} from './users';
import auth, {sioHandlers as handlers3} from './auth';
import wechatUsers, {sioHandlers as handlers4} from './wechat-users';
import activities, {sioHandlers as handlers5} from './activities';
import tickets, {sioHandlers as handlers6} from './tickets';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    global,
    appshell,
    users,
    auth,
    wechatUsers,
    activities,
    tickets
  }
});

[handlers1, handlers2, handlers3, handlers4, handlers5, handlers6]
  .forEach(handlers => Object.keys(handlers)
  .forEach(key => addSioHandler(key, handlers[key].bind(store))));

export default store;
