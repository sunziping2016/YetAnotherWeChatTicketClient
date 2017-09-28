import Vue from 'vue';
import Router from 'vue-router';

const Home = () => import('./Home.vue');
const Ticket = () => import('./Ticket.vue');
const Account = () => import('./Account.vue');
const Help = () => import('./Help.vue');
const Register = () => import('./Register.vue');
const NotFound = () => import('./NotFound.vue');

Vue.use(Router);


// tabIndex
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/(index.html)?',
      name: 'home',
      component: Home,
      meta: {
        level: 0,
        tabIndex: 0
      }
    },
    {
      path: '/ticket',
      name: 'ticket',
      component: Ticket,
      meta: {
        level: 0,
        tabIndex: 1
      }
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
      meta: {
        level: 0,
        tabIndex: 2
      }
    },
    {
      path: '/help',
      name: 'help',
      component: Help,
      meta: {
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/404',
      name: 'notFound',
      component: NotFound,
      meta: {
        level: 0
      }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});

router.beforeEach(function (to, from, next) {
  const $store = router.app.$store,
    fromLevel = from.meta.level,
    toLevel = to.meta.level;
  if ($store) {
    if (fromLevel === toLevel) {
      const fromTabIndex = from.meta.tabIndex,
        toTabIndex = to.meta.tabIndex;
      if (fromTabIndex === undefined || toTabIndex === undefined)
        $store.commit('appshell/setRouterTransition', 'slide-y');
      else if (fromTabIndex < toTabIndex)
        $store.commit('appshell/setRouterTransition', 'slide-left');
      else
        $store.commit('appshell/setRouterTransition', 'slide-right');
    } else if (fromLevel < toLevel)
      $store.commit('appshell/setRouterTransition', 'slide-left');
    else
      $store.commit('appshell/setRouterTransition', 'slide-right');
  }
  next();
});

export default router;
