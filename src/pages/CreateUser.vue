<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text class="pa-4">
            <v-text-field
              label="用户名"
              type="text"
              v-model="username"
              @keyup.native.enter="onConfirm"
              :error-messages="usernameError ? [usernameError] : []"
              required
            ></v-text-field>
            <v-text-field
              label="密码"
              v-model="password"
              @keyup.native.enter="onConfirm"
              :append-icon="passwordVisible ? 'visibility_off' : 'visibility'"
              :append-icon-cb="togglePasswordVisible"
              :type="passwordVisible ? 'text' : 'password'"
              :error-messages="passwordError ? [passwordError] : []"
              required
            ></v-text-field>
            <v-select
              multiple label="权限"
              :items="['用户', '发布者', '管理员']"
              v-model="roles"
            ></v-select>
            <v-layout justify-center>
              <v-btn class="confirm-btn" primary large block
                     :disabled="!formValid"
                     :loading="loading"
                     @click.native="onConfirm"
              >创建</v-btn>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'createUser',
    data() {
      return {
        username: '',
        usernameError: null,
        password: '',
        passwordError: null,
        roles: ['用户'],
        passwordVisible: false,
        loading: false
      }
    },
    computed: {
      formValid() {
        return !this.loading && this.username && this.password &&
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
      onConfirm() {
        if (!this.formValid)
          return;
        this.loading = true;
        const reverseRoleMap = new Map([
          ['用户', 'user'],
          ['发布者', 'publisher'],
          ['管理员', 'administrator']
        ]);
        const roles = this.roles.map(r => reverseRoleMap.get(r));
        const payload = {
          username: this.username,
          password: this.password,
          roles
        };
        this.$store.dispatch('users/create', payload)
          .then(result => {
            this.$store.commit('appshell/addSnackbarMessage', '创建用户成功！');
            this.$router.push('/admin/users');
          }).catch(error => {
          switch (error.message) {
            case 'User already exists':
              this.usernameError = '该用户已被注册';
              break;
            default:
              console.error(error);
              this.$store.commit('appshell/addSnackbarMessage', error.message);
          }
        }).then(() => {
          this.loading = false;
        });
      },
      togglePasswordVisible() {
        this.passwordVisible = !this.passwordVisible;
      }
    }
  };
</script>


<style lang="stylus" scoped>
  .confirm-btn
    max-width 300px
    margin 6px
</style>
