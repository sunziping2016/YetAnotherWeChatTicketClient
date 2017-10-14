<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex v-if="canSetPassword"
        xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text class="pa-4">
            <p v-if="action === 'create-user'">请设置您账号的初始密码，完成注册。</p>
            <p v-else>请输入您的新密码，您将被要求重新登录。</p>
            <v-text-field
              label="密码"
              v-model="password"
              @keyup.native.enter="onConfirm"
              :append-icon="passwordVisible ? 'visibility_off' : 'visibility'"
              :append-icon-cb="togglePasswordVisible"
              :type="passwordVisible ? 'text' : 'password'"
              :error-messages="passwordError ? [passwordError] : []"
            ></v-text-field>
            <v-layout justify-center>
              <v-btn large block
                     class="confirm-btn"
                     :disabled="!valid"
                     :loading="verifying"
                     primary @click="onConfirm">
                确认
              </v-btn>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex v-else class="pa-2">
        <v-layout justify-space-around>
          <v-progress-circular indeterminate>
          </v-progress-circular>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'password',
    data() {
      return {
        password: '',
        passwordError: null,
        passwordVisible: false,
        verifying: false
      }
    },
    computed: {
      user() {
        return this.$store.getters['auth/user'];
      },
      action() {
        return this.$store.state.global.action;
      },
      userToken() {
        return this.$store.state.global.userToken;
      },
      canSetPassword() {
        return !!this.user || (this.action === 'create-user' && this.userToken);
      },
      valid() {
        return this.password && !this.passwordError && !this.verifying;
      }
    },
    watch: {
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
      onConfirm() {
        if (!this.valid)
          return;
        this.verifying = true;
        if (this.action === 'create-user') {
          this.$store.dispatch('users/create', {
            password: this.password,
            token: this.userToken
          }).then(user => {
            return this.$store.dispatch('auth/byPassword', {
              username: user.username,
              password: this.password
            });
          }).then(() => {
            this.$store.commit('appshell/addSnackbarMessage', '创建用户并登录成功！');
            this.$store.commit('global/setAction', null);
            this.$store.commit('global/setUserToken', null);
            this.$router.push('/account');
          }).catch((err) => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
          }).then(() => {
            this.verifying = false;
          });
        } else {
          this.$store.dispatch('users/patch', {
            _id: this.user._id,
            password: this.password
          }).then(() => {
            this.$store.commit('auth/updateToken');
            this.$store.commit('appshell/addSnackbarMessage', '请重新登录');
            this.$router.push('/account/login');
          }).catch((err) => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
          }).then(() => {
            this.verifying = false;
          });
        }
      },
      togglePasswordVisible() {
        this.passwordVisible = !this.passwordVisible;
      }
    }
  };
</script>

<style lang="stylus">
  .confirm-btn
    flex-grow 1
    max-width 300px
    margin 6px
</style>
