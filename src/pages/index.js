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
const SetPassword = () => import('./SetPassword.vue');
const BindTsinghua = () => import('./BindTsinghua.vue');
const BindEmail = () => import('./BindEmail.vue');
const CreateActivity = () => import('./CreateActivity.vue');

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
      path: '/account/info/bind-tsinghua',
      name: 'bindTsinghua',
      component: BindTsinghua,
      meta: {
        title: '绑定清华账号',
        level: 2,
        back: {name: 'accountInfo'}
      }
    },
    {
      path: '/account/info/bind-email',
      name: 'bindEmail',
      component: BindEmail,
      meta: {
        title: '绑定清华邮箱',
        level: 2,
        back: {name: 'accountInfo'}
      }
    },
    {
      path: '/account/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录',
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/account/register',
      name: 'register',
      component: Register,
      meta: {
        title: '注册',
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/account/set-password',
      name: 'setPassword',
      component: SetPassword,
      meta: {
        title: '设置密码',
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/admin/create-activity',
      name: 'createActivity',
      component: CreateActivity,
      meta: {
        title: '创建活动',
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/account/help',
      name: 'help',
      component: Help,
      meta: {
        title: '新手指南',
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
