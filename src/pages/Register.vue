<template>
  <v-container fluid class="pa-2">
    <v-layout row justify-space-around>
      <v-stepper :value="step" vertical class="register-panel">
        <v-stepper-step :step="1" :complete="studentId">验证学生清华</v-stepper-step>
        <v-stepper-content :step="1">
          <!-- Fake elements -->
          <input class="fake-input" type="email">
          <input class="fake-input" type="password">
          <p>请输入您的<b>清华学生账号</b>：</p>
          <v-text-field
            label="用户名或学号"
            type="text"
            v-model="username"
            @keyup.native.enter="onRegister"
            :error-messages="usernameError ? [usernameError] : []"
          ></v-text-field>
          <v-text-field
            label="密码"
            type="password"
            v-model="password"
            @keyup.native.enter="onRegister"
            :append-icon="passwordVisible ? 'visibility_off' : 'visibility'"
            :append-icon-cb="togglePasswordVisible"
            :type="passwordVisible ? 'text' : 'password'"
            :error-messages="passwordError ? [passwordError] : []"
          ></v-text-field>
          <small>* 这里的密码仅用于验证您的身份。</small><br>
          <v-btn
            primary
            :disabled="!registerValid"
            @click.native="onRegister"
          >
            验证
          </v-btn>
        </v-stepper-content>
        <v-stepper-step :step="2" :complete="step > 2">绑定微信</v-stepper-step>
        <v-stepper-content :step="2">
          <p>验证学生清华</p>
          <v-btn primary>下一步</v-btn>
        </v-stepper-content>
        <v-stepper-step :step="3" :complete="step > 3">确认信息</v-stepper-step>
        <v-stepper-content :step="3">
          <p>您已完成注册！登录后会跳回主页。</p>
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
        username: '',
        usernameError: null,
        password: '',
        passwordError: null,
        passwordVisible: false,
        studentId: null,
        registering: false,
        step: 1
      };
    },
    computed: {
      registerValid() {
        return !this.usernameError && !this.passwordError &&
          this.username && this.password && !this.registering && !this.studentId;
      },
    },
    watch: {
      username() {
        if (this.username.length === 0)
          this.usernameError = '用户名不能为空';
        else
          this.usernameError = null;
        if (this.passwordError === ' ')
          this.passwordError = null;
      },
      password() {
        if (this.password.length === 0)
          this.passwordError = '密码不能为空';
        else
          this.passwordError = null;
        if (this.usernameError === '账号认证失败')
          this.usernameError = null;
      },
    },
    methods: {
      onRegister() {
        if (!this.registerValid)
          return;
        this.$store.dispatch('users/create', {
          username: this.username,
          password: this.password
        }).then(result => {
          this.studentId = result._id;
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
        })
      },
      togglePasswordVisible() {
        this.passwordVisible = !this.passwordVisible;
      }
    }
  };
</script>

<style lang="stylus">
  .fake-input
    display none
  .register-panel
    max-width 600px
    flex-grow 1
</style>
