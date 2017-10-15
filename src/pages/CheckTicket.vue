<template>
  <v-container class="xs-pa-0">
    <v-layout row justify-space-around>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text v-if="!isWechat" class="pa-4">
            <p>目前扫码检票的功能只支持在微信中使用。请在微信中打开本页面。</p>
          </v-card-text>
          <v-card-text v-else-if="wechatSigned !== true" class="pa-4">
            <p v-if="wechatSigned === null">尝试获得微信扫码权限中。</p>
            <p v-else>未能获得微信扫码权限中</p>
          </v-card-text>
          <v-card-text v-else class="pa-4">
            <div class="activity-info" v-if="activity">
              <h3>活动信息</h3>
              <p>
                <span class="label">活动名称:</span>
                <span class="value">{{activity.name}}</span>
              </p>
              <p>
                <span class="label">活动状态:</span>
                <span class="value">{{statusString}}</span>
              </p>
              <p>
                <span class="label">活动时间:</span>
                <span class="value">{{activityTime}}</span>
              </p>
              <p>
                <span class="label">活动票数:</span>
                <span class="value">{{activity.totalTickets}} 张</span>
              </p>
              <p>
                <span class="label">剩余票数:</span>
                <span class="value">{{activity.remainTickets}} 张</span>
              </p>
              <p>
                <span class="label">已检票数:</span>
                <span class="value">{{activity.checkedTickets}} 张</span>
              </p>
            </div>
            <v-checkbox label="连续扫码检票" v-model="continuous" light></v-checkbox>
            <p>启用连续检票后，只会在取消或遇到错误时停止扫码检票。</p>
            <v-layout align-center column>
              <v-btn class="scan-btn" large block
                     :disabled="loading"
                     :loading="loading"
                     @click="onScan">扫码检票</v-btn>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {durationToString, activityStatus, activityStatusString} from './utils';

  export default {
    name: 'checkTicket',
    data() {
      return {
        continuous: false,
        loading: false,
        activity: null
      }
    },
    computed: {
      isWechat() {
        return this.$store.state.global.isWechat;
      },
      wechatSigned() {
        return this.$store.state.global.wechatSigned;
      },
      activityTime() {
        if (this.activity)
          return durationToString(this.activity.beginTime, this.activity.endTime);
        return '';
      },
      serverTime() {
        return this.$store.state.global.serverTime;
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
      }
    },
    methods: {
      onScan() {
        if (this.wechatSigned === true)
        this.loading = true;
        wx.scanQRCode({
          needResult: 1,
          success: res => {
            this.$store.dispatch('tickets/checkTicketToken', res.resultStr).then(activity => {
              this.activity = activity;
              if (this.continuous)
                this.onScan();
            }).catch(err => {
              this.activity = null;
              console.error(err);
              this.$store.commit('appshell/addSnackbarMessage', err.message);
            }).then(() => {
              this.loading = false;
            })
          },
          failed: res => {
            console.error(res);
            this.$store.commit('appshell/addSnackbarMessage', res.errMsg);
            this.loading = false;
            this.activity = null;
          },
          cancel: () => {
            this.loading = false;
            this.activity = null;
          }
        });
      }
    },
    mounted() {
      this.$store.dispatch('global/signWechatJsApi').catch(err => {
        console.error(err);
        this.$store.commit('appshell/addSnackbarMessage', err.message);
      });
    }
  };
</script>


<style lang="stylus" scoped>
  .scan-btn
    max-width 150px
    margin 6px

  .activity-info
    h3
      font-size 20px
      font-weight normal
      margin 0
      color grey
    margin 0
    p
      margin 0
    .label
      font-weight bold
</style>
