<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text class="pa-4">
            <v-text-field
              label="上游站点"
              :value="$store.state.global.site"
              disabled
            ></v-text-field>
            <v-switch :label="`${socket?'启用':'禁止'}实时消息推送`"
                      v-model="socket"
            ></v-switch>
            <p>禁用掉实时信息可能会导致应用的部分功能出现障碍，同时您的抢票也会有更高的延时。</p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
  export default {
    name: 'messageSettings',
    computed: {
      socket: {
        get() {
          return this.$store.state.global.enableSocket;
        },
        set(value) {
          this.$store.commit('global/setEnableSocket', value);
        }
      }
    }
  }
</script>
