import { axios, throwOnError, socket} from './utils';
import jwtDecode from 'jwt-decode';

const state = {
  token: null
};

const mutations = {
  updateToken(state, token) {
    if (token) {
      window.localStorage.setItem('jwt', token);
      state.token = jwtDecode(token);
    } else {
      window.localStorage.removeItem('jwt');
      state.token = null;
    }
    if (socket())
      socket().emit('auth', token || null);
  }
};

function updateAuthData(commit, data) {
  if (data.user)
    commit('users/updateUser', data.user, {root: true});
  if (data.wechatUser)
    commit('wechatUsers/updateUser', data.wechatUser, {root: true});
  if (data.token)
    commit('updateToken', data.token);
}

const actions = {
  async byToken({commit, dispatch}, token) {
    const jwt = window.localStorage.getItem('jwt');
    let data = {}, response;
    if (token) {
      data.strategy = 'session';
      data.payload = {token};
      if (jwt)
        data.payload.jwt = jwt;
    } else if (jwt) {
      data.strategy = 'jwt';
      data.payload = jwt;
    } else
      return null;
    response = await throwOnError(axios().post('/api/auth/', data))
      .catch(err => {
        if (err.data)
          updateAuthData(commit, err.data);
        else if (err.type && err.type !== 'EREQUEST')
          window.localStorage.removeItem('jwt');
        throw err;
      });
    updateAuthData(commit, response);
    return response;
  },
  async byPassword({commit}, payload) {
    const jwt = window.localStorage.getItem('jwt'),
      data = {strategy: 'local', payload: {}};
    Object.assign(data.payload, payload);
    if (jwt)
      data.payload.jwt = jwt;
    const response = await throwOnError(axios().post('/api/auth/', data))
      .catch(err => {
        if (err.data)
          updateAuthData(commit, err.data);
        if (err.type && err.type !== 'EREQUEST')
          window.localStorage.removeItem('jwt');
        throw err;
      });
    updateAuthData(commit, response);
    return response;
  },
  sendValidationEmail(_, payload) {
    return throwOnError(axios().post('/api/auth/email', payload));
  },
  bindWechat(_, payload) {
    return throwOnError(axios().post('/api/auth/bind', payload, {
      headers: {
        'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
      }
    }));
  },
  unbindWechat(_, payload) {
    return throwOnError(axios().post('/api/auth/unbind', payload, {
      headers: {
        'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
      }
    }));
  },
  createSession() {
    return throwOnError(axios().post('/api/auth/session', {}, {
      headers: {
        'Authorization': `Bearer ${window.localStorage.getItem('jwt')}`
      }
    }));
  }
};

const getters = {
  wechatUser(state, getters, rootState) {
    if (state.token && state.token.wid)
      return rootState.wechatUsers.users[state.token.wid];
    return null;
  },
  user(state, getters, rootState) {
    if (state.token && state.token.uid)
      return rootState.users.users[state.token.uid];
    return null;
  },
  avatarThumbnail(state, getters) {
    if (getters.user) {
      if (getters.user.avatarThumbnail)
        return getters.user.avatarThumbnail;
      if (getters.wechatUser &&
          getters.user.wechatId === getters.wechatUser.openId)
        return getters.wechatUser.avatarThumbnail || null;
      return null;
    }
    return null;
  },
  canBindWechat(state, getters) {
    return !!(getters.user && getters.wechatUser &&
      !getters.user.wechatId && !getters.wechatUser.userId)
  }
};

export const sioHandlers = {
  'connect': function () {
    if (socket())
      socket().emit('auth', window.localStorage.getItem('jwt'));
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
