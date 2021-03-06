import Vue from 'vue';
import Router from 'vue-router';

const Home = () => import('./Home.vue');
const Tickets = () => import('./Tickets.vue');
const Account = () => import('./Account.vue');
const Help = () => import('./Help.vue');
const FAQ = () => import('./FAQ.vue');
const Register = () => import('./Register.vue');
const NotFound = () => import('./NotFound.vue');
const Activity = () => import('./Activity.vue');
const AccountInfo = () => import('./AccountInfo.vue');
const Login = () => import('./Login.vue');
const Password = () => import('./Password.vue');
const BindTsinghua = () => import('./BindTsinghua.vue');
const BindEmail = () => import('./BindEmail.vue');
const Settings = () => import('./Settings.vue');
const Drafts = () => import('./Drafts.vue');
const CreateActivity = () => import('./CreateActivity.vue');
const ActivityPreview = () => import('./ActivityPreview.vue');
const CheckTicket = () => import('./CheckTicket.vue');
const EditActivity = () => import('./EditActivity.vue');
const Ticket = () => import('./Ticket.vue');
const Users = () => import('./Users.vue');
const CreateUser = () => import('./CreateUser.vue');
const Wechat = () => import('./Wechat.vue');

Vue.use(Router);

// tabIndex
const router = new Router({
  routes: [
    {
      path: '/(index.html)?',
      name: 'home',
      component: Home,
      meta: {
        title: '近期活动',
        level: 0,
        tabIndex: 0
      }
    },
    {
      path: '/activity/:id',
      name: 'activity',
      component: Activity,
      meta: {
        title: '活动详情',
        level: 1,
        back: {name: 'home'}
      }
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: Tickets,
      meta: {
        title: '我的票夹',
        level: 0,
        tabIndex: 1
      }
    },
    {
      path: '/ticket/:id',
      name: 'ticket',
      component: Ticket,
      meta: {
        title: '电子票详情',
        level: 1,
        back: {name: 'tickets'}
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
      path: '/account/settings',
      name: 'settings',
      component: Settings,
      meta: {
        title: '消息设置',
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/account/password',
      name: 'password',
      component: Password,
      meta: {
        title: '设置密码',
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/admin/drafts',
      name: 'drafts',
      component: Drafts,
      meta: {
        title: '我的活动',
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/admin/drafts/:id',
      name: 'activityPreview',
      component: ActivityPreview,
      meta: {
        title: '活动详情',
        level: 2,
        back: {name: 'drafts'}
      }
    },
    {
      path: '/admin/drafts/edit/:id',
      name: 'editActivity',
      component: EditActivity,
      meta: {
        title: '编辑活动',
        level: 2,
        back: {name: 'drafts'}
      }
    },
    {
      path: '/admin/create-activity',
      name: 'createActivity',
      component: CreateActivity,
      meta: {
        title: '创建活动',
        level: 2,
        back: {name: 'drafts'}
      }
    },
    {
      path: '/admin/check-ticket',
      name: 'checkTicket',
      component: CheckTicket,
      meta: {
        title: '开始检票',
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/admin/users',
      name: 'users',
      component: Users,
      meta: {
        title: '管理用户',
        level: 1,
        back: {name: 'account'}
      }
    },
    {
      path: '/admin/create-user',
      name: 'createUser',
      component: CreateUser,
      meta: {
        title: '创建用户',
        level: 2,
        back: {name: 'users'}
      }
    },
    {
      path: '/admin/wechat-menu',
      name: 'wechatMenu',
      component: Wechat,
      meta: {
        title: '微信菜单设置',
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
      path: '/account/faq',
      name: 'faq',
      component: FAQ,
      meta: {
        title: '常见问题',
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
