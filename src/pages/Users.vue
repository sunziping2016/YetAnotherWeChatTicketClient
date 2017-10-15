<template>

  <v-container class="xs-pa-0">
    <v-layout column>
      <v-flex v-if="user"
              xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
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
  export default {
    name: 'users',
    computed: {
      user() {
        return this.$store.getters['auth/user']
      }
    }
  };
</script>

<style lang="stylus" scoped>
</style>
