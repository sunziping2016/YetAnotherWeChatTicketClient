<template>
  <div class="date-time-pickle">
    <v-text-field :label="label" :value="dateTime"
                  :required="required" @focus="onOpenDate"
                  :error-messages="errorMessages"
                  readonly inline
    ></v-text-field>
    <v-dialog persistent v-model="dateDialog"
              lazy full-width>
      <v-date-picker
        ref="datePickle"
        locale="zh-cn"
        :value="value"
        @input="updateDate(arguments[0])"
        :allowed-dates="allowedDates"
        scrollable actions>
        <template scope="{ save, cancel }">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="cancel">取消</v-btn>
            <v-btn flat primary @click.stop="save();onOpenTime()">确认</v-btn>
          </v-card-actions>
        </template>
      </v-date-picker>
    </v-dialog>
    <v-dialog persistent v-model="timeDialog"
              lazy full-width>
      <v-time-picker
        :value="timeInput"
        @input="updateTime(arguments[0])"
        format="24hr"
        :allowed-hours="allowedHours"
        :allowed-minutes="allowedMinutes"
        scrollable actions>
        <template scope="{ save, cancel }">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="cancel">取消</v-btn>
            <v-btn flat primary @click="save">确认</v-btn>
          </v-card-actions>
        </template>
      </v-time-picker>
    </v-dialog>
  </div>
</template>

<script>
  const oneDay = 86400 * 1000;

  export default {
    data() {
      return {
        dateDialog: false,
        timeDialog: false,
      };
    },
    computed: {
      dateTime() {
        if (this.format)
          return this.format(this.value);
        if (this.value instanceof Date)
          return this.value.toLocaleString('zh-CN', {hour12: false})
            .replace(/:\d+$/, '');
        return '';
      },
      timeInput() {
        if (this.value) {
          const minutes = this.value.getMinutes();
          if (minutes < 10)
            return this.value.getHours() + ':0' + minutes;
          else
            return this.value.getHours() + ':' + minutes;
        }
        return null;
      },
      minSameDate() {
        return this.min && this.value &&
          this.value.getFullYear() === this.min.getFullYear() &&
          this.value.getMonth() === this.min.getMonth() &&
          this.value.getDate() === this.min.getDate();
      },
      maxSameDate() {
        return this.max && this.value &&
          this.value.getFullYear() === this.max.getFullYear() &&
          this.value.getMonth() === this.max.getMonth() &&
          this.value.getDate() === this.max.getDate();
      },
      minSameHour() {
        return this.minSameDate && this.value.getHours() === this.min.getHours();
      },
      maxSameHour() {
        return this.maxSameDate && this.value.getHours() === this.max.getHours();
      },
      allowedDates() {
        //this.minUnixDate()
        const result = {
          min: -8640000000000000,
          max: 8640000000000000 - oneDay
        };
        if (this.min)
          result.min = this.min;
        if (this.max)
          result.max = this.max;
        return result;
      },
      allowedHours() {
        const result = {min: 0, max: 23};
        if (this.minSameDate)
          result.min = this.min.getHours();
        if (this.maxSameDate)
          result.max = this.max.getHours();
        return result;
      },
      allowedMinutes() {
        const result = {min: 0, max: 59};
        if (this.minSameHour)
          result.min = this.min.getMinutes();
        if (this.maxSameHour)
          result.max = this.max.getMinutes();
        return result;
      },
    },
    methods: {
      onOpenDate() {
        this.dateDialog = true;
      },
      onOpenTime() {
        if (this.value)
          this.timeDialog = true;
        else {
          this.$emit('input', this.$refs.datePickle.inputDate);
          this.$nextTick(() => this.timeDialog = true)
        }
      },
      updateDate(date) {
        if (typeof date === 'string') {
          date = date.split('-').map(x => parseInt(x));
          const value = this.value instanceof Date ?
            new Date(this.value.getTime()) : new Date(0);
          value.setFullYear(date[0]);
          value.setMonth(date[1] - 1);
          value.setDate(date[2]);
          this.$emit('input', value);
        }
      },
      updateTime(time) {
        if (typeof time === 'string') {
          time = time.split(':').map(x => parseInt(x));
          const value = this.value instanceof Date ?
            new Date(this.value.getTime()) : new Date(0);
          value.setHours(time[0]);
          value.setMinutes(time[1]);
          value.setSeconds(0);
          value.setMilliseconds(0);
          this.$emit('input', value);
        }
      }
    },
    props: [
      'label',
      'value',
      'format',
      'error-messages',
      'required',
      'min',
      'max'
    ],

  };
</script>

<style lang="stylus" scoped>
  .date-time-pickle
    display inline-block
    flex 1
    min-width 0
</style>
