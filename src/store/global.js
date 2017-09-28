const state = {
  site: window.origin,
};

const mutations = {
  setSite(state, site) {
    state.site = site;
  }
};

export default {
  namespaced: true,
  state,
  mutations
}
