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