<template>
  <v-container fluid class="pa-2">
    <v-layout row justify-space-around>
      <v-stepper v-model="step" vertical class="register-panel">
        <v-stepper-step :step="1" :complete="!!user">
          验证学生账号
        </v-stepper-step>
        <v-stepper-content :step="1" class="verify-student-panel">
          <!-- Fake elements -->
          <input class="fake-input" type="email">
          <input class="fake-input" type="password">
          <v-tabs light fixed
                  centered v-model="verifyTab">
            <v-tabs-bar class="white verify-tabs-bar">
              <v-tabs-item href="#verify-by-email" ripple>
                邮箱验证
              </v-tabs-item>
              <v-tabs-item href="#verify-by-id" ripple>
                学生清华验证
              </v-tabs-item>
              <v-tabs-slider class="primary"></v-tabs-slider>
            </v-tabs-bar>
            <v-tabs-items>
              <v-tabs-content id="verify-by-email">
                <v-card flat>
                  <v-card-text>
                    <p>请输入您的<b>清华邮箱</b>，我们将向您发送验证邮件：</p>
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
                    <p><small>* 请务必检查垃圾邮件。</small></p>
                    <v-btn
                      primary
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
                  </v-card-text>
                </v-card>
              </v-tabs-content>
              <v-tabs-content id="verify-by-id">
                <v-card flat>
                  <v-card-text>
                    <p>请输入您的<b>清华学生账号</b>，我们将通过模拟登录以验证您的身份：</p>
                    <v-text-field
                      label="用户名或学号"
                      type="text"
                      v-model="studentUsername"
                      @keyup.native.enter="onRegister"
                      :error-messages="studentUsernameError ? [studentUsernameError] : []"
                    ></v-text-field>
                    <v-text-field
                      label="密码"
                      v-model="studentPassword"
                      @keyup.native.enter="onVerifyStudent"
                      :append-icon="studentPasswordVisible ? 'visibility_off' : 'visibility'"
                      :append-icon-cb="toggleStudentPasswordVisible"
                      :type="studentPasswordVisible ? 'text' : 'password'"
                      :error-messages="studentPasswordError ? [studentPasswordError] : []"
                    ></v-text-field>
                    <p><small>* 我们以人格担保不存储您的密码和敏感信息。</small></p>
                    <v-btn
                      primary
                      :disabled="!studentValid"
                      @click.native="onVerifyStudent"
                    >
                      验证
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </v-stepper-content>
        <v-stepper-step :step="2" :complete="!!wechatUser">绑定微信</v-stepper-step>
        <v-stepper-content :step="2">
          <p>点击按钮，跳转微信认证页面。</p>
          <v-btn primary
                 :disabled="!!wechatUser"
                 @click.native="onVerifyWechat"
          >认证</v-btn>
        </v-stepper-content>
        <v-stepper-step :step="3" :complete="step > 3">确认信息</v-stepper-step>
        <v-stepper-content :step="3">
          <p>您已完成注册！登录后会跳回主页。</p>studentU
          <v-btn primary>登录</v-btn>
        </v-stepper-content>
      </v-stepper>
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
        studentUsername: '',
        studentUsernameError: null,
        studentPassword: '',
        studentPasswordError: null,
        studentPasswordVisible: false,
        verifyTab: 'verify-by-email',
        verifyingEmail: false,
        verifyingEmailRemainingTime: 0,
        verifyingEmailRemainingTimer: null,
        verifyingStudent: false,
        step: 1
      };
    },
    computed: {
      emailValid() {
        return !this.emailError && this.email && !this.verifyingEmail;
      },
      studentValid() {
        return !this.studentUsernameError && !this.studentPasswordError &&
          this.studentUsername && this.studentPassword && !this.verifyingStudent;
      },
      user() {
        return this.$store.getters['auth/user']
      },
      wechatUser() {
        return this.$store.getters['auth/wechatUser'];
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
      },
      studentUsername() {
        if (this.studentUsername.length === 0)
          this.studentUsernameError = '用户名不能为空';
        else
          this.studentUsernameError = null;
        if (this.studentPasswordError === ' ')
          this.studentPasswordError = null;
      },
      studentPassword() {
        if (this.studentPassword.length === 0)
          this.passwordError = '密码不能为空';
        else
          this.passwordError = null;
        if (this.studentUsernameError === '账号认证失败')
          this.studentUsernameError = null;
      },
      user() {
        this.checkStep();
      },
      wechatUser() {
        this.checkStep();
      }
    },
    methods: {
      checkStep() {
        if (this.step === 1 && !!this.user)
          this.step = 2;
        if (this.step === 2 && !!this.wechatUser)
          this.step = 3;
      },
      onVerifyEmail() {
        if (!this.emailValid)
          return;
        this.verifyingEmail = true;
        this.$store.dispatch('auth/sendValidationEmail', {
          emailUser: this.email,
          emailServer: this.emailServer,
          action: 'register'
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
          })
          .catch((err) => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
            if (this.verifyingEmailRemainingTimer) {
              clearInterval(this.verifyingEmailRemainingTimer);
              this.verifyingEmailRemainingTimer = null;
            }
            this.verifyingEmail = false;
          })
        ;
      },
      onVerifyStudent() {
        /*if (!this.registerValid)
          return;
        this.$store.dispatch('users/create', {
          username: this.username,
          password: this.password
        }).then(result => {
          this.$store.commit('appshell/addSnackbarMessage', '账号认证成功！');
        }).catch(error => {
          switch (error.type) {
            case 'EAUTH':
              this.usernameError = '账号认证失败';
              this.passwordError = ' ';
              break;
            case 'EEXISTS':
              this.usernameError = '该用户已注册';
          }
        })*/
      },
      onVerifyWechat() {
        console.log('https://open.weixin.qq.com/connect/qrconnect?appid=' + this.$store.state.global.wechatAppid
          + '&redirect_uri=' + encodeURIComponent(this.$store.state.global.site, '/api/auth/wechat?action=register') + '&response_type=code&scope=snsapi_login#wechat_redirect');
      },
      toggleStudentPasswordVisible() {
        this.studentPasswordVisible = !this.studentPasswordVisible;
      }
    },
    mounted() {
      this.checkStep();
    }
  };
</script>

<style lang="stylus">
  @import '~vuetify/src/stylus/bootstrap'

  .fake-input
    display none
  .register-panel
    max-width 600px
    flex-grow 1

  .verify-tabs-bar
    height 40px

  @media $display-breakpoints.xs-only
    .stepper--vertical
      .stepper__step
        padding 24px 12px 16px
      .stepper__content
        padding 16px 24px 16px 20px
        margin -8px 0 -16px 24px
      .stepper__content.verify-student-panel
        padding 0 24px 0 20px
        .card__text
          padding 16px 8px

</style>
