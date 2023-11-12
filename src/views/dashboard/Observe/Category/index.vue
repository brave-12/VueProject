<template>
  <el-card>
    <div slot="header" class="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
// 引入 echarts
import * as echarts from "echarts";

export default {
  name: "Category",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    // 饼图
    let mycharts = echarts.init(this.$refs.charts);
    mycharts.setOption({
      title:{
         text:'视频',
         subtext:1048,
         // 让文字在排版内  左右居中  上下居中
         left:'center',
         top:'center',
      },
      tooltip: {
        trigger: "item",
      },
      // 上面的一排小标题
      // legend: {
      //   top: "5%",
      //   left: "center",
      // },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            // 让文字居于外面    center 的话会在中心
            // echarts 4 版本的 outsize  就能显示
            position: "outside",
          },
         //  鼠标移上去文字放大的效果
         //  emphasis: {
         //    label: {
         //      show: true,
         //      fontSize: 40,
         //      fontWeight: "bold",
         //    },
         //  },

         //  显示从区域到文字的线
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "搜索引擎" },
            { value: 735, name: "直接访问" },
            { value: 580, name: "邮件营销" },
            { value: 484, name: "联盟广告" },
            { value: 300, name: "视频广告" },
          ],
        },
      ],
    });
   //  给图表绑定鼠标经过事件
   // 可能有上下文问题所以改成用箭头函数
   mycharts.on('mouseover',(params)=>{
      // 获取鼠标移上去的那条数据
      const {name,value} = params.data
      // 重新设置标题
      mycharts.setOption({
         title:{
            text:name,
            subtext:value,
         }
      })
   });
   },
};
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  /* align-items用于设置侧轴上的子元素排列方式（单行） 该属性用于控制子元素在侧轴（默认为y轴）上的排列方式 */
  align-items: center;
}
.header {
  border-bottom: 1px solid #eee;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>
