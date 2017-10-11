import { axios, throwOnError } from './utils';
import Vue from 'vue';

const state = {
  users: {}
};

const mutations = {
  updateUser(state, user) {
    if (typeof user.createdAt === 'string')
      user.createdAt = new Date(user.createdAt);
    if (typeof user.updatedAt === 'string')
      user.updatedAt = new Date(user.updatedAt);
    Vue.set(state.users, user.openId, user);
  },
  deleteUser(state, id) {
    Vue.delete(state.users, id)
  }
};

export default {
  namespaced: true,
  state,
  mutations
}

export const sioHandlers = {
  'wechatUsers:update': function (user) {
    this.commit('wechatUsers/updateUser', user);
  },
  'wechatUsers:delete': function (id) {
    this.commit('wechatUsers/deleteUser', id);
  }
};
