<template>
  <v-container class="xs-pa-0">
    <v-layout column>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-expansion-panel inset >
            <v-expansion-panel-content v-for="(item,i) in faq" :key="i">
              <div slot="header">{{item[0]}}</div>
              <v-card>
                <v-card-text class="grey lighten-3">
                  {{item[1]}}
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import faq from '../faq.json';

  export default {
    name: 'faq',
    data() {
      return {
        faq
      };
    }
  };
</script>
