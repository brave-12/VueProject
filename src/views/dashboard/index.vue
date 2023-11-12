<template>
  <div>
    <Card />
    <Sale />
    <Observe />
  </div>
</template>

<script>
// 引入组件
import Card from "./Card";
import Sale from "./Sale";
import Observe from "./Observe";

export default {
  name: "Dashboard",
  components: {
    Card,
    Sale,
    Observe
  },
  // MOCK 数据请求报错   [vuex] unknown action type: getData  先隐藏了直接导入文件
  // mounted(){
  //   this.$store.dispatch('getData');
  // }
};
</script>

<style scoped>
</style>
