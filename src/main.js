import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';
import components from './components';
import router from './pages';
import store from './store';


// Install service-worker
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  navigator.serviceWorker.register('/service-worker.js')
    .then(function (registration) {
      registration.onupdatefound = function () {
        if (navigator.serviceWorker.controller) {
          const installingWorker = registration.installing;

          installingWorker.onstatechange = function () {
            switch (installingWorker.state) {
              case 'redundant':
                throw new Error('The installing service worker became redundant.');
            }
          };
        }
      };
    }).catch(function (e) {
      console.error('Error during service worker registration:', e);
    });
}

// Emojify
emojify.setConfig({
  mode: 'img',
  img_dir: '//cdn.bootcss.com/emojify.js/1.1.0/images/basic',
  ignore_emoticons: true
});


Vue.use(Vuetify);
Object.keys(components).forEach(x => Vue.component(x, components[x]));

let app = new Vue({
  router,
  store,
  methods: {
    updateTitle() {
    },
  },
  computed: {
  },
  mixins: [App]
});

window.addEventListener('resize', function () {
  app.$store.commit('appshell/updateWindowSize', [
    window.innerWidth,
    window.innerHeight
  ]);
});

app.$mount('#app');
