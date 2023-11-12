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
        // 呈现出折线的效果
        type: "category",
      },
      yAxis: {
        // 隐藏 Y 轴
        show: false,
      },
      // 系列
      series: [
        {
          type: "line",
          data: [60, 30, 40, 70, 48, 50,20,44],
          // 设置拐点样式  取消拐点显示
          itemStyle: {
            opacity: 0,
          },
          // 设置线条样式
          lineStyle: {
            color: "purple",
          },
          
          // 填充颜色的设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
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
      tooltip:{},
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
