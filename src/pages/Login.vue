<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text class="pa-4">
            <v-layout class="banner" align-center justify-center>
              <img src="/static/img/icons/android-chrome-192x192.png" alt="logo">
              <div>
                <h3 class="grey--text">欢迎来到，</h3>
                <h2 class="deep-purple--text">紫荆之声</h2>
              </div>
            </v-layout>
            <v-text-field
              label="用户名或学号"
              type="text"
              v-model="username"
              @keyup.native.enter="onLogin"
              :error-messages="usernameError ? [usernameError] : []"
              required
            ></v-text-field>
            <v-text-field
              label="密码"
              v-model="password"
              @keyup.native.enter="onLogin"
              :append-icon="passwordVisible ? 'visibility_off' : 'visibility'"
              :append-icon-cb="togglePasswordVisible"
              :type="passwordVisible ? 'text' : 'password'"
              :error-messages="passwordError ? [passwordError] : []"
              required
            ></v-text-field>
            <p><small>* 密码是紫荆之声的密码，不是info密码。</small></p>
            <v-layout justify-center>
              <v-btn class="login-btn" primary large block
                     :disabled="!formValid"
                     :loading="verifying"
                     @click.native="onLogin"
              >登录</v-btn>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        usernameError: null,
        password: '',
        passwordError: null,
        passwordVisible: false,
        verifying: false
      }
    },
    computed: {
      formValid() {
        return !this.verifying && this.username && this.password &&
          !this.usernameError && !this.passwordError;
      }
    },
    watch: {
      username() {
        if (this.username.length === 0)
          this.usernameError = '用户名不能为空';
        else
          this.usernameError = null;
      },
      password() {
        if (this.password.length === 0)
          this.passwordError = '密码不能为空';
        else if (this.password.length < 8)
          this.passwordError = '密码长度至少8位';
        else
          this.passwordError = null;
      }
    },
    methods: {
      onLogin() {
        if (!this.formValid)
          return;
        this.verifying = true;
        const payload = {password: this.password};
        if (/^[0-9]+$/.test(this.username))
          payload.studentId = this.username;
        else
          payload.username = this.username;
        this.$store.dispatch('auth/byPassword', payload)
          .then(result => {
            this.$store.commit('appshell/addSnackbarMessage', '登录成功！');
            this.$router.push('/account');
          }).catch(error => {
          switch (error.message) {
            case 'User does not exist':
              this.usernameError = '用户不存在';
              break;
            case 'Require password reset':
              this.usernameError = '用户被重置密码';
              break;
            case 'Wrong password':
              this.passwordError = '密码错误';
              break;
            default:
              console.error(error);
              this.$store.commit('appshell/addSnackbarMessage', error.message);
          }
        }).then(() => {
          this.verifying = false;
        });
      },
      togglePasswordVisible() {
        this.passwordVisible = !this.passwordVisible;
      }
    }
  };
</script>


<style lang="stylus" scoped>
  .banner
    margin 0 0 24px
    img
      width 100px
      height auto
    h3
      font-size 16px
      margin 0 0 0 16px
    h2
      font-size 26px
      margin 0 0 0 16px

  .login-btn
    max-width 300px
    margin 6px
</style>
