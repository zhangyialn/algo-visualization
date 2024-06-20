<template>
    <div id="page">
        <Nav />
        <div id="algo">
            <div id="echart" ref="chartContainer" style="width: 1600px; height: 600px;"></div>
            <input  v-model="customData"type="text" placeholder="请输入你想要进行的片数">
            <button @click="">开始汉诺塔</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Nav from './Nav.vue';
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const customData = ref('');
const chartContainer = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

// 现有三根柱子 A、B 和 C，其中 A 柱上从下往上按照大小顺序摞着 片 圆盘，
// 现需按照以下规则把圆盘按大小顺序重新摆放在 C 柱上：
//  在三根柱子之间一次只能移动一个圆盘。
//  移动的时候始终只能小圆盘压着大圆盘。
//   盘子只能在三个柱子上存放 请给出一种可能的移动方案，并将移动过程进行可视化。
//（注意：不只 是结果可视化）

const disks = 3;
const towers = ref([[], [], []]);
const moves = ref([]);
const currentMoveIndex = ref(0);
const chart = ref(null);

const initTowers = () => {
  towers.value[0] = Array.from({ length: disks }, (_, i) => disks - i);
  towers.value[1] = [];
  towers.value[2] = [];
  generateMoves(disks, 0, 2, 1);
};

const initChart = () => {
  if (chartContainer.value && !chart.value) {
    myChart = echarts.init(chartContainer.value);
  }
  updateChart();
};

const updateChart = () => {
  const option = {
    xAxis: {
      type: 'category',
      data: ['A', 'B', 'C'],
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: disks,
      inverse: true,
    },
    series: towers.value.map((tower, index) => ({
      type: 'bar',
      name: `柱${index + 1}`,
      data: tower.map((disk, i) => ({
        value: disk,
        itemStyle: {
          color: `hsl(${(disk / disks) * 360}, 100%, 50%)`,
        },
      })),
      stack: 'stack',
      barWidth: '60%',
    })),
  };
  myChart?.setOption(option);
};

const generateMoves = (n, from, to, aux) => {
  if (n > 0) {
    generateMoves(n - 1, from, aux, to);
    moves.value.push([from, to]);
    generateMoves(n - 1, aux, to, from);
  }
};

const solveHanoi = () => {
  currentMoveIndex.value = 0;
  makeNextMove();
};

const makeNextMove = () => {
  if (currentMoveIndex.value < moves.value.length) {
    const [from, to] = moves.value[currentMoveIndex.value];
    const disk = towers.value[from].pop();
    towers.value[to].push(disk);
    updateChart();
    currentMoveIndex.value++;
    setTimeout(makeNextMove, 500);
  }
};

onMounted(() => {
  initTowers();
  initChart();
});


</script>

<style scoped>
#page {
    position: fixed; 
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    background-color: #f4f7ed;
}

#algo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: hidden;
}

input {
    all: initial;
    border: 2px solid #54b2bd;
    border-radius: 8px;
    padding-left: 35px;
    margin-top: 20px;
    width: 278px;
    height: 50px;
    color: #54b2bd;
    font-size: 22px;
}

button {
    all: initial;
    cursor: pointer;
    height: 30px;
    color: #54b2bd;
    font-size: 25px;
    margin-top: 20px;
}
</style>