<template>
  <v-container class="xs-pa-0">
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
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
                v-model="totalTickets"
                :error-messages="totalTicketsError ? [totalTicketsError] : []"
                required
              ></v-text-field>
              <v-layout>
                <date-time-pickle
                  class="first-date-time"
                  label="活动开始时间"
                  v-model="beginTime"
                  :min="dateMax(new Date(), bookBeginTime)"
                  :max="dateMin(endTime)"
                  required
                ></date-time-pickle>
                <date-time-pickle
                  class="second-date-time"
                  label="活动结束时间"
                  v-model="endTime"
                  :min="dateMax(new Date(), beginTime, bookBeginTime, bookEndTime)"
                  required
                ></date-time-pickle>
              </v-layout>
              <v-layout>
                <date-time-pickle
                  class="first-date-time"
                  label="抢票开始时间"
                  v-model="bookBeginTime"
                  :min="dateMax(new Date())"
                  :max="dateMin(beginTime, endTime, bookEndTime)"
                  required
                ></date-time-pickle>
                <date-time-pickle
                  class="second-date-time"
                  label="抢票结束时间"
                  v-model="bookEndTime"
                  :min="dateMax(new Date(), bookBeginTime)"
                  :max="dateMin(endTime)"
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
                :rows="2"
                multi-line
              ></v-text-field>
              <file-field
                label="封面"
                accept="image/png,image/gif,image/jpeg"
                v-model="mainImage"
                :error-messages="mainImageError ? [mainImageError] : []"
                required
              >
              </file-field>
              <file-field
                label="题图"
                accept="image/png,image/gif,image/jpeg"
                v-model="titleImage"
                :error-messages="titleImageError ? [titleImageError] : []"
              >
              </file-field>
              <v-checkbox label="是否立即发布"
                          v-model="published"
              ></v-checkbox>
              <p>* 为必填项。封面建议是竖向的图片，而题图建议是横向的图片。</p>
              <v-layout justify-center>
                <v-btn
                  class="confirm-btn"
                  primary large block
                  :disabled="!valid"
                  :loading="verifying"
                  @click.native="onConfirm"
                >创建</v-btn>
              </v-layout>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'createActivity',
    data() {
      return {
        name: '',
        nameError: null,
        place: '',
        placeError: null,
        beginTime: null,
        endTime: null,
        bookBeginTime: null,
        bookEndTime: null,
        description: '',
        excerption: '',
        totalTickets: '',
        totalTicketsError: null,
        mainImage: null,
        mainImageError: null,
        titleImage: null,
        titleImageError: null,
        published: false,
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
      totalTickets() {
        if (this.totalTickets.length === 0)
          this.totalTicketsError = '活动票数不能为空';
        else if (!/^\d+$/.test(this.totalTickets))
          this.totalTicketsError = '活动票数格式不合法';
        else {
          const num = parseInt(this.totalTickets);
          if (num === 0)
            this.totalTicketsError = '所谓活动，应该要有人参与才对嘛';
          else if (num > 1e8)
            this.totalTicketsError = '你这是要开春晚么？';
          else
            this.totalTicketsError = null;
        }
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
      }
    },
    computed: {
      valid() {
        return !this.verifying && this.name && !this.nameError &&
          !this.placeError && this.totalTickets && !this.totalTicketsError &&
          this.beginTime && this.endTime && this.bookBeginTime && this.bookEndTime &&
          this.mainImage;
      }
    },
    methods: {
      onConfirm() {
        if (!this.valid)
          return;
        this.verifying = true;
        const data = {
          name: this.name,
          totalTickets: parseInt(this.totalTickets),
          beginTime: this.beginTime,
          endTime: this.endTime,
          bookBeginTime: this.bookBeginTime,
          bookEndTime: this.bookEndTime,
          mainImage: this.mainImage,
          published: this.published
        };
        if (this.place)
          data.place = this.place;
        if (this.description)
          data.description = this.description;
        if (this.excerption)
          data.excerption = this.excerption;
        if (this.titleImage)
          data.titleImage = this.titleImage;
        this.$store.dispatch('activities/create', data)
          .catch(err => {
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
