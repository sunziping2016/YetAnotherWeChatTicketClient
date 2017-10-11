import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';
import components from './components';
import router from './pages';
import store from './store';
import { sync } from 'vuex-router-sync';


Vue.use(Vuetify);
sync(store, router);
Object.keys(components).forEach(x => Vue.component(x, components[x]));

let app = new Vue({
  router,
  store,
  data: {
    title: "紫荆之声"
  },
  methods: {
    updateTitle() {
      let metaTitle = this.$store.state.route.meta.title;
      if (metaTitle)
        document.title = metaTitle  + ' - ' + this.title;
      else
        document.title = this.title;
    }
  },
  mounted() {
    store.dispatch('auth/byToken', this.$route.query.token).catch(error => {
      if (error.type === 'EAUTH')
        store.commit('appshell/addSnackbarMessage', '验证信息错误');
      else {
        console.error(error);
        store.commit('appshell/addSnackbarMessage', error.message);
      }
    }).then(() => {
      const action = this.$route.query.action,
        sessToken = this.$route.query.token,
        userToken = this.$route.query['user-token'];
      if (userToken)
        store.commit('global/setUserToken', userToken);
      if (action || sessToken || userToken) {
        const newQuery = Object.assign({}, this.$route.query);
        delete newQuery.token;
        delete newQuery.action;
        delete newQuery['user-token'];
        router.replace({path: this.$route.path, query: newQuery});
      }
      if (action) {
        const token = this.$store.state.auth.token;
        switch (action) {
          case 'bind-wechat':
            if (token && token.uid && token.wid)
              this.$store.dispatch('auth/bindWechat', {
                user: token.uid,
                wechatUser: token.wid
              }).then(() => {
                store.commit('appshell/addSnackbarMessage', '成功绑定微信！');
              }).catch((err) => {
                console.error(err);
                store.commit('appshell/addSnackbarMessage', '绑定微信失败');
              });
            else
              store.commit('appshell/addSnackbarMessage', '绑定微信失败');
            break;
          case 'patch-user':
            if (token && token.uid && userToken)
              store.dispatch('users/patch', {
                _id: token.uid,
                token: userToken
              }).then(() => {
                store.commit('appshell/addSnackbarMessage', '成功绑定邮箱！');
              }).catch((err) => {
                console.error(err);
                store.commit('appshell/addSnackbarMessage', '绑定邮箱失败');
              });
            else
              store.commit('appshell/addSnackbarMessage', '绑定邮箱失败');
            break;
          default:
            store.commit('global/setAction', action);
        }
      }
    });
  },
  mixins: [App]
});

router.onReady(()=> app.$mount('#app'));

router.beforeEach((to, from, next) => {
  //if (window.scrollY !== 0)
  //  window.scrollTo(window.scrollX, 0);
  next();
});

router.afterEach((to, from) => {
  app.updateTitle();
});

// Detect wechat
if (typeof WeixinJSBridge === 'object')
  store.commit('global/setWechat', true);
else
  document.addEventListener("WeixinJSBridgeReady", function() {
    store.commit('global/setWechat', true);
  });

// Install service-worker
if (navigator.serviceWorker !== undefined && window.location.protocol === 'https:') {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => {
      reg.addEventListener('updatefound', () => {
        if (navigator.serviceWorker.controller) {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            switch (newWorker.state) {
              case 'installed':
                app.$store.commit('appshell/addSnackbarMessage', {
                  content: '已更新至最新版本, 请刷新页面',
                  actionText: '刷新',
                  callback() {
                    window.location.reload();
                  }
                });
                break;
              case 'redundant':
                throw new Error('The installing service worker became redundant.');
            }
          });
        }
      });
    }).catch(function (e) {
    console.error('Error during service worker registration:', e);
  });
}
