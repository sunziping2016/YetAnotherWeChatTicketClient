<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex v-if="user"
              xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text class="pa-4">
            <p>请输入您的清华邮箱，我们将向您发送验证邮件：</p>
            <v-select
              :items="['mails.tsinghua.edu.cn', 'mail.tsinghua.edu.cn']"
              v-model="emailServer"
              label="邮箱服务器"
            ></v-select>
            <v-text-field
              label="邮箱用户"
              type="text"
              v-model="email"
              :suffix="'@' + emailServer"
              @keyup.native.enter="onVerifyEmail"
              :error-messages="emailError ? [emailError] : []"
            ></v-text-field>
            <v-layout justify-center>
              <v-btn primary large block
                     class="confirm-btn"
                     :loading="verifyingEmail"
                     :disabled="!emailValid"
                     @click.native="onVerifyEmail"
              >
                发送邮件
                <span slot="loader">
                {{verifyingEmailRemainingTime ?
                  `${verifyingEmailRemainingTime}秒后重发`:
                  '发送中...'}}
                </span>
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
        emailServer: 'mails.tsinghua.edu.cn',
        email: '',
        emailError: null,
        verifyingEmail: false,
        verifyingEmailRemainingTime: 0,
        verifyingEmailRemainingTimer: null,
      }
    },
    computed: {
      user() {
        return this.$store.getters['auth/user'];
      },
      emailValid() {
        return !this.emailError && this.email && !this.verifyingEmail;
      }
    },
    watch: {
      email() {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))$/;
        if (this.email.length === 0)
          this.emailError = '邮箱不能为空';
        else if (!emailRegex.test(this.email))
          this.emailError = '非法的邮箱格式';
        else
          this.emailError = null;
      }
    },
    methods: {
      onVerifyEmail() {
        if (!this.emailValid)
          return;
        this.verifyingEmail = true;
        this.$store.dispatch('auth/createSession')
          .then(token => {
            return this.$store.dispatch('auth/sendEmail', {
              emailUser: this.email,
              emailServer: this.emailServer,
              to: '/?action=patch-user&token=' + token,
              action: 'bind'
            });
          }).then(() => {
            this.verifyingEmailRemainingTime = 60;
            this.verifyingEmailRemainingTimer = setInterval(() => {
            this.verifyingEmailRemainingTime -= 1;
            if (this.verifyingEmailRemainingTime === 0) {
              clearInterval(this.verifyingEmailRemainingTimer);
              this.verifyingEmailRemainingTimer = null;
              this.verifyingEmail = false;
            }
          }, 1000);
        }).catch((err) => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
          if (this.verifyingEmailRemainingTimer) {
            clearInterval(this.verifyingEmailRemainingTimer);
            this.verifyingEmailRemainingTimer = null;
          }
          this.verifyingEmail = false;
        });
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
