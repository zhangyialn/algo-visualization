<template>
    <div id="page">
        <Nav />
        <div id="algo">
            <div id="echart" ref="chartContainer"style="width: 600px; height: 600px;" ></div>
            <input v-model="customData" placeholder="输入数据，用逗号分隔,空则按默认数据" />
            <button @click="updateData">更新数据</button>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import Nav from './Nav.vue';
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';

const chartContainer = ref<HTMLElement | null>(null);
const customData = ref('');
const data = ref([820, 932, 901, 934, 1290, 1330, 1320]);
const isUpdating = ref(true);

let myChart: echarts.ECharts | null = null;


const initChart = () => {
    if (chartContainer.value && !myChart) {
    myChart = echarts.init(chartContainer.value);
    }
    const option = {
        xAxis: {
            type: 'category',
            // data为数组元素的值
            data: data.value.map((ele) => ele.toString()),
            axisLabel: {
                fontSize: 20,
            }
        },
    yAxis: {
        type: 'value',
        axisLabel: {
            show: false, // 不显示y轴标签
        }
    },
    series: [
        {
            data: data.value,
            type: 'bar',
            backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
            }
        }
    ]
    };
    myChart?.setOption(option);
};

const bubbleSortVisual = async () => {
    let len = data.value.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            // 每次比较前都更新图表，以可视化比较过程
            myChart?.setOption({
                xAxis: {
                    data: data.value.map((ele) => ele.toString()), // 更新x轴的data以反映当前数据的顺序
                },
                series: [{
                    data: data.value.map((value, index) => {
                        // 使用不同的颜色或标记来高亮正在比较的两个元素
                        if (index === j || index === j + 1) {
                            return { value, itemStyle: { color: '#ff4949' } }; // 正在比较的元素用红色高亮
                        } else {
                            return { value, itemStyle: { color: '#5470c6' } }; // 其他元素用默认颜色
                        }
                    }),
                    type: 'bar',
                }],
            });

            await new Promise((resolve) => setTimeout(resolve, 1000)); // 延时以可视化排序过程

            if (data.value[j] > data.value[j + 1]) {
                [data.value[j], data.value[j + 1]] = [data.value[j + 1], data.value[j]];
                // 交换后再次更新图表以反映位置的变化
                myChart?.setOption({
                    series: [{ data: data.value }],
                });
            }
        }
    }
    isUpdating.value = false;
    myChart?.setOption({
        series: [{
            data: data.value.map(value => ({
                value,
                itemStyle: {
                    color: '#5470c6' // 假设这是原来的颜色
                }
            })),
            type: 'bar',
        }],
    });
    ElMessage({
        message: '排序完成',
        type: 'success',
    });
}
const updateData = () => {
    if (isUpdating.value) return;
    console.log(customData.value);
    console.log(/^\d+([,，]\d+)*$/.test(customData.value));
    // 如果输入数组包含除数字以外的字符或者连续多个逗号则结束
    if (!/^\d+([,，]\d+)*$/.test(customData.value)) {
        ElMessage({
            message: '输入数据格式错误',
            type: 'error',
        });
        return;
        
    } else {
        isUpdating.value = true;
        if (customData.value.length != 0) {
            customData.value = customData.value.replace(/，/g, ',');
            data.value = customData.value.split(',').map(Number);
        }
        initChart();
        ElMessage({
            message: '更新成功',
            type: 'success',
        });
        bubbleSortVisual();
    }
    
};

onMounted(() => {
    initChart();
    bubbleSortVisual();
});


</script>

<style scoped>
#page {
    position: fixed;
    width: 100%;
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
    width: 415px;
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