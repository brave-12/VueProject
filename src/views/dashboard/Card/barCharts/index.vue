<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入 echarts
import * as echarts from "echarts";

export default {
  name: "index",
  mounted() {
    // 初始化 echarts 实例
    let lineCharts = echarts.init(this.$refs.charts);
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏 X 轴
        show: false,
        // 呈现出折线的效果 均分
        type: "category",
      },
      yAxis: {
        // 隐藏 Y 轴
        show: false,
      },
      // 系列
      series: [
        {
            // 图表的形式
            type: "bar",
            data: [60, 30, 40, 70, 48, 50,20,44,33,22,42],
            //  设置柱状图颜色
            //  color:'pink',
        },
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      // 鼠标放在点上的时候有提示信息
      tooltip:{}
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
