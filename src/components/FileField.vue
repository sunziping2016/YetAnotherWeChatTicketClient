<template>
  <div>
    <v-text-field :value="filename" :label="label" :required="required"
                  @focus="onOpen"
                  :disabled="disabled" :error-messages="errorMessages"
                  readonly ref="text"
    ></v-text-field>
    <input type="file"
           :accept="accept"
           :disabled="disabled"
           ref="input"
           @change="onInput">
  </div>
</template>

<script>
  export default{
    props: [
      'value',
      'accept',
      'label',
      'required',
      'disabled',
      'error-messages'
    ],
    computed: {
      filename() {
        if (this.value)
          return this.value.name;
        return '';
      }
    },
    methods: {
      onOpen(){
        if (!this.disabled)
          this.$refs.input.click();
      },
      onInput(){
        const file = this.$refs.input.files[0] || null;
        this.$refs.text.blur();
        this.$nextTick(() => this.$emit('input', file));
      }
    }
  };
</script>

<style lang="stylus" scoped>
  input[type=file]
    display none
</style>
