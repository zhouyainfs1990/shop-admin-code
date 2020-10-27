<template>
  <div class="index-container">
    Index
    <el-row gutter="20">
      <el-col :span="12">
        <div class="row-item">
          <el-row>
            <el-col :span="24">商品总览</el-col>
          </el-row>
          <el-row  class="goods-item">
            <el-col  :md="6" :sm="12">
                <div>100</div>
                <p>已下架</p>
            </el-col>
            <el-col  :md="6" :sm="12"><div>400</div><p>已上架</p></el-col>
            <el-col  :md="6" :sm="12">50</el-col>
            <el-col  :md="6" :sm="12">100</el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="row-item">
          <el-row>
            <el-col :span="24">用户总览</el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import Highcharts from "highcharts";
export default {
  // 数据可视化操作在mounted中
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    //  设置容器
    /* var myChart = echarts.init(document.getElementById('main'));

        // 配置项
        let option = {
            toolbox:{
                feature:{
                    saveAsImage:{}
                }
            },
            // 标题
            tooltip: {},
            // 图例
            legend: {
                data:['销量',"进货量"]
            },
            // x 轴
            xAxis: {
                data: ["Mon","Tues","Wen","Thur","Fri","Sat","Sun"],
                 boundaryGap:false,
            },
            // y 轴
            yAxis: {},
            // 数据列表
            series: [{
                name: '销量',//数据名称
                type: 'line',//图表类型
                data: [5, 20, 36, 10, 10, 20]
            },{
                name: '进货量',//数据名称
                type: 'line',//图表类型
                data: [10, 20, 22, 40, 15, 8]
            }],
            color:["red","yellow"]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option); */

    var options = {
      chart: {
        type: "line" //指定图表的类型，默认是折线图（line）
      },
      title: {
        text: "我的第一个图表" // 标题
      },
      xAxis: {
        categories: ["苹果", "香蕉", "橙子"] // x 轴分类
      },
      yAxis: {
        title: {
          text: "吃水果个数" // y 轴标题
        }
      },
      series: [
        {
          // 数据列
          name: "小明", // 数据列名
          data: [1, 0, 4] // 数据
        },
        {
          name: "小红",
          data: [5, 7, 3]
        }
      ]
    };
    // 图表初始化函数
    var chart = Highcharts.chart("main", options);
  }
};
</script>
<style lang="less">
.index-container {
  width: 80%;
  margin: 0 auto;
  .row-item {
    border: 1px solid #000;
    text-align: center;
  }
}
</style>