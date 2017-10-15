<template>
  <div class="bg-color">
    <v-container class="xs-pa-0"
                 v-scroll="{callback: onScroll}"
                 ref="container"
    >
      <v-layout column>
        <v-flex v-if="realUser"
                xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
          <v-card class="xs-fullscreen">
            <v-list two-line>
              <template v-for="(user,i) in users">
                <v-divider v-if="i != 0" inset></v-divider>
                <v-list-tile avatar :key="user._id" class="user-tile">
                  <v-list-tile-avatar>
                    <img v-if="user.avatarThumbnail" :src="user.avatarThumbnail" alt="avatar">
                    <icon v-else name="user-circle" scale="2.5"></icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{user.username}}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      <v-select class="user-roles-select"
                                solo single-line multiple label="权限"
                                :items="['用户', '发布者', '管理员']"
                                :value="getRoles(user)"
                                @input="setRoles(user, arguments[0])"
                      ></v-select>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn icon
                           @click.stop="goingToDelete = user._id"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                  <v-list-tile-action>
                    <v-btn icon v-if="!user.blocked"
                           @click.stop="goingToBlock = user._id"
                    >
                      <v-icon>block</v-icon>
                    </v-btn>
                    <v-btn icon v-else
                           @click.stop="unblockUser(user._id)"
                    >
                      <v-icon>settings_backup_restore</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog :value="!!goingToDelete" persistent>
      <v-card>
        <v-card-title class="headline">确认删除用户{{goingToDelete && usersMap[goingToDelete].username}}？</v-card-title>
        <v-card-text>
          <p>删除用户是<b>永久的</b>。而用户的用户名等也会开放给新用户注册。和用户绑定的微信号将解除绑定。</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="goingToDelete = null">取消</v-btn>
          <v-btn flat primary @click.native="deleteUser">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="!!goingToBlock" persistent>
      <v-card>
        <v-card-title class="headline">确认屏蔽用户{{goingToBlock && usersMap[goingToBlock].username}}？</v-card-title>
        <v-card-text>
          <p>屏蔽用户后可以撤销。用户在屏蔽期间不可登录。与用户绑定的微信号将继续留存保持绑定关系。用户的用户名等唯一ID会保持占用状态。</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="goingToBlock = null">取消</v-btn>
          <v-btn flat primary @click.native="blockUser">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import 'vue-awesome/icons/user-circle';

  function isArrayEqual(arr1, arr2) {
    return arr1.length === arr2.length &&
      arr1.every(x => arr2.indexOf(x) !== -1);
  }

  export default {
    name: 'users',
    data() {
      return {
        finished: false,
        loading: false,
        goingToDelete: null,
        goingToBlock: null
      };
    },
    computed: {
      usersMap() {
        return this.$store.state.users.users;
      },
      users() {
        let list = Object.values(this.usersMap);
        list.sort((x, y) => {
          return x._id < y._id ? -1 : 1;
        });
        return list;
      },
      lastId() {
        if (!this.users.length)
          return null;
        return this.users[this.users.length - 1]._id;
      },
      realUser() {
        return this.$store.getters['auth/user']
      }
    },
    methods: {
      queryNext() {
        if (!this.realUser)
          return;
        const query = {limit: 10};
        if (this.lastId)
          query.lastId = this.lastId;
        this.loading = true;
        this.$store.dispatch('users/find', query).then(data => {
          if (data.limit !== data.length)
            this.finished = true;
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        }).then(() => {
          this.loading = false;
        });
      },
      onScroll() {
        if (!this.loading && !this.finished &&
          document.body.offsetHeight + window.scrollY +
          this.$refs.loader.scrollHeight > document.body.scrollHeight)
          this.queryNext();
      },
      getRoles(user) {
        const roleMap = {
          'user': '用户',
          'publisher': '发布者',
          'administrator': '管理员'
        };
        return user.roles.map(r => roleMap[r]);
      },
      setRoles(user, roles) {
        const reverseRoleMap = new Map([
          ['用户', 'user'],
          ['发布者', 'publisher'],
          ['管理员', 'administrator']
        ]);
        roles = roles.map(r => reverseRoleMap.get(r));
        if (isArrayEqual(user.roles, roles))
          return;
        this.$store.dispatch('users/patch', {
          _id: user._id,
          roles: roles
        }).catch(err => {
          cdeleteUseronsole.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      },
      deleteUser() {
        const id = this.goingToDelete;
        this.goingToDelete = null;
        this.$store.dispatch('users/deleteUser', id).then(() => {
          this.$store.commit('appshell/addSnackbarMessage', '成功删除用户！');
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      },
      blockUser() {
        const id = this.goingToBlock;
        this.goingToBlock = null;
        this.$store.dispatch('users/patch', {
          _id: id,
          blocked: true
        }).then(() => {
          this.$store.commit('appshell/addSnackbarMessage', '成功屏蔽用户！');
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      },
      unblockUser(id) {
        this.$store.dispatch('users/patch', {
          _id: id,
          blocked: false
        }).then(() => {
          this.$store.commit('appshell/addSnackbarMessage', '成功解除屏蔽用户！');
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      }
    },
    watch: {
      realUser() {
        if (this.users.length < 5)
          this.queryNext();
      }
    },
    mounted() {
      if (this.users.length < 5)
        this.queryNext();
    }
  };
</script>

<style lang="stylus" scoped>
</style>

<style lang="stylus">
  .user-roles-select
    &.input-group .input-group__append-icon
      padding 0!important
    &.input-group.input-group--solo
      max-height 30px
      min-height 30px
      label
        padding-left 0
        top 0
      .input-group__input
        padding 0
  .user-tile
    .list__tile__action
      min-width 36px
</style>
