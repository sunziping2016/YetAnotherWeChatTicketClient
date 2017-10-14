<template>
  <div>
    <canvas
      :style="{height: size + 'px', width: size + 'px'}"
      :height="size"
      :width="size"
      ref="qr"
    ></canvas>
  </div>
</template>


<script>
  import qr from 'qr.js'

  export default {
    props: {
      value: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        default: 100
      },
      // 'L', 'M', 'Q', 'H'
      level: String,
      bgColor: {
        type: String,
        default: '#ffffff'
      },
      fgColor: {
        type: String,
        default: '#000000'
      },
    },
    watch: {
      size: function(){
        this.update();
      },
      value: function(){
        this.update();
      },
      level: function(){
        this.update();
      },
      bgColor: function(){
        this.update();
      },
      fgColor: function(){
        this.update();
      }
    },
    mounted () {
      this.update();
    },
    methods:{
      update () {
        const size = this.size;
        const bgColor = this.bgColor;
        const fgColor = this.fgColor;
        const $qr = this.$refs.qr;

        const qrcode = qr(this.value);

        const ctx = $qr.getContext('2d');
        const cells = qrcode.modules;
        const tileW = size / cells.length;
        const tileH = size / cells.length;
        const scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);

        $qr.height = $qr.width = size * scale;
        ctx.scale(scale, scale);

        cells.forEach(function (row, rdx) {
          row.forEach(function (cell, cdx) {
            ctx.fillStyle = cell ? fgColor : bgColor;
            const w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW));
            const h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH));
            ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
          });
        });
      }
    }
  }

  function getBackingStorePixelRatio (ctx) {
    return (
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1
    );
  }

</script>

<style>


</style>
