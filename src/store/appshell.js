const state = {
  drawer: window.innerWidth > 1024,
  drawerMini: false,

  snackbar: false,
  snackbarMessages: [],

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
  setSnackbar(state, value) {
    state.snackbar = value;
  },
  addSnackbarMessage(state, message) {
    if (typeof message !== 'object')
      message = {content: message};
    state.snackbarMessages.push(message);
  },
  popSnackbarMessage(state) {
    state.snackbarMessages.splice(0, 1);
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
