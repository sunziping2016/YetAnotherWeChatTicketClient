import { axios, throwOnError } from './api-utils';

const state = {
  users: {}
};

const mutations = {
  updateUser(state, user) {
    state.users[user._id] = user;
  }
};

const actions = {
  async create({state, commit}, user) {
    let response = await throwOnError(axios().post('/api/user/', user));
    commit('updateUser', response.data);
    return response.data;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
