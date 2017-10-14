import Vue from 'vue';
import {setAxios, setSocket, throwOnError, axios, socket} from "./utils";

// TODO: for test
export const sioHandlers = {
  '*': function (event, data) {
    console.log(event, data);
  },
  'connect': function () {
    setTimeout(() => {
      this.dispatch('global/syncTime')
        .catch(err => console.error(err));
    }, 1000); // Avoid first page loading
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
  userToken: null,

  timeDelta: null, // serverTime - clientTime
  ping: null,

  initialPath: String(location).replace(/#.*/, ''),

  wechatSigned: null,
  wechatSigning: false,
  wechatSignedError: false,

  serverTime: Date.now(),
  timer: null,
  interval: null,

  enableSocket: localStorage.getItem('enableSocket') !== 'false'
};

const mutations = {
  setWechat(state, value) {
    state.isWechat = value;
  },
  setSite(state, site) {
    state.site = site;
    setAxios(site);
    if (state.enableSocket)
      setSocket(site);
  },
  setAction(state, value) {
    state.action = value;
  },
  setUserToken(state, value) {
    state.userToken = value;
  },
  updateTime(state) {
    state.serverTime = +state.timeDelta + Date.now();
  },
  updatePingAndDelta(state, value) {
    state.ping = value.ping;
    state.timeDelta = value.timeDelta;
  },
  setWechatSigned(state, err) {
    if (err) {
      state.wechatSigned = false;
      state.wechatSignedError = err;
    } else {
      state.wechatSigned = true;
    }
  },
  setWechatSigning(state, value) {
    state.wechatSigning = value;
  },
  setServerTime(state, value) {
    state.serverTime = value;
  },
  setTimer(state, value) {
    state.timer = value;
  },
  setInterval(state, value) {
    state.interval = value;
  },
  setEnableSocket(state, value) {
    state.enableSocket = value;
    localStorage.setItem('enableSocket', value);
    if (value)
      setSocket(state.site);
    else
      setSocket(null);
  }
};

const actions = {
  getSiteSettings(state) {
    return throwOnError(axios().get('/api/site'))
      .then(data => {
        Object.keys(data).forEach(key => Vue.set(state, key, data[key]));
        return data;
      });
  },
  syncTimeOnce() {
    if (socket()) {
      return new Promise((resolve, reject) => {
        const start = Date.now();
        socket().emit('time', function (serverTime) {
          const end = Date.now();
          resolve({
            ping: end - start,
            timeDelta: serverTime - start
          });
        });
      });
    }
    return null;
  },
  syncTime({commit, dispatch}) {
    if (socket()) {
      return (async () => {
        let totalPing = [], totalTimeDelta = [], time = 10;
        for (let i = 0; i < time; ++i) {
          const result = await dispatch('syncTimeOnce');
          totalPing.push(result.ping);
          totalTimeDelta.push(result.timeDelta);
          if (i + 1 !== time)
            await new Promise((resolve, reject) =>
              setTimeout(resolve, 500));
        }
        totalPing.sort((a, b) => a - b);
        totalTimeDelta.sort((a, b) => a - b);
        const result = {
          ping: totalPing[Math.floor(time / 2)],
          timeDelta: totalTimeDelta[Math.floor(time / 2)]
        };
        commit('updatePingAndDelta', result);
        dispatch('startTimer');
        return result;
      })();
    }
    return null;
  },
  signWechatJsApi({state, commit}) {
    if (state.wechatSigned === null) {
      commit('setWechatSigning', true);
      return throwOnError(axios().post('/api/sign-wechat', {
        url: location.pathname,
        jsApiList: [
          'checkJsApi',
          'scanQRCode'
        ]
      })).then(data => {
        wx.config(data);
        wx.ready(() => {
          commit('setWechatSigned');
          commit('setWechatSigning', false);
        });
        wx.error(err => {
          commit('setWechatSigned', err);
          commit('setWechatSigning', false);
        });
      });
    }
    return null;
  },
  startTimer({state, commit}) {
    if (state.timer)
      clearTimeout(state.timer);
    if (state.interval) {
      clearInterval(state.interval);
      commit('setInterval', null)
    }
    commit('setServerTime', +state.timeDelta + Date.now() + state.ping / 2);
    commit('setTimer', setTimeout(() => {
      commit('setTimer', null);
      commit('setInterval', setInterval(() => {
        commit('setServerTime', +state.timeDelta + Date.now() + state.ping / 2);
      }, 1000));
    }, 1000 - state.serverTime % 1000));
  }

};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
