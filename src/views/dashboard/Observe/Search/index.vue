<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <div class="search-header">
          <span>线上热门搜索</span>
          <el-dropdown>
            <span>
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- 头部下面折线图 -->
      <div>
        <el-row :gutter="10">
          <!-- span一行是24  然后在这个基础上分 -->
          <el-col :span="12">
            <lineCharts></lineCharts>
          </el-col>
          <el-col :span="12">
            <lineCharts></lineCharts>
          </el-col>
        </el-row>
        <!-- table 表格 -->
        <el-table :data="tableData" style="width: 100%" border>
          <!-- sortable 属性可以出现一个用于排序的上下箭头 -->
          <el-table-column label="排名" sortable width="80" type="index">
          </el-table-column>
          <el-table-column label="搜索关键字" sortable width="180">
          </el-table-column>
          <el-table-column label="用户数" sortable>
          </el-table-column>
          <el-table-column label="周涨幅" sortable>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
         <el-pagination layout="prev, pager, next" :total="1000" class="pagination"></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入组件
import lineCharts from "./lineCharts";
export default {
  name: "index",
  data() {
    return {
      tableData:[{}]
    };
  },
  methods: {},
  components: {
    lineCharts,
  },
};
</script>

<style scoped>
/* 设置标题和小点外层 div 弹性布局  位置设置为左右布局 */
.search-header {
  display: flex;
  justify-content: space-between;
}
.header {
  border-bottom: 1px solid #eee;
  padding: 5px 0;
}
.pagination{
  float: right;
}
</style>
