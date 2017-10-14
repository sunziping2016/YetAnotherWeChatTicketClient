<template>
  <div class="bg-color">
    <v-container class="xs-fullscreen xs-pa-0"
                 v-scroll="{callback: onScroll}"
                 ref="container"
    >
      <v-layout column>
        <v-flex v-if="user"
                xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
          <v-card class="ma-2 activity-card" v-for="activity in activities"
                  :key="activity._id"
          >
            <v-card-media
              class="white--text"
              height="100px"
              :src="activity.titleImageThumbnail"
              @click.native="$router.push(`/admin/drafts/${activity._id}`)"
            >
              <v-container fill-height fluid class="xs-pa-1">
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline">{{activity.name}}</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-media>
            <v-card-text class="xs-pa-1">
              <p>
                <span class="label">活动状态：</span>
                {{activityStatus(activity)}}
              </p>
              <p>
                <span class="label">抢票时间：</span>
                {{durationToString(activity.bookBeginTime, activity.bookEndTime)}}
              </p>
              <p>
                <span class="label">活动时间：</span>
                {{durationToString(activity.beginTime, activity.endTime)}}
              </p>
              <p>
                <span class="label">活动简介：</span>
                {{activity.excerption}}
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn flat icon
                     @click="goingToDelete = activity._id">
                <v-icon>delete</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn flat icon v-if="!activity.published"
                     @click="goingToPublish = activity._id">
                <v-icon>send</v-icon>
              </v-btn>
              <v-btn flat icon v-else
                     @click="goingToUnpublish = activity._id">
                <v-icon>undo</v-icon>
              </v-btn>
              <v-btn flat icon
                     @click="$router.push(`/admin/drafts/edit/${activity._id}`)">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn flat icon
                     @click="$router.push(`/admin/drafts/${activity._id}`)">
                <v-icon>forward</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex class="pa-2" ref="loader">
          <v-layout justify-space-around>
            <v-progress-circular v-if="!finished" indeterminate>
            </v-progress-circular>
            <p v-else class="grey--text">没有更多您的活动啦╮(╯_╰)╭</p>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-fab-transition>
        <v-btn
          exact to="/admin/create-activity"
          class="create-activity-btn"
          dark
          absolute
          right
          fab
          primary
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-container>

    <v-dialog :value="!!goingToDelete" persistent>
      <v-card>
        <v-card-title class="headline">确认删除活动？</v-card-title>
        <v-card-text>
          <p>删除的活动将<b>永远无法找回</b>。</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="goingToDelete = null">取消</v-btn>
          <v-btn flat primary @click.native="deleteActivity">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="!!goingToPublish" persistent>
      <v-card>
        <v-card-title class="headline">确认发布活动？</v-card-title>
        <v-card-text>
          <p>发布活动后如果再召回活动，会使用户的票消失，造成非常不好的影响。</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="goingToPublish = null">取消</v-btn>
          <v-btn flat primary @click.native="publishActivity">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog :value="!!goingToUnpublish" persistent>
      <v-card>
        <v-card-title class="headline">确认召回活动？</v-card-title>
        <v-card-text>
          <p>召回活动会使用户的票消失，造成非常不好的影响。</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="goingToUnpublish = null">取消</v-btn>
          <v-btn flat primary @click.native="unpublishActivity">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {durationToString, activityStatus, activityStatusString} from './utils';

  export default {
    name: 'drafts',
    data() {
      return {
        finished: false,
        loading: false,
        goingToDelete: null,
        goingToPublish: null,
        goingToUnpublish: null
      };
    },
    computed: {
      activities() {
        let list = Object.values(this.$store.state.activities.activities);
        list = list.filter(x => x.creator === this.user._id);
        list.sort((x, y) => {
          const xTime = x.beginTime.getTime(),
            yTime = y.beginTime.getTime();
          if (xTime === yTime) {
            return x._id > y._id ? -1 : 1;
          } else
            return xTime > yTime ? -1 : 1;
        });
        return list;
      },
      lastBeginTime() {
        if (!this.activities.length)
          return null;
        return this.activities[this.activities.length - 1].beginTime.toISOString();
      },
      lastId() {
        if (!this.activities.length)
          return null;
        return this.activities[this.activities.length - 1]._id;
      },
      user() {
        return this.$store.getters['auth/user'];
      },
      serverTime() {
        return this.$store.state.global.serverTime;
      }
    },
    watch: {
      user() {
        if (this.activities.length < 5)
          this.queryNext();
      }
    },
    methods: {
      queryNext() {
        if (!this.user)
          return;
        const query = {limit: 5};
        if (this.lastId && this.lastBeginTime) {
          query.lastId = this.lastId;
          query.lastBeginTime = this.lastBeginTime;
        }
        this.loading = true;
        this.$store.dispatch('activities/find', query).then(data => {
          if (data.limit !== data.length)
            this.finished = true;
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        }).then(() => {
          this.loading = false;
        });
      },
      activityStatus(activity) {
        return activityStatusString(activityStatus(activity, new Date(this.serverTime)));
      },
      durationToString(begin, end) {
        return durationToString(begin, end);
      },
      onScroll() {
        if (!this.loading && !this.finished &&
          document.body.offsetHeight + window.scrollY +
          this.$refs.loader.scrollHeight > document.body.scrollHeight)
          this.queryNext();

      },
      deleteActivity() {
        const id = this.goingToDelete;
        this.goingToDelete = null;
        this.$store.dispatch('activities/deleteActivity', id).then(() => {
          this.$store.commit('appshell/addSnackbarMessage', '成功删除活动');
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      },
      publishActivity() {
        const id = this.goingToPublish;
        this.goingToPublish = null;
        this.$store.dispatch('activities/patch', {
          _id: id,
          published: true
        }).then(() => {
          this.$store.commit('appshell/addSnackbarMessage', '成功发布活动');
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      },
      unpublishActivity() {
        const id = this.goingToUnpublish;
        this.goingToUnpublish = null;
        this.$store.dispatch('activities/patch', {
          _id: id,
          published: false
        }).then(() => {
          this.$store.commit('appshell/addSnackbarMessage', '成功撤回活动');
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      }
    },
    mounted() {
      if (this.activities.length < 5)
        this.queryNext();
    }
  }
</script>

<style lang="stylus" scoped>
  .create-activity-btn
    bottom 16px

  .activity-card
    .headline
      text-shadow 0 0 5px rgba(0,0,0,0.6)
    p
      margin 0 4px
    .label
      font-weight bold
</style>
