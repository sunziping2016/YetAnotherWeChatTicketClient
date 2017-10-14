<template>
  <v-container class="xs-pa-0"  v-resize="onResize">
    <v-layout>
      <v-flex v-if="ticket && activity"
              xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen ticket-card">
          <v-card-text class="pa-2">
            <dl>
              <dt>我的电子票</dt>
              <dd>
                <h3>
                  {{activity.name}}
                  <span class="ticket-status">
                    {{['已检票', '未检票', '已过期'][status]}}
                  </span>
                </h3>
                <div class="ticket-info">
                  <p>
                    <span class="label">活动时间：</span>
                    {{activityDuration}}
                  </p>
                  <p>
                    <span class="label">活动地点：</span>
                    {{activity.place}}
                  </p>
                  <p>
                    <span class="label">退票方式：</span>
                    微信中回复“退票 {{activity.shortName}}”或点击“我的票夹”的删除
                  </p>
                </div>
                <div class="dot"></div>
              </dd>
              <dd>
                <div v-if="status === 1" class="ticket-qrcode">
                  <qrcode v-if="token" :value="token"
                          :size="240"
                          :fg-color="expired || loading ? '#e6e6e6' : '#000000'"
                          class="ma-2"
                  ></qrcode>
                  <div v-if="expired || loading" class="expired-mask">
                    <v-btn
                      fab
                      large
                      :loading="loading"
                      :disabled="loading"
                      @click="fetchToken"
                    >
                      <v-icon>refresh</v-icon>
                    </v-btn>
                  </div>
                </div>
                <p v-if="status === 1 && !expired">将二维码交至活动举办方即可检票。</p>
                <p v-else-if="status === 1 && expired">二维码过期，请刷新。</p>
                <div class="large-dot"></div>
              </dd>
            </dl>
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
</template>

<script>
  import {durationToString} from './utils';
  import QRCode from './QRCode.vue';

  export default {
    name: 'ticket',
    data() {
      return {
        loading: false,
        token: null,
        expired: false,
        expireTimeout: null
      }
    },
    computed: {
      user() {
        return this.$store.getters['auth/user'];
      },
      ticket() {
        return this.$store.state.tickets.tickets[this.$route.params.id] || null;
      },
      activity() {
        if (this.ticket)
          return this.$store.state.activities.activities[this.ticket.activity] || null;
        return null;
      },
      serverTime() {
        return this.$store.state.global.serverTime;
      },
      status() {
        if (this.ticket && this.activity) {
          if (this.ticket.status === 0)
            return 0;
          else if (this.activity.endTime.getTime() < this.serverTime)
            return 2;
          else
            return 1;
        }
      },
      activityDuration() {
        if (this.activity)
          return durationToString(this.activity.beginTime, this.activity.endTime);
      },
    },
    watch: {
      user() {
        if (this.user) {
          this.fetchTicket();
          this.fetchActivity();
          this.fetchToken();
        }
      },
      ticket() {
        if (this.ticket) {
          this.fetchActivity();
          this.fetchToken();
        }
      }
    },
    methods: {
      onResize() {
        this.qrsize = 200;
      },
      fetchTicket() {
        if (this.user && !this.ticket) {
          this.$store.dispatch('tickets/get', this.$route.params.id).catch(err => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
          });
        }
      },
      fetchActivity() {
        if (this.user && this.ticket && !this.activity) {
          this.$store.dispatch('activities/get', this.ticket.activity).catch(err => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
          });
        }
      },
      fetchToken() {
        if (this.user && this.ticket && this.ticket.status === 1) {
          if (this.expireTimeout) {
            clearTimeout(this.expireTimeout);
            this.expireTimeout = null;
          }
          this.loading = true;
          this.$store.dispatch('tickets/getTicketToken', this.$route.params.id).then(token => {
            this.token = token;
            this.expired = false;
            this.expireTimeout = setTimeout(() => {
              this.expired = true;
              this.expireTimeout = null;
            }, (2 * 60 - 5) * 1000);
          }).catch(err => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
          }).then(() => {
            this.loading = false;
          });
        }
      }
    },
    mounted() {
      this.fetchTicket();
      this.fetchActivity();
      this.fetchToken();
    },
    components: {
      qrcode: QRCode
    }
  }
</script>

<style lang="stylus" scoped>
  .ticket-card
    background-color #1e2329

    dl
      background #fff
      border-radius 5px 5px 0 0
      margin-bottom 24px

    dt
      font-size: 1.1em
      height: 30px;
      border-radius: 5px 5px 0 0;
      line-height: 30px;
      background: #f2f2f2;
      overflow: hidden;
      padding: 0 10px;

    dd
      position relative
      padding 10px
      &:first-of-type
        &::after, &::before
          position absolute
          bottom: -10px;
          height: 20px;
          width: 10px;
          content: "";
          background: #1b1f25
        &::before
          right: 0;
          border-radius: 10px 0 0 10px;
        &::after
          left: 0;
          border-radius: 0 10px 10px 0;
      &:nth-of-type(2)
        text-align center

    .dot, .large-dot
      position: absolute;
      left: 0
      border-bottom: 0;
      width: 100%;
    .dot
      bottom: -4px;
      padding: 4px 0;
      background: radial-gradient(#1e2329 2px,#1e2329 2px,transparent 3px,transparent);
      background-size: 7px 7px;
      background-position: 0 71px;
    .large-dot
      bottom: 0;
      padding: 3px 0;
      background: radial-gradient(#1e2329 5px,#1e2329 5px,transparent 6px,transparent);
      background-size: 13px 13px;
      background-position: 0 78px;

    h3
      font-size 18px
      line-height 18px
      color #e30011
      font-weight 400
      margin 10px 0
    .ticket-status
      background: #a7adb4;
      color: #fff;
      padding: 2px 5px;
      border-radius: 2px;
      font-size 16px
    .ticket-info
      p
        margin 0 16px;
      .label
        font-weight bold
    .ticket-qrcode
      margin: 16px
      border-radius: 10px;
      border: dotted;
      border-color: #aeaeae;
      display inline-block
      position relative
    .ticket-qrcode-loading
      min-height 100px
    .expired-mask
      position absolute
      width 100%
      top 0
      bottom 0
      display flex
      justify-content center
      align-items center
</style>
