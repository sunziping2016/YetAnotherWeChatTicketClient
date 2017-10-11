<template>
  <v-container class="xs-pa-0">
    <v-layout>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <article class="ticket-info elevation-1">
          <section>
            <figure>
              <div class="mask" :style="{background: 'url(/static/imgs/mask.png) repeat'}"></div>
              <div class="m-cover" :style="{background: `url(${activity.titleImage}) repeat`}"></div>
            </figure>
            <figure>
              <img id="activity_main_image" :src="activity.mainImage">
              <figcaption id="title_area">
                <p class="time" id="small_title">Tsinghua University</p>
                <h1 id="activity_title">{{activity.name}}</h1>
                <div class="bars">
                  <img src="/static/imgs/clock.png" id="clock_image">
                  <span id="ticket_getting">抢票倒计时:<br>　　23小时44分53.3秒</span>
                </div>
              </figcaption>
            </figure>
            <div class="lead" id="activity_extra_info">
              <div>
                <span>活动时间:</span>
                <label>5月23日 20:05－20:05</label>
              </div>
              <div>
                <span>活动地点:</span>
                <label>新清华学堂</label>
              </div>
              <div>
                <span>活动票数:</span>
                <label>123621 张</label></div>
            </div>
            <div class="corner"></div>
            <div class="details">
              <div class="body">
                <h1 id="activity_detail_title"><b>活动介绍</b></h1>
                <div id="activity_content" v-text="activity.description"></div>
              </div>
              <div class="body" id="get_ticket_2">
                <h1 id="activity_detail_title_2"><b>抢票方式</b></h1>
                <div id="activity_content_2"><b>10月6日 01:42－04:29</b> 线上抢票，先到先得！<br><div style="height:1px"></div>· 在微信中直接回复<i style="color:#d0dd1e">"抢票　音乐会"</i><br>· 或者，点击"抢票"菜单下的<i style="color:#d0dd1e">"音乐会"</i>按钮<br>该活动分区域选座，抢到票后可进入查票界面进行选座。<br></div>
              </div>
            </div>
          </section>
        </article>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
  export default {
    name: 'activity',
    data() {
      return {
        activity: {
          name: '新年音乐会',
          beginTime: 12312312321,
          endTime: 12312412321,
          bookBeginTime: Date.now() + 86400000,
          bookEndTime: Date.now() + 96400000,
          description: "　　这是清华大学的新年音乐会。这是清华大学的新年音乐会。这是清   华大学的新年音乐会。这是清华大学的新年音乐会。这是清华大学的新年音乐会。这是清华大学 的新年音乐会。这是清华大学的新年音乐会。这是清华大学的新年音乐会。这是清华大学的新年   音乐会。这是清华大学的新年音乐会。这是清华大学的新年音乐会。这是清华大学的新年音乐会 。这是清华大学的新年音乐会。这是清华大学的新年音乐会。这是清华大学的新年音乐会。这是   清华大学的新年音乐会。这是清华大学的新年音乐会。这是清华大学的新年音乐会。这是清华大 学的新年音乐会。这是清华大学的  新年音乐会。这是清华大学的新年音乐会。这是清华大学的新年音乐会。",
          mainImage: 'http://c.hiphotos.baidu.com/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=1b08a857b13533fae1bb9b7cc9ba967a/8601a18b87d6277f9cff136128381f30e824fcfd.jpg',
          titleImage: 'http://ssast.org/static/images/slider1.jpg',
          totalTickets: 12362,
          soldTickets: 0,
          place: '新清华学堂'
        },
        deltaTime: 1000 // Server - client
      };
    }
  };
</script>

<style lang="stylus">
  @import '~vuetify/src/stylus/bootstrap'

  .ticket-info
    position relative
    z-index 0
    font-size 16px
    background-color rgb(30, 35, 41)
    height 100%

    figure
      display: -webkit-box;
      position relative
      background white
      width 100%

    figure:first-child
      height 100px
      z-index 1
      overflow hidden

    figure .mask
      position absolute
      width 100%
      height 100%
      z-index 100

    .m-cover
      height 100px
      position absolute
      width 100%
      z-index 90

    figure img
      box-flex: 2
      width: 6em
      margin: -2em .6em 0
      z-index: 2
      position: relative
      border: 2px solid #1E2329
      border-radius: 3px

    figure figcaption
      -webkit-box-flex: 1;

    figcaption .time
      font-size: .8em;
      color: #555;
      padding-top: 10px

    figcaption h1
      color: #DD001E;
      font-size: 24px;
      padding: 5px 0;
      font-weight 400

    h1, p
      margin-bottom 0

    .bars span
      font-size: .7em;
      display: inline;

    .lead
      background: #fff;
      line-height: 1.5em;
      padding: 10px 0;
      position: relative;

    .lead > div
      display: -webkit-box;
      margin: 0 28px;
      padding: 3px 0;

    .lead span
      font-size: 1em;
      color: #A2ABC3;

    .lead label
      font-size: .9em;
      margin: 0 .5em;
      display: block;
      width: 90%;
      font-weight: 800;

    .corner:before
      content: '';
      position: relative;
      top: -6px;
      left: 0;
      width: 100%;
      display: block;
      transform: translateZ(0);
      padding: 5px 0;
      background: radial-gradient(transparent 0,transparent 4px,#fff 4px,#fff);
      background-size: 9px 22px;
      background-position: 0 -17px;
      overflow: hidden;

    .corner:after
      content: '';
      position: relative;
      left: 5px;
      top: 5px;
      right: 5px;
      bottom: 5px;
      z-index: -1;

    .details
      color: #D4D4D4;
      line-height: 23px;
      font-size: .9em;
      position: relative;

    .body
      margin: 15px;
      overflow: hidden;

  #small_title
    line-height: 1.6em

  #activity_title
    line-height: 1.6em;

  .details h1
    color: #DD001E;
    font-size: 1.2em;
    margin: 0 0 10px;

  #clock_image
    width: 12px;
    margin: 0 0 0 6px;
    border: 0;

  #ticket_getting
    color: #dd001e;
</style>
