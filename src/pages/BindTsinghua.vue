<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex v-if="user"
              xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text class="pa-4">
            <p>请输入您的<b>清华学生账号</b>，我们将通过模拟登录以验证您的身份：</p>
            <v-text-field
              label="用户名或学号"
              type="text"
              :value="user.username"
              disabled
            ></v-text-field>
            <v-text-field
              label="密码"
              v-model="password"
              @keyup.native.enter="onConfirm"
              :append-icon="passwordVisible ? 'visibility_off' : 'visibility'"
              :append-icon-cb="togglePasswordVisible"
              :type="passwordVisible ? 'text' : 'password'"
              :error-messages="passwordError ? [passwordError] : []"
            ></v-text-field>
            <p><small>* 我们以人格担保不存储您的密码和敏感信息。</small></p>
            <v-layout justify-center>
              <v-btn class="verify-btn" primary large block
                     :disabled="!valid"
                     :loading="verifying"
                @click.native="onConfirm"
              >
                验证
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
    data() {
      return {
        password: '',
        passwordError: null,
        passwordVisible: false,
        verifying: false
      };
    },
    computed: {
      valid() {
        return !this.passwordError && this.password && !this.verifying;
      },
      user() {
        return this.$store.getters['auth/user']
      }
    },
    watch: {
      password() {
        if (this.password.length === 0)
          this.passwordError = '密码不能为空';
        else
          this.passwordError = null;
      }
    },
    methods: {
      onConfirm() {
        if (!this.valid)
          return;
        this.verifying = true;
        this.$store.dispatch('auth/validateTsinghua', {
          username: this.user.username,
          password: this.password
        }).then(token => {
          return this.$store.dispatch('users/patch', {
            _id: this.user._id,
            token
          });
        }).then(() => {
          this.$router.push('/account/info');
        }).catch(err => {
          switch (err.message) {
            case 'Authentication failed':
              this.passwordError = '密码错误';
              break;
            default:
              console.error(err);
              this.$store.commit('appshell/addSnackbarMessage', err.message);
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
  .verify-btn
    max-width 300px
    margin 6px
</style>
