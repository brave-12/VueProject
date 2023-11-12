<template>
   <div>
      <div class="card-header">
        <!-- title 根据父组件传过来的显示 -->
        <span>{{title}}</span>
        <svg t="1699408268889" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1450" width="16" height="16"><path d="M512 822c171.208 0 310-138.792 310-310s-138.792-310-310-310-310 138.792-310 310 138.792 310 310 310z m0 90c-220.914 0-400-179.086-400-400S291.086 112 512 112s400 179.086 400 400-179.086 400-400 400z" fill="#444444" p-id="1451"></path><path d="M468 505c0-24.852 20.148-45 45-45s45 20.148 45 45v150c0 24.852-20.148 45-45 45S468 679.852 468 655v-150zM468 373c0-24.852 20.148-45 45-45s45 20.148 45 45v1c0 24.852-20.148 45-45 45S468 398.852 468 374v-1z" fill="#444444" p-id="1452"></path></svg>
      </div>
      <div class="card-content">{{count}}</div>
      <div class="card-charts">
        <slot name="charts"></slot>
      </div>
      <div class="card-footer">
        <slot name="footer"></slot>
      </div>
   </div>
</template>

<script>
export default {
   name: 'index',
   // 接收父组件传过来的参数
   props:['title','count'],
   data() {
      return {

      };
   },
   methods: {

   },
};
</script>

<style scoped>
 .card-header{
    display: flex;
    justify-content: space-between;
    color:#d9d9d9;
 }
 .card-content{
    font-size: 30px;
    padding: 10px 0px;
 }
 .card-charts{
    height: 50px;
 }
 .card-footer{
    border-top: 1px solid #eee;
    padding-top: 10px;
 }
</style>
