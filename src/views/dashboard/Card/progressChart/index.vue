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
        // 最小值与最大值的设置
        min:0,
        max:100,
      },
      yAxis: {
        // 隐藏 Y 轴
        show: false,
        // 呈现出折线的效果 均分  y轴均分整个柱状图就会横过来
        type: "category",
      },
      // 系列
      series: [
        {
            // 图表的形式
            type: "bar",
            data: [78],
            //  设置柱状图颜色
            color:'pink',
            // 柱状图的宽度
            barWidth:10,
            // 背景颜色的设置(需要先设置 showBackground 为 true  背景颜色才会显示)
            showBackground:true,
            backgroundStyle:{
                color:'#eee',
            },
            // 文本标签(通过 | 可以变成一个类似目标的符号)
            label:{
                show:true,
                // 将文本替换为一个竖杆
                formatter:'|',
                position:'right',
            }

        },
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      // 鼠标放上去之后又提示信息
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
