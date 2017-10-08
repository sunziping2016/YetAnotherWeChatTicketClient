import Vue from 'vue';
import Router from 'vue-router';

const Home = () => import('./Home.vue');
const Ticket = () => import('./Ticket.vue');
const Account = () => import('./Account.vue');
const Help = () => import('./Help.vue');
const Register = () => import('./Register.vue');
const NotFound = () => import('./NotFound.vue');
const Activity = () => import('./Activity.vue');
const AccountInfo = () => import('./AccountInfo.vue');
const Login = () => import('./Login.vue');

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
      path: '/activity/:id',
      name: 'activity',
      component: Activity,
      meta: {
        level: 1,
        title: '活动',
        back: {name: 'home'}
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
        title: '账户',
        level: 0,
        tabIndex: 2
      }
    },
    {
      path: '/account/info',
      name: 'accountInfo',
      component: AccountInfo,
      meta: {
        title: '账户信息',
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录',
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/help',
      name: 'help',
      component: Help,
      meta: {
        title: '帮助',
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        title: '注册',
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
      if (fromTabIndex === undefined || toTabIndex === undefined ||
          $store.state.appshell.breakpoint.mdAndUp)
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
