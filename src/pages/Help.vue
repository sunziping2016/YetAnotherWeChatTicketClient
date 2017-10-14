<template>
  <v-container class="xs-pa-0">
    <v-layout row justify-space-around>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3>
        <v-card class="xs-fullscreen">
          <v-card-text>
            <h2>如何三步抢到票?</h2>
            <h3>1. 清华认证</h3>
            <p>菜单项“个人中心” → “注册”，以下认证方法二选一：</p>
            <ul>
              <li>使用“邮箱注册”：发送验证邮件，激活后填入初始密码完成注册；</li>
              <li>或，使用“学生清华注册”：填入清华账号的用户名密码登录成功后，填入初始密码完成注册。</li>
            </ul>
            <h3>2. 绑定微信</h3>
            <p>菜单项“个人中心” → “绑定微信”。</p>
            <h3>3. 开始抢票</h3>
            <p>抢票时间：点击“近期活动”告诉你</p>
            <p>抢票方式：</p>
            <ul>
              <li>点击“抢票”下子菜单项，一键抢票；</li>
              <li>或，回复文本信息“抢票 XX(活动代称)”；</li>
              <li>或，“活动详情”中直接点击“抢票”。</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'help'
  };
</script>

<style lang="stylus" scoped>
  h2
    font-size 28px
    text-align center
    margin 16px 0
  h3
    font-size 20px
    margin 8px 0
  p
    font-size 16px
    margin 4px 0
</style>
