<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text class="pa-4">
            <v-tabs light fixed
                    centered v-model="verifyTab">
              <v-tabs-bar class="white verify-tabs-bar">
                <v-tabs-item href="#verify-by-email" ripple>
                  邮箱注册
                </v-tabs-item>
                <v-tabs-item href="#verify-by-id" ripple>
                  学生清华注册
                </v-tabs-item>
                <v-tabs-slider class="primary"></v-tabs-slider>
              </v-tabs-bar>
              <v-tabs-items>
                <v-tabs-content id="verify-by-email">
                  <v-card flat>
                    <v-card-text class="px-0">
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
                </v-tabs-content>
                <v-tabs-content id="verify-by-id">
                  <v-card flat>
                    <v-card-text v-if="!userToken" class="px-0">
                      <p>请输入您的<b>清华学生账号</b>，我们将通过模拟登录以验证您的身份：</p>
                      <v-text-field
                        label="用户名或学号"
                        type="text"
                        v-model="studentUsername"
                        @keyup.native.enter="onVerifyStudent"
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
                      <v-layout justify-center>
                        <v-btn primary large block
                               class="confirm-btn"
                               :disabled="!studentValid"
                               :loading="verifyingStudent"
                               @click.native="onVerifyStudent"
                        >
                          验证
                        </v-btn>
                      </v-layout>
                    </v-card-text>
                    <v-card-text v-else class="px-0">
                      <p>请设置您账号的初始密码，完成注册。</p>
                      <v-text-field
                        label="密码"
                        :value="password"
                        @input="realPassword = arguments[0]"
                        @keyup.native.enter="onConfirm"
                        :append-icon="passwordVisible ? 'visibility_off' : 'visibility'"
                        :append-icon-cb="togglePasswordVisible"
                        :type="passwordVisible ? 'text' : 'password'"
                        :error-messages="passwordError ? [passwordError] : []"
                        :disabled="useStudentPassword"
                      ></v-text-field>
                      <v-checkbox label="使用清华密码" v-model="useStudentPassword"></v-checkbox>
                      <v-layout justify-center>
                        <v-btn large block
                               class="confirm-btn"
                               @click="userToken = null">
                          取消
                        </v-btn>
                        <v-btn primary large block
                               class="confirm-btn"
                               :disabled="!valid"
                               :loading="verifying"
                               @click="onConfirm">
                          确认
                        </v-btn>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-tabs-content>
              </v-tabs-items>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'register',
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
        userToken: null,
        verifyTab: 'verify-by-email',
        verifyingEmail: false,
        verifyingEmailRemainingTime: 0,
        verifyingEmailRemainingTimer: null,
        verifyingStudent: false,
        realPassword: '',
        useStudentPassword: false,
        passwordError: null,
        passwordVisible: false,
        verifying: false
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
      password() {
        return this.useStudentPassword ? this.studentPassword : this.realPassword;
      },
      user() {
        return this.$store.getters['auth/user']
      },
      wechatUser() {
        return this.$store.getters['auth/wechatUser'];
      },
      valid() {
        return this.password && !this.passwordError && !this.verifying;
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
          this.studentPasswordError = '密码不能为空';
        else
          this.studentPasswordError = null;
        if (this.studentUsernameError === '账号认证失败')
          this.studentUsernameError = null;
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
      onVerifyEmail() {
        if (!this.emailValid)
          return;
        this.verifyingEmail = true;
        this.$store.dispatch('auth/sendEmail', {
          emailUser: this.email,
          emailServer: this.emailServer,
          to: '/account/set-password?action=create-user',
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
        }).catch((err) => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
          if (this.verifyingEmailRemainingTimer) {
            clearInterval(this.verifyingEmailRemainingTimer);
            this.verifyingEmailRemainingTimer = null;
          }
          this.verifyingEmail = false;
        });
      },
      onVerifyStudent() {
        if (!this.studentValid)
          return;
        this.verifyingStudent = true;
        this.$store.dispatch('auth/validateTsinghua', {
          username: this.studentUsername,
          password: this.studentPassword
        }).then(token => {
          this.userToken = token;
        }).catch(err => {
          switch (err.message) {
            case 'Authentication failed':
              this.studentUsernameError = '账号认证失败';
              this.studentPasswordError = ' ';
              break;
            default:
              console.error(err);
              this.$store.commit('appshell/addSnackbarMessage', err.message);
          }
        }).then(() => {
          this.verifyingStudent = false;
        });
      },
      toggleStudentPasswordVisible() {
        this.studentPasswordVisible = !this.studentPasswordVisible;
      },
      onConfirm() {
        if (!this.valid)
          return;
        this.verifying = true;
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
          this.$router.push('/account');
        }).catch((err) => {
          switch (err.message) {
            case 'User already exists':
              this.passwordError = '用户已注册';
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

  .confirm-btn
    flex-grow 1
    max-width 300px
    margin 6px
</style>
