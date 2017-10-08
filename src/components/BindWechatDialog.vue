<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title>
        <div class="headline">
          {{['请从微信打开页面', '确认认证微信？', '请登录/注册账号',
            '确认绑定微信？', '是否绑定微信？', '确认解除绑定？'][mode]}}
        </div>
      </v-card-title>
      <v-card-text>
        <p v-if="mode === 0">目前只支持在微信浏览器中验证您的身份。您可以在公众号点内击或回复“个人中心”获取网址。</p>
        <p v-if="mode === 1">需要认证微信以获取您现在登录的用户，点击“确认”认证微信并绑定账号。</p>
        <p v-if="mode === 2">需要认证学生账号进行绑定，点击“账户”->“登录”或“注册”认证学生账号。</p>
        <p v-if="mode === 3 || mode === 4">绑定后，您可在公众号内直接进行抢票操作。同时微信内打开紫荆之声页面也无需登录。</p>
        <p v-if="mode === 5">解除绑定后，您将无法在公众号内部直接进行抢票操作。同时微信内打开紫荆之声页面也无法直接登录。</p>
        <p class="error--text">{{error}}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click.native="onCancel">取消</v-btn>
        <v-btn primary flat
               @click.native="onConfirm"
               :disabled="loading"
               :loading="loading"
        >确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        error: null,
        mode: 0
      }
    },
    methods: {
      onCancel() {
        this.dialog = 0;
        this.loading = false;
        this.error = null;
      },
      onConfirm() {
        if (this.mode === 0 || this.mode === 2)
          return this.onCancel();
        if (this.loading)
          return;
        this.loading = true;
        const token = this.$store.state.auth.token;
        let promise;
        if (this.mode === 1) {
          promise = (async () => {
            const token = await this.$store.dispatch('auth/createSession'),
              appid = this.$store.state.global.wechatAppid ||
                (await this.$store.dispatch('global/getSiteSettings')).wechatAppid,
              url = this.$store.state.global.site + '/api/auth/wechat?to=' +
                encodeURIComponent(window.location.pathname + '?token=' + token +
                  '&action=bind-wechat');
            window.location = 'https://open.weixin.qq.com/connect/oauth2/authorize' +
              '?appid=' + appid + '&redirect_uri=' + encodeURIComponent(url) +
              '&response_type=code&scope=snsapi_base&state=#wechat_redirect';
          })()
        } else if (this.mode === 3 || this.mode === 4)
          promise = this.$store.dispatch('auth/bindWechat', {
            user: token.uid,
            wechatUser: token.wid
          });
        else // 5
          promise = this.$store.dispatch('auth/unbindWechat', {
            user: token.uid
          });
        promise.then(() => {
          this.dialog = 0;
        }).catch(err => {
          if (this.dialog)
            this.error = err.message;
        }).then(() => {
          this.loading = false;
        });
      }
    },
    computed: {
      dialog: {
        get() {
          return this.$store.state.appshell.bindWechatDialog;
        },
        set(value) {
          this.$store.commit('appshell/setBindWechatDialog', value);
        }
      },
      token() {
        return this.$store.state.auth.token;
      },
      user() {
        return this.$store.getters['auth/user']
      },
      wechatUser() {
        return this.$store.getters['auth/wechatUser'];
      }
    },
    watch: {
      dialog(value) {
        if (!value)
          return;
        // require browser, require wechat user, require user
        // confirm, prompt, confirm unbind
        if (this.user && this.user.wechatId)
          this.mode = 5;
        else if (this.user && this.wechatUser) {
          if (this.dialog === 1)
            this.mode = 3; // Confirm
          else
            this.mode = 4; // Prompt
        } else if (this.wechatUser)
          this.mode = 2;
        else if (!this.$store.state.global.isWechat)
          this.mode = 0;
        else
          this.mode = 1;
      }
    }
  };
</script>
