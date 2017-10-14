<template>
  <div class="bg-color">
    <v-container class="xs-fullscreen xs-pa-0"
                 v-scroll="{callback: onScroll}"
                 ref="container"
    >
      <v-layout column>
        <v-flex v-if="user"
                xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
          <v-card class="ma-2 activity-card" v-for="ticket in tickets"
                  :key="ticket._id"
                  v-if="getActivity(ticket)"
          >
            <v-card-media
              class="white--text"
              height="100px"
              :src="getActivity(ticket).titleImageThumbnail"
              @click.native="$router.push(`/ticket/${ticket._id}`)"
            >
              <v-container fill-height fluid class="xs-pa-1">
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline">{{getActivity(ticket).name}}</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-media>
            <v-card-text class="xs-pa-1">
              <p>
                <span class="label">电子票状态：</span>
                {{['已检票', '未检票', '已过期'][getStatus(ticket)]}}
              </p>
              <div v-if="getStatus(ticket) === 1">
                <p>
                  <span class="label">活动时间：</span>
                  {{activityDuration(ticket)}}
                </p>
                <p>
                  <span class="label">活动地点：</span>
                  {{getActivity(ticket).place}}
                </p>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn flat icon
                     @click.stop="goingToDelete = ticket._id">
                <v-icon>delete</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn flat icon
                     @click="$router.push(`/activity/${getActivity(ticket)._id}`)">
                <v-icon>event_note</v-icon>
              </v-btn>
              <v-btn flat icon
                     @click="$router.push(`/ticket/${ticket._id}`)">
                <v-icon>forward</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex class="pa-2" ref="loader">
          <v-layout justify-space-around>
            <v-progress-circular v-if="!finished" indeterminate>
            </v-progress-circular>
            <p v-else class="grey--text">没有更多您的电子票啦╮(╯_╰)╭</p>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog :value="!!goingToDelete" persistent>
      <v-card>
        <v-card-title class="headline">确认删除电子票？</v-card-title>
        <v-card-text>
          <p>删除的电子票将<b>永远无法找回</b>。如果您还未检票，可以继续参与抢票。</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="goingToDelete = null">取消</v-btn>
          <v-btn flat primary @click.native="deleteTicket">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {durationToString} from './utils';

  export default {
    name: 'tickets',
    data() {
      return {
        finished: false,
        loading: false,
        goingToDelete: null
      };
    },
    computed: {
      tickets() {
        let list = Object.values(this.$store.state.tickets.tickets);
        list = list.filter(x => x.owner === this.user._id);
        list.sort((x, y) => {
          return x._id > y._id ? -1 : 1;
        });
        list.forEach(ticket => {
          if (!this.getActivity(ticket))
            this.$store.dispatch('activities/get', ticket.activity).catch(err => {
              console.error(err);
              this.$store.commit('appshell/addSnackbarMessage', err.message);
            });
        });
        return list;
      },
      lastId() {
        if (!this.tickets.length)
          return null;
        return this.tickets[this.tickets.length - 1]._id;
      },
      user() {
        return this.$store.getters['auth/user'];
      },
      activities() {
        return this.$store.state.activities.activities;
      },
      serverTime() {
        return this.$store.state.global.serverTime;
      },
      deleteDialog: {
        get() {
          return !!this.goingToDelete;
        },
        set(v) {
          if (!v)
            this.goingToDelete = null;
        }
      }
    },
    methods: {
      queryNext() {
        if (!this.user)
          return;
        const query = {limit: 5};
        if (this.lastId)
          query.lastId = this.lastId;
        this.loading = true;
        this.$store.dispatch('tickets/find', query).then(data => {
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
      getActivity(ticket) {
        return this.activities[ticket.activity] || null;
      },
      getStatus(ticket) {
        const activity = this.getActivity(ticket);
        if (ticket.status === 0)
          return 0;
        else if (activity.endTime.getTime() < this.serverTime)
          return 2;
        else
          return 1;
      },
      activityDuration(ticket) {
        const activity = this.getActivity(ticket);
        return durationToString(activity.beginTime, activity.endTime);
      },
      deleteTicket() {
        const id = this.goingToDelete;
        this.goingToDelete = null;
        this.$store.dispatch('tickets/deleteTicket', id).then(() => {
          this.$store.commit('appshell/addSnackbarMessage', '成功删除电子票');
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      }
    },
    watch: {
      user() {
        if (this.tickets.length < 5)
          this.queryNext();
      }
    },
    mounted() {
      if (this.tickets.length < 5)
        this.queryNext();
    }
  }
</script>

<style lang="stylus" scoped>
  .activity-card
    .headline
      text-shadow 0 0 5px rgba(0,0,0,0.6)
    p
      margin 0 4px
    .label
      font-weight bold
</style>
