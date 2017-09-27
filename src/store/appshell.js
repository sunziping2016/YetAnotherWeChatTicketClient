const state = {
  drawer: window.innerWidth > 1024,
  drawerMini: false,

  bottomNavigation: true,

  windowSize: [window.innerWidth, window.innerHeight],

  routerTransition: 'slide-y'
};

const mutations = {
  setDrawer(state, value) {
    state.drawer = value;
  },
  setDrawerMini(state, mini) {
    state.drawerMini = mini;
  },
  setBottomNavigation(state,  value) {
    state.bottomNavigation = value;
  },
  updateWindowSize(state, size) {
    state.windowSize = size
  },
  setRouterTransition(state, transition) {
    state.routerTransition = transition;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
