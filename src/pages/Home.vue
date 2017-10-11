<template>
  <div class="bg-color">
  <v-container class="xs-pa-0 xs-fullscreen-withnav"
               v-scroll="{callback: onScroll}"
               ref="container"
  >
    <v-layout column>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="ma-2" v-for="activity in activities"
                :key="activity._id"
                @click.native="$router.push(`/activity/${activity._id}`)"
        >
          <v-card-media
            class="white--text"
            height="140px"
            :src="activity.titleImageThumbnail"
          >
            <v-container fill-height fluid class="xs-pa-2">
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox>
                  <span class="headline">{{activity.name}}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>
          <v-card-text class="xs-pa-2">
            <div>
              <span>{{activity.excerption}}</span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn flat @click="$router.push(`/activity/${activity._id}`)">查看更多</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex class="pa-2" ref="loader">
        <v-layout justify-space-around>
          <v-progress-circular v-if="!finished" indeterminate>
          </v-progress-circular>
          <p v-else class="grey--text">没有更多活动啦╮(╯_╰)╭</p>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        finished: false,
        loading: false
      };
    },
    computed: {
      activities() {
        let list = Object.values(this.$store.state.activities.activities);
        //list = list.filter(x => x.published);
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
      }
    },
    methods: {
      queryNext() {
        const query = {published: true, limit: 5};
        if (this.lastId && this.lastBeginTime) {
          query.lastId = this.lastId;
          query.lastBeginTime = this.lastBeginTime;
        }
        this.loading = true;
        this.$store.dispatch('activities/find', query)
          .then(data => {
          if (data.limit !== data.length)
            this.finished = true;
        }).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        }).then(() => {
          this.loading = false;
        })
      },
      onScroll(e) {
        if (!this.loading && !this.finished &&
            document.body.offsetHeight + window.scrollY +
            this.$refs.loader.scrollHeight > document.body.scrollHeight)
          this.queryNext();

      }
    },
    mounted() {
      this.queryNext();
    }
  }
</script>

<style lang="stylus" scoped>
  .headline
    text-shadow 0 0 5px rgba(0,0,0,0.2)
</style>
