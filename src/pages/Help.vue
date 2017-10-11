<template>
  <v-container>
    <v-layout row justify-space-around>
      <article>
        <h2>如何三步抢到票?</h2>
        <h3>1. 绑定</h3>
        <p>参与抢票需要实名认证。</p>
        <p>菜单按钮 "个人中心" → "绑定"</p>
        <h3>2. 抢票</h3>
        <p>抢票时间：点击"近期活动"告诉你</p>
        <p>抢票方式：</p>
        <ul>
          <li>点击"抢票"下子菜单项，一键抢票</li>
          <li>或，回复文本信息"抢票 XX(活动代称)"</li>
        </ul>
        <h3>3. 选区/选座</h3>
        <p>想和小伙伴坐在一起？选区帮助你！</p>
        <p>选区/座方式：在"我的票夹"中完成选区/座</p>
        <p>说明：未选区将于结束时接受随机分配</p>
      </article>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'help'
  };
</script>
