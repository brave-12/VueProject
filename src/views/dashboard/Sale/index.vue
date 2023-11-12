<template>
  <el-card class="box-card" style="margin: 10px 0">
    <!-- 头部区域 -->
    <div slot="header" class="clearfix">
      <!--   @tab-click="handleClick" -->
      <!-- 头部左侧内容   v-model 绑定是为了确定默认访问的是谁 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale" ></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- 日期选择器 -->
        <!-- v-model="value1" -->
        <el-date-picker
          v-model="date"
          class="data"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"

        >
        </el-date-picker>
      </div>
    </div>
    <!-- 内容区域 -->
    <div>
      <!-- 套一个 el-row  为了划分两边的占比大小 -->
      <el-row :gutter="10">
        <!-- 左侧  容器 -->
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <!-- 右侧  门店销售额排名 -->
        <el-col :span="6">
            <div>
                <h3>门店{{title}}排名</h3>
                <ul>
                    <li>
                        <span class="rindex">1</span>
                        <span>肯德基</span>
                        <span class="rvalue">323,234</span>
                    </li>
                    <li>
                        <span class="rindex">2</span>
                        <span>麦当劳</span>
                        <span class="rvalue">299,122</span>
                    </li>
                    <li>
                        <span class="rindex">3</span>
                        <span>蜜雪冰城</span>
                        <span class="rvalue">283,998</span>
                    </li>
                    <li>
                        <span>4</span>
                        <span>汉堡王</span>
                        <span class="rvalue">266,213</span>
                    </li>
                    <li>
                        <span>5</span>
                        <span>塔斯汀</span>
                        <span class="rvalue">223,563</span>
                    </li>
                    <li>
                        <span>6</span>
                        <span>华莱士</span>
                        <span class="rvalue">219,425</span>
                    </li>
                    <li>
                        <span>7</span>
                        <span>星巴克</span>
                        <span class="rvalue">200,426</span>
                    </li>
                </ul>

            </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
// 引入 echarts
import * as echarts from "echarts";
import dayjs from "dayjs";
// import { mapState } from "vuex";

// 直接导入原本要 mock 的数据  下面渲染数据直接使用即可
import mock from "./data.json";
// console.log(mock.orderFullYearAxis);

export default {
  name: "Sale",
  data() {
    return {
      // 设置默认显示销售额
      activeName: "sale",
      // mycharts 在下面的局部变量  需要挂载到组件实例身上
      mycharts:null,
      // 收集日历的数据
      date:[]
    };
  },
  mounted() {
    // 初始化 echarts 实例
    // 原先的 let mychars 改成 this.mycharts   下面的 mycharts.setOption 改成 this.mycharts.setOption
    this.mycharts = echarts.init(this.$refs.charts);
    // 配置数据
    this.mycharts.setOption({
        title:{
            text:this.title + "趋势",
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
            type: "shadow",
            },
        },
        grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
        },
        xAxis: [
            {
            type: "category",
            // "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
            data: mock.orderFullYearAxis,
            axisTick: {
                alignWithLabel: true,
            },
            },
        ],
        yAxis: [
            {
            type: "value",
            },
        ],
        series: [
            {
            name: "访问量",
            type: "bar",
            barWidth: "60%",
            // 10, 52, 200, 334, 390, 330, 220,110,98,167,123,55
            data: mock.orderFullYear,
            // 设置颜色
            // color:'yellow',
            },
        ],
    });
    // 因为顶部是 mounted 只执行一次  并且初始值为空  所以没有数据
    // 如果是通过 mapState 的话可以通过监听 mapState 判断有数据进入之后再执行  先直接放进去
  },
  computed:{
    // 计算属性-标题
    title(){
        return this.activeName=='sale'?'销售额':'访问量'
    },
  },
  // 监听属性
  watch:{
    title(){
      console.log('修改配置数据');
      // 重新修改图片配置数据 setOption
      // 图表配置数据可以再次修改  如果有新的数值才修改成新的数值  
      this.mycharts.setOption({
          title:{
              text:this.title+'趋势'
          },
          xAxis:{
            // 判断如果是销售额就使用销售额的数据  如果不是就使用访问量的数据
            data:this.title=='销售额'?mock.orderFullYearAxis:mock.userFullYearAxis
          },
          series:{
            name: "访问量",
            type: "bar",
            barWidth: "60%",
            data:this.title=='销售额'?mock.orderFullYear:mock.userFullYear,
          }
      })
    },
  },
  methods: {
    // 点击本天的回调函数
    setDay(){
        const day = dayjs().format('YYYY-MM-DD')
        this.date = [day,day]
    },
    // 点击本周的回调函数本周
    setWeek(){
        // day(1) 代表的是获取星期一
        const start = dayjs().day(1).format('YYYY-MM-DD')
        const end = dayjs().day(7).format('YYYY-MM-DD')
        this.date = [start,end]
    },
    setMonth(){
        // day(1) 代表的是获取星期一
        const start = dayjs().startOf('month').format('YYYY-MM-DD')
        const end = dayjs().endOf('month').format('YYYY-MM-DD')
        this.date = [start,end]
    },
    setYear(){
        // day(1) 代表的是获取星期一
        const start = dayjs().startOf('year').format('YYYY-MM-DD')
        const end = dayjs().endOf('year').format('YYYY-MM-DD')
        this.date = [start,end]
    },
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  /* 设置弹性布局和居于两端 */
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.data {
  width: 230px;
  margin: 0px 20px;
}
.right span {
  margin: 0px 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul{
    list-style: none;
    width: 100%;
    height: 300px;
    padding: 0px;
}
ul li{
    height: 8%;
    margin: 10px 0;
}
ul li span{
    margin: 0 10px;
}
.rindex{
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: black;
    color: white;
    text-align: center;
}
.rvalue{
    float: right;
}
.right span{
    cursor:pointer;
}
</style>
