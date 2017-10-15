<script src="index.js"></script>
<template>
  <div>
    <v-container class="xs-pa-0" v-scroll="{callback: onScroll}">
      <v-layout>
        <v-flex v-if="activity"
                xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
          <v-card class="xs-fullscreen">
            <v-card-media
              height="100px"
              :src="activity.titleImageThumbnail"
            >
              <div class="activity-image-mask"></div>
            </v-card-media>
            <v-card-text class="pa-0">
              <div class="activity-header">
                <img :src="activity.mainImageThumbnail"
                     class="activity-main-image"
                     alt="main-image">
                <div class="activity-title">
                  <h4>Tsinghua University</h4>
                  <h3>{{activity.name}}</h3>
                  <div>
                    <p v-if="status < 2">
                      <v-icon>access_time</v-icon>
                      <span>抢票倒计时</span>
                      <span v-if="ping !== null">(延时: {{Math.round(ping / 2)}}ms)</span>
                      <span>:</span>
                    </p>
                    <p v-else-if="status === 2">
                      <v-icon>access_time</v-icon>
                      <span>距离抢票结束时间还剩:</span>
                    </p>
                    <p v-if="ping === null" class="activity-timer">与服务器同步时间中<v-icon class="spinning">sync</v-icon></p>
                    <p v-else-if="status < 3" class="activity-timer">{{bookCountingDown}}</p>
                  </div>
                </div>
              </div>
              <div class="activity-info">
                <p>
                  <span class="label">活动状态:</span>
                  <span class="value">{{statusString}}</span>
                </p>
                <p>
                  <span class="label">抢票时间:</span>
                  <span class="value">{{bookTime}}</span>
                </p>
                <p>
                  <span class="label">活动时间:</span>
                  <span class="value">{{activityTime}}</span>
                </p>
                <p>
                  <span class="label">活动地点:</span>
                  <span class="value">{{activity.place}}</span>
                </p>
                <p>
                  <span class="label">活动票数:</span>
                  <span class="value">{{activity.totalTickets}} 张</span>
                </p>
                <p>
                  <span class="label">剩余票数:</span>
                  <span class="value">{{activity.remainTickets}} 张</span>
                </p>
                <v-btn v-if="isUser && status <= 2"
                       primary large block
                       class="buy-ticket-btn"
                       @click="onBuyTicket"
                       :disabled="!valid"
                       :loading="loading"
                >{{bought ? '已购票' : '抢票'}}</v-btn>
              </div>
              <div class="activity-corner"></div>
              <div class="activity-details">
                <h4>活动介绍</h4>
                <p>{{activity.description}}</p>
                <h4>抢票方式</h4>
                <p><b>{{bookTime}}</b> 线上抢票，先到先得！</p>
                <ul ref="extraInfo">
                  <li>在微信中直接回复<span class="important">“抢票 {{activity.shortName}}”</span></li>
                  <li>或者，在微信中点击“抢票”菜单下的<span class="important">“{{activity.shortName}}”</span>按钮</li>
                  <li>或者，点击页面中的“抢票”按钮</li>
                </ul>
              </div>
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
    <transition name="fade">
      <div class="activity-bottom" v-if="bottomVisible">
        <div class="activity-bottom-content">
          <div class="activity-bottom-info">
            <p><b>{{bookTime}}</b> 线上抢票，先到先得！</p>
            <ul>
              <li>在微信中直接回复<span class="important">“抢票 {{activity.shortName}}”</span></li>
              <li>或者，在微信中点击“抢票”菜单下的<span class="important">“{{activity.shortName}}”</span>按钮</li>
              <li>或者，点击页面中的“抢票”按钮</li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {durationToString, countingDownToString,
    activityStatus, activityStatusString} from './utils';

  export default {
    name: 'activity',
    data() {
      return {
        bottomVisible: false,
        loading: false,
        deletedTicket: false
      };
    },
    computed: {
      activity() {
        return this.$store.state.activities.activities[this.$route.params.id] || null;
      },
      activityTime() {
        if (this.activity)
          return durationToString(this.activity.beginTime, this.activity.endTime);
        return '';
      },
      bookTime() {
        if (this.activity)
          return durationToString(this.activity.bookBeginTime, this.activity.bookEndTime);
        return '';
      },
      bookTime() {
        if (this.activity)
          return durationToString(this.activity.bookBeginTime, this.activity.bookEndTime);
        return '';
      },
      bookCountingDown() {
        let countTime;
        if (this.status < 2)
          countTime = this.activity.bookBeginTime.getTime();
        else
          countTime = this.activity.bookEndTime.getTime();
        const time = countTime - this.serverTime;
        if (time > 0)
          return countingDownToString(time);
        return ''
      },
      serverTime() {
        return this.$store.state.global.serverTime;
      },
      ping() {
        return this.$store.state.global.ping;
      },
      status() {
        if (this.activity)
          return activityStatus(this.activity, new Date(this.serverTime));
        return null;
      },
      statusString() {
        if (this.status !== null)
          return activityStatusString(this.status);
        return null;
      },
      isUser() {
        const token = this.token;
        return !!(token && token.role && token.role & 0b001);
      },
      valid() {
        return this.isUser && this.status === 2 && !this.loading && !this.bought;
      },
      bought() {
        if (this.activity && this.token && this.token.uid) {
          const ticket = this.$store.state.tickets.ticketsByActivity[this.activity._id];
          return !!(ticket && ticket.owner === this.token.uid || this.deletedTicket);
        }
        return false;
      },
      token() {
        return this.$store.state.auth.token;
      },
      wechatSigned() {
        return this.$store.state.global.wechatSigned;
      }
    },
    watch: {
      activity() {
        if (this.activity)
          this.$nextTick(() => this.onScroll());
      },
      wechatSigned() {
        if (this.wechatSigned === true)
          this.customizeShare();
      }
    },
    methods: {
      onScroll() {
        if (this.activity && !this.$refs.extraInfo)
          return;
        this.bottomVisible = !!this.activity && !(document.body.offsetHeight + window.scrollY + this.$refs.extraInfo.scrollHeight > document.body.scrollHeight);
      },
      onBuyTicket() {
        if (!this.valid)
          return;
        this.loading = true;
        this.$store.dispatch('tickets/create', {
          activity: this.activity._id
        }).then(() => {
          this.$store.commit('appshell/addSnackbarMessage', '抢票成功！');
        }).catch(err => {
          switch (err.message) {
            case 'One user can only have one ticket':
              if (err.data.deleted) {
                this.deletedTicket = true;
                this.$store.commit('appshell/addSnackbarMessage', '您已经检票，一人一票');
              } else
                this.$store.commit('appshell/addSnackbarMessage', '您已经抢到此活动票，一人一票');
              break;
            case 'Invalid activity':
              this.$store.commit('appshell/addSnackbarMessage', '抢票失败！');
              break;
            default:
              console.error(err);
              this.$store.commit('appshell/addSnackbarMessage', err.message);
          }
        }).then(() => {
          this.loading = false;
        });
      },
      customizeShare() {
        if (this.wechatSigned) {
          console.log('haha');
          wx.onMenuShareTimeline({
            title: this.activity.name + ' - 紫荆之声',
            link: location.origin + '/#/activity/' + this.activity._id,
            imgUrl: location.origin + this.activity.mainImageThumbnail
          });
          wx.onMenuShareAppMessage({
            title: this.activity.name + ' - 紫荆之声', // 分享标题
            desc: this.activity.excerption,
            link: location.origin + '/#/activity/' + this.activity._id,
            imgUrl: location.origin + this.activity.mainImageThumbnail
          });
        }
      }
    },
    mounted() {
      if (!this.activity) {
        this.$store.dispatch('activities/get', this.$route.params.id).catch(err => {
          console.error(err);
          this.$store.commit('appshell/addSnackbarMessage', err.message);
        });
      }
      if (this.activity)
        this.onScroll();
      this.$store.dispatch('global/signWechatJsApi');
      this.customizeShare();
    }
  };
</script>

<style lang="stylus" scoped>
  .activity-image-mask
    position absolute
    width 100%
    height 100%
    background url(/static/img/mask.png) repeat

  .activity-main-image
    width 120px
    margin -30px 10px 0
    position relative
    border 2px solid #1e2329
    border-radius 3px
    float left

  .activity-title
    margin-left 130px
    h4 // tsinghua
      font-size 1em
      line-height 1em
      color #555
      padding 10px 0 0
      margin 0
    h3 // name
      color #dd001e
      font-size 1.8em
      padding 5px 0
      font-weight 400
      margin 0
    p // Counting Down panel
      font-size 1em
      line-height 1.6em
      color #dd001e
      margin 0
    .icon
      color rgba(0,0,0,0.3)
      font-size 1.6em
      text-indent 0
    .activity-timer
      text-indent 2em

  .activity-info
    line-height 1.5em
    padding 13px 0
    margin 0 10px
    clear both
    p
      margin 3px

    .label
      font-size 1.2em
      color #a2abc3
    .value
      font-size 1.2em
      margin 0 8px
      font-weight 800

  .activity-corner
    background-color rgb(30, 35, 41)
    &:before
      content ''
      position relative
      top -6px
      left 0
      width 100%
      display block
      transform translateZ(0)
      padding 5px 0
      background radial-gradient(transparent 0,transparent 4px,#fff 4px,#fff)
      background-size 9px 22px
      background-position 0 -17px
      overflow hidden
    &:after
      content ''
      left 5px
      top 5px
      right 5px
      bottom 5px
      z-index -1

  .activity-details
    background-color rgb(30, 35, 41)
    color #d4d4d4
    padding 15px
    h4
      font-weight bold
    p
      margin-bottom 8px
  .important
    color #d0dd1e
    font-style italic


  .activity-bottom
    position fixed
    left 0
    bottom 0
    padding-bottom 130px
    width 100%
    background url(/static/img/bottom_mask.png) repeat-x 140px
    z-index 6
  .activity-bottom-content
    left 0
    bottom 0
    height 100px
    width 100%
    background rgba(0,0,0,.8)
    position fixed
    display block
    overflow hidden
    z-index 6
    margin 0
    &:before
      content ''
      position absolute
      top -6px
      left 0
      width 100%
      display block
      transform translateZ(0)
      padding 5px 0
      background radial-gradient(transparent 0,transparent 4px,#1e2329 4px,#1e2329)
      background-size 9px 22px
      background-position 0 -17px
      overflow hidden
  .activity-bottom-info
    margin 9px
    padding 9px
    background url(/static/img/ticket.gif)
    height 100px
    color white
    font-size 0.9em
    p
      margin 0

  .spinning
    animation spin 2s linear infinite;

  @keyframes spin
    100%
      transform rotate(-360deg)

  .buy-ticket-btn
    max-width 160px
    margin 12px auto 6px

  .fade-enter-active, .fade-leave-active
    transition opacity 1s
  .fade-enter, .fade-leave-to
    opacity 0
</style>
