<template>
  <v-container class="xs-pa-0">
    <v-layout row justify-space-around>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text>
            <v-btn @click="onScan">扫描二维码</v-btn>
            <div style="word-wrap: break-word">{{error}}</div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'checkTicket',
    data() {
      return {
        error: ''
      }
    },
    computed: {
      isWechat() {
        return this.$store.state.global.isWechat;
      }
    },
    methods: {
      onScan() {
        wx.scanQRCode({
          needResult: 1,
          success: res => {
            this.error += JSON.stringify(res);
            this.onScan();
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
