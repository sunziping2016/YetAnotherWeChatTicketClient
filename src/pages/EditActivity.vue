<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex v-if="activity"
              xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text class="pa-4">
            <v-layout justify-center column>
              <v-text-field
                label="名称"
                type="text"
                v-model="name"
                @keyup.native.enter="onConfirm"
                :counter="20"
                :error-messages="nameError ? [nameError] : []"
                required
              ></v-text-field>
              <v-text-field
                label="短名称"
                type="text"
                v-model="shortName"
                @keyup.native.enter="onConfirm"
                :counter="10"
              ></v-text-field>
              <v-text-field
                label="地点"
                type="text"
                v-model="place"
                @keyup.native.enter="onConfirm"
                :counter="20"
                :error-messages="placeError ? [placeError] : []"
              ></v-text-field>
              <v-text-field
                type="number"
                label="总票数"
                :min="0"
                :step="1"
                :value="totalTickets"
                disabled
                required
              ></v-text-field>
              <v-layout>
                <date-time-pickle
                  class="first-date-time"
                  label="活动开始时间"
                  v-model="beginTime"
                  :min="dateMax(serverTime, bookBeginTime)"
                  :max="endTime"
                  required
                ></date-time-pickle>
                <date-time-pickle
                  class="second-date-time"
                  label="活动结束时间"
                  v-model="endTime"
                  :min="dateMax(serverTime, beginTime, bookBeginTime, bookEndTime)"
                  required
                ></date-time-pickle>
              </v-layout>
              <v-layout>
                <date-time-pickle
                  class="first-date-time"
                  label="抢票开始时间"
                  v-model="bookBeginTime"
                  :min="serverTime"
                  :max="dateMin(beginTime, endTime, bookEndTime)"
                  required
                ></date-time-pickle>
                <date-time-pickle
                  class="second-date-time"
                  label="抢票结束时间"
                  v-model="bookEndTime"
                  :min="dateMax(serverTime, bookBeginTime)"
                  :max="endTime"
                  required
                ></date-time-pickle>
              </v-layout>
              <v-text-field
                label="介绍"
                v-model="description"
                :rows="4"
                multi-line
              ></v-text-field>
              <v-text-field
                label="介绍摘要"
                v-model="excerption"
                :counter="100"
                :error-messages="excerptionError ? [excerptionError] : []"
                :rows="2"
                multi-line
              ></v-text-field>
              <file-field
                label="封面"
                accept="image/png,image/gif,image/jpeg"
                v-model="mainImage"
                :error-messages="mainImageError ? [mainImageError] : []"
              >
              </file-field>
              <file-field
                label="题图"
                accept="image/png,image/gif,image/jpeg"
                v-model="titleImage"
                :error-messages="titleImageError ? [titleImageError] : []"
              >
              </file-field>
              <p>* 为必填项。封面建议是竖向的图片，而题图建议是横向的图片。</p>
              <v-layout justify-center>
                <v-btn
                  class="confirm-btn"
                  primary large block
                  :disabled="!valid"
                  :loading="verifying"
                  @click.native="onConfirm"
                >提交修改</v-btn>
              </v-layout>
            </v-layout>
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
  import activities from "../store/activities";

  export default {
    name: 'editActivity',
    data() {
      return {
        name: '',
        nameError: null,
        shortName: '',
        place: '',
        placeError: null,
        beginTime: null,
        endTime: null,
        bookBeginTime: null,
        bookEndTime: null,
        description: '',
        excerption: '',
        excerptionError: null,
        totalTickets: '',
        mainImage: null,
        mainImageError: null,
        titleImage: null,
        titleImageError: null,
        verifying: false
      };
    },
    watch: {
      name() {
        if (this.name.length === 0)
          this.nameError = '活动名称不能为空';
        else if (this.name.length > 20)
          this.nameError = '活动名称不能超过20字';
        else
          this.nameError = null;
      },
      place() {
        if (this.place.length > 20)
          this.placeError = '活动地点不能超过20字';
        else
          this.placeError = null;
      },
      mainImage() {
        const file = this.mainImage;
        if (!file)
          this.mainImageError = '封面图是必不可少滴';
        else if (['image/gif', 'image/jpeg', 'image/png'].indexOf(file.type) === -1)
          this.mainImageError = '你这是上传的啥文件？';
        else if (file.size > 10 * 1024 * 1024)
          this.mainImageError = '你这啥图辣么大，让我瞅瞅';
        else
          this.mainImageError = null;
      },
      titleImage() {
        const file = this.titleImage;
        if (!file)
          this.titleImageError = null;
        else if (['image/gif', 'image/jpeg', 'image/png'].indexOf(file.type) === -1)
          this.titleImageError = '你这是上传的啥文件？';
        else if (file.size > 10 * 1024 * 1024)
          this.titleImageError = '你这啥图辣么大，让我瞅瞅';
        else
          this.titleImageError = null;
      },
      excerption() {
        if (this.excerption.length > 100)
          this.excerptionError = '介绍摘要不能超过100字';
        else
          this.excerptionError = null;
      },
      user() {
        if (this.user)
          this.fetchActivity();
      },
      activity(value, oldValue) {
        if (value && !oldValue)
          this.updateActivity();
      }
    },
    computed: {
      valid() {
        return !this.verifying && this.name && !this.nameError &&
          !this.placeError &&  this.beginTime && this.endTime &&
          this.bookBeginTime && this.bookEndTime &&
          !this.excerptionError;
      },
      activity() {
        return this.$store.state.activities.activities[this.$route.params.id];
      },
      user() {
        return this.$store.getters['auth/user'];
      },
      serverTime() {
        return new Date(this.$store.state.global.serverTime);
      }
    },
    mounted() {
      if (this.activity)
        this.updateActivity();
      else
        this.fetchActivity();
    },
    methods: {
      fetchActivity() {
        if (this.user && !this.activity) {
          this.$store.dispatch('activities/get', this.$route.params.id)
            .catch(err => {
              this.$store.commit('appshell/addSnackbarMessage', err.message);
            });
        }
      },
      updateActivity() {
        this.totalTickets = String(this.activity.totalTickets);
        ['name', 'shortName', 'place', 'beginTime', 'endTime', 'bookBeginTime',
          'bookEndTime', 'description', 'excerption'].forEach(key => {
          if (this.activity[key])
            this[key] = this.activity[key];
        });
      },
      onConfirm() {
        if (!this.valid)
          return;
        this.verifying = true;
        const data = {
          _id: this.$route.params.id,
          name: this.name,
          shortName: this.shortName,
          place: this.place,
          beginTime: this.beginTime,
          endTime: this.endTime,
          bookBeginTime: this.bookBeginTime,
          bookEndTime: this.bookEndTime,
          description:  this.description,
          excerption: this.excerption
        };
        if (this.titleImage)
          data.titleImage = this.titleImage;
        if (this.mainImage)
          data.mainImage = this.titleImage;
        this.$store.dispatch('activities/patch', data).then(() => {
          this.$router.push('/admin/drafts');
        }).catch(err => {
            console.error(err);
            this.$store.commit('appshell/addSnackbarMessage', err.message);
        }).then(() => {
          this.verifying = false;
        });
      },
      dateMin() {
        let min = null;
        for (let date of arguments) {
          if (date !== null && (min === null || date.getTime() < min))
            min = date;
        }
        return min;
      },
      dateMax() {
        let max = null;
        for (let date of arguments)
          if (date !== null && (max === null || date.getTime() > max))
            max = date;
        return max;
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .confirm-btn
    max-width 300px
    margin 6px

  .first-date-time
    margin-right 8px
  .second-date-time
    margin-left 8px
</style>
