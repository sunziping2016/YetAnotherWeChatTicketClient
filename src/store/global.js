import Vue from 'vue';
import {setAxios, setSocket, throwOnError, axios} from "./utils";

// TODO: for test
export const sioHandlers = {
  '*': function (event, data) {
    console.log(event, data);
  },
  'newVersion': function () {
    this.commit('appshell/addSnackbarMessage', {
      content: '检测到有新版本是否更新？',
      actionText: '更新',
      callback() {
        if (navigator.serviceWorker !== undefined && window.location.protocol === 'https:') {
          navigator.serviceWorker.register('/service-worker.js')
            .then(reg => {
              reg.update();
            }).catch(function (e) {
              console.error('Error during service worker registration:', e);
            });
        }
      }
    });
  }
};

const state = {
  title: '紫荆之声',
  site: window.location.origin,

  isWechat: false,

  wechatAppid: null,
  action: null,
  userToken: null
};

const mutations = {
  setWechat(state, value) {
    state.isWechat = value;
  },
  setSite(state, site) {
    state.site = site;
    setAxios(site);
    setSocket(site);
  },
  setAction(state, value) {
    state.action = value;
  },
  setUserToken(state, value) {
    state.userToken = value;
  }
};

const actions = {
  getSiteSettings(state, site) {
    return throwOnError(axios().get('/api/site'))
      .then(data => {
        Object.keys(data).forEach(key => Vue.set(state, key, data[key]));
        return data;
      });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
