<template>
  <v-container class="xs-pa-0">
    <v-layout column>
      <v-flex v-if="user"
              xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-list subheader>
            <v-subheader>概览</v-subheader>
            <v-list-tile avatar
                         @click="$refs['avatar-input'].click()">
              <v-list-tile-content class="label">
                <p>头像</p>
              </v-list-tile-content>
              <v-list-tile-avatar v-if="uploading">
                <v-progress-circular indeterminate>
                </v-progress-circular>
              </v-list-tile-avatar>
              <v-list-tile-content v-else-if="!avatar" class="value editable">
                <p>未设置</p>
              </v-list-tile-content>
              <v-list-tile-avatar v-else>
                <img :src="avatar" alt="avatar">
              </v-list-tile-avatar>
              <input ref="avatar-input" type="file"
                     accept="image/png,image/gif,image/jpeg"
                     @change="onUpdateAvatar">
            </v-list-tile>
            <v-list-tile @click="onBindTsinghua">
              <v-list-tile-content class="label">
                <p>学生信息</p>
              </v-list-tile-content>
              <v-list-tile-content v-if="!user.studentId"
                                   class="value editable">
                <p>未爬取</p>
              </v-list-tile-content>
              <v-list-tile-content v-else class="value">
                <p>已爬取</p>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click.stop="onBindWechat">
              <v-list-tile-content class="label">
                <p>绑定微信</p>
              </v-list-tile-content>
              <v-list-tile-content class="value editable">
                <p>{{user.wechatId ? '解除绑定' : '未绑定'}}</p>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="onBindEmail">
              <v-list-tile-content class="label">
                <p>邮箱</p>
              </v-list-tile-content>
              <v-list-tile-content v-if="!user.email"
                                   class="value editable">
                <p>未绑定</p>
              </v-list-tile-content>
              <v-list-tile-content v-else class="value">
                <p>已绑定</p>
              </v-list-tile-content>
            </v-list-tile>
            <v-subheader>学生信息</v-subheader>
            <v-list-tile>
              <v-list-tile-content class="label">
                <p>用户名</p>
              </v-list-tile-content>
              <v-list-tile-content class="value">
                <p>{{user.username}}</p>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content class="label">
                <p>学号</p>
              </v-list-tile-content>
              <v-list-tile-content class="value">
                <p>{{user.studentId || '（未知）'}}</p>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content class="label">
                <p>姓名</p>
              </v-list-tile-content>
              <v-list-tile-content class="value">
                <p>{{user.realname || '（未知）'}}</p>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content class="label">
                <p>部门</p>
              </v-list-tile-content>
              <v-list-tile-content class="value">
                <p>{{user.department || '（未知）'}}</p>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content class="label">
                <p>邮箱</p>
              </v-list-tile-content>
              <v-list-tile-content class="value">
                <p>{{user.email || '（未知）'}}</p>
              </v-list-tile-content>
            </v-list-tile>
            <v-subheader v-if="wechatUser">微信信息{{user.wechatId ? '' : '（未绑定）'}}</v-subheader>
            <v-list-tile v-if="wechatUser" avatar>
              <v-list-tile-content class="label">
                <p>微信头像</p>
              </v-list-tile-content>
              <v-list-tile-avatar v-if="wechatUser.avatarThumbnail">
                <img :src="wechatUser.avatarThumbnail" alt="wechat-avatar">
              </v-list-tile-avatar>
              <v-list-tile-content v-else class="value">
                <p>（未知）</p>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="wechatUser">
              <v-list-tile-content class="label">
                <p>微信昵称</p>
              </v-list-tile-content>
              <v-list-tile-content class="value">
                <p>{{wechatUser.nickname || '（未知）'}}</p>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="wechatUser">
              <v-list-tile-content class="label">
                <p>性别</p>
              </v-list-tile-content>
              <v-list-tile-content class="value">
                <p>{{['（未知）', '男', '女'][wechatUser.gender || 0]}}</p>
              </v-list-tile-content>
            </v-list-tile>
            <v-subheader>安全</v-subheader>
            <v-list-tile>
              <v-list-tile-content class="label">
                <p>权限</p>
              </v-list-tile-content>
              <v-list-tile-content class="value">
                <p>
                  {{role || '（未知）'}}
                </p>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="logout-btn white--text">
              <v-btn large block
                @click="onLogout">
                退出登录
              </v-btn>
            </v-list-tile>
          </v-list>
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
    name: 'accountInfo',
    data() {
      return {
        uploading: false
      };
    },
    computed: {
      user() {
        return this.$store.getters['auth/user']
      },
      role() {
        const roleMap = {
          'user': '普通用户',
          'publisher': '发布者',
          'administrator': '管理员'
        };
        if (this.user)
          return this.user.roles.map(r => roleMap[r]).join('，')
      },
      wechatUser() {
        return this.$store.getters['auth/wechatUser'];
      },
      avatar() {
        return this.$store.getters['auth/avatarThumbnail'];
      }
    },
    methods: {
      onUpdateAvatar(event) {
        if (this.uploading)
          return;
        const file = this.$refs['avatar-input'].files[0];
        if (!file)
          return;
        if (['image/gif', 'image/jpeg', 'image/png'].indexOf(file.type) === -1) {
          this.$store.commit('appshell/addSnackbarMessage', '未知的图片格式!');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.$store.commit('appshell/addSnackbarMessage', '图片大小必须小于5M!');
          return;
        }
        this.uploading = true;
        this.$store.dispatch('users/patch', {
          _id: this.user._id,
          avatar: file
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        }).then(() => {
          this.uploading = false;
        });
      },
      onLogout() {
        this.$store.commit('auth/updateToken');
        this.$store.commit('appshell/addSnackbarMessage', '退出登录!');
        this.$router.push('/account');
      },
      onBindWechat() {
        this.$store.commit('appshell/setBindWechatDialog', 1);
      },
      onBindTsinghua() {
        if (!this.user.studentId)
          this.$router.push('/account/info/bind-tsinghua');
      },
      onBindEmail() {
        if (!this.user.email)
          this.$router.push('/account/info/bind-email');
      }
    }
  };
</script>

<style lang="stylus" scoped>
  p
    margin-bottom 0
  .label
    font-weight bold
  .value
    align-items flex-end
    color grey
    &.editable
      color #1976d2

  input[type=file]
    display none

  .logout-btn button
      flex-grow 1
      max-width 300px
      background-color rgb(255, 82, 82)!important
</style>

<style lang="stylus">
  .logout-btn .list__tile
    justify-content center!important
</style>
