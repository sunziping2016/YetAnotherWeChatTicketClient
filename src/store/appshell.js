const state = {
  title: '',

  drawer: window.innerWidth > 1024,
  drawerMini: false,

  snackbar: false,
  snackbarAnimating: false,
  snackbarMessages: [],

  bottomNavigation: true,

  // 0: not show, 1: confirmation, 2: promotion
  bindWechatDialog: 0,

  breakpoint: {},

  routerTransition: 'slide-y'
};

const mutations = {
  setTitle(state, value) {
    state.title = value || '';
  },
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
  setSnackbarAnimating(state, value) {
    state.snackbarAnimating = value;
  },
  addSnackbarMessage(state, message) {
    if (typeof message !== 'object')
      message = {content: message};
    state.snackbarMessages.push(message);
  },
  popSnackbarMessage(state) {
    state.snackbarMessages.splice(0, 1);
  },
  updateBreakpoint(state, value) {
    state.breakpoint = value;
  },
  setRouterTransition(state, transition) {
    state.routerTransition = transition;
  },
  setBindWechatDialog(state, value) {
    state.bindWechatDialog = value;
  }
};


export default {
  namespaced: true,
  state,
  mutations
};
