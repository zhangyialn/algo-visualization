<template>
    <div id="page">
        <Nav />
        <div id="algo">
            <div class="graph">
                <div id="echart" ref="chartContainer" style="width: 1200px; height: 600px;"></div>
                <!-- 用户输入顶点 -->
                <button @click="addNode">增加节点</button>
                <button @click="addEdge">增加边</button>
                <button @click="visualizePrim">开始MST算法</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Nav from './Nav.vue';
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { ElMessageBox } from 'element-plus';

const chartContainer = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

// 用数据表示无向联通图已经边的权重,因为是无向图所以边是双向的,例如links如果有
// 'A','B',10，就一定有'B','A',10
const data = ref({
    nodes: [
        { name: 'A', x: 100, y: 100 },
        { name: 'B', x: 400, y: 64 },
        { name: 'C', x: 300, y: 300 },
        { name: 'D', x: 381, y: 315 },
        { name: 'E', x: 500, y: 500 }
    ],
    links: [
        { source: 'A', target: 'B', weight: 10 },
        { source: 'A', target: 'C', weight: 15 },
        { source: 'A', target: 'D', weight: 20 },
        { source: 'B', target: 'C', weight: 25 },
        { source: 'B', target: 'D', weight: 30 },
        { source: 'C', target: 'D', weight: 35 },
        { source: 'C', target: 'E', weight: 40 },
        { source: 'D', target: 'E', weight: 45 }
    ],
    coordinate:[]
});





const initChart = () => {
    if (chartContainer.value && !myChart) {
        myChart = echarts.init(chartContainer.value);
    }
    const option = {
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'none',
                symbolSize: 50,
                roam: true,
                force: {
                    repulsion: 1000,
                    edgeLength: [400, 500]
                },
                label: {
                    show: true,
                    fontSize: 20
                },
                edgeSymbol: ['none', 'none'],
                edgeLabel: {
                    show: true,
                    formatter: function (params: any) {
                        // 使用 params.data.weight 来访问权重，并将其显示在边上
                        return params.data.weight;
                    },
                    fontSize: 20
                },
                data: data.value.nodes.map((node) => {
                    return {
                        name: node.name,
                        x: node.x,
                        y: node.y,
                        draggable: true
                    };
                }),
                links: data.value.links
            }
        ]
    };
    myChart?.setOption(option);

    myChart?.on('mouseup', function (params) {
        if(params.componentType === 'series' && params.dataType === 'node') {
            console.log(params.data);
            const draggedNode = data.value.nodes.find(node => node.name === params.data.name);
            if (draggedNode) {
                const pointInData = myChart?.convertFromPixel({ seriesIndex: 0 }, [params.event.offsetX, params.event.offsetY]);
                const index = data.value.nodes.findIndex(node => node.name === params.data.name);
                data.value.nodes[index] = { ...draggedNode, x: pointInData[0], y: pointInData[1] };
            }
        }
    })

    myChart?.on('click', async function (params) {
        // 判断点击的是图表背景还是具体的节点或边
        console.log(params.componentType);

        if (params.componentType === 'series') {
            if (params.dataType === 'edge') {
                // 点击的是边，可以弹出输入框让用户修改权值
                if (!params.data) {
                    return;
                }
                const { value: newWeight } = await ElMessageBox.prompt('请输入新的权值', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: parseInt(params.data.weight),
                    inputPattern: /^\d+$/,
                    inputErrorMessage: '权值必须是数字'
                });
                console.log(newWeight);

                if (newWeight) {
                    const link = data.value.links.find(link => link.source === params.data.source && link.target === params.data.target);
                    if (link) {
                        link.weight = parseInt(newWeight, 10);
                        myChart?.setOption({
                            series: [{
                                data: data.value.nodes.map((node) => {
                                    return {
                                        name: node.name,
                                        x: node.x,
                                        y: node.y,
                                        draggable: true
                                    };
                                }),
                                links: data.value.links
                            }]
                        });
                        ElMessage.success('修改成功');
                    }
                }
            } else if (params.dataType === 'node') {
                // 点击的是节点，可以实现删除节点的逻辑
                // 注意：删除节点时也需要处理与该节点相关的边
                const nodeName = params.data.name;
                ElMessageBox.confirm(`确定要删除节点 ${nodeName} 吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    data.value.nodes = data.value.nodes.filter(node => node.name !== nodeName);
                    data.value.links = data.value.links.filter(link => link.source !== nodeName && link.target !== nodeName);
                    myChart?.setOption({
                        series: [{
                            data: data.value.nodes.map((node) => {
                                return {
                                    name: node.name,
                                    x: node.x,
                                    y: node.y,
                                    draggable: true
                                };
                            }),
                            links: data.value.links
                        }]
                    });
                    ElMessage.success('删除成功');
                }).catch(() => {
                    // 取消删除
                });
            }
        }
    });
};

// 增加节点函数
const addNode = async () => {
    const { value: newNodeName } = await ElMessageBox.prompt('请输入新的节点名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\w+$/,
        inputErrorMessage: '节点名称必须是字母或数字'
    });
    console.log(newNodeName);
    if (newNodeName) {
        if (data.value.nodes.some(node => node.name === newNodeName)) {
            ElMessage({
                type: 'error',
                message: '节点名称已存在'
            });
            return;
        }
        data.value.nodes.push({
            name: newNodeName,
            x: Math.random() * 1000,
            y: Math.random() * 1000
        
        });
        console.log(data.value.nodes);
        
        myChart?.setOption({
            series: [{
                data: data.value.nodes.map((node) => {
                    return {
                        name: node.name,
                        x: node.x,
                        y: node.y,
                        draggable: true
                    };
                }),
                links: data.value.links
            }]
        });
        ElMessage.success('添加成功');
    }
};

// 增加边函数
const addEdge = async () => {
    let { value: newEdge } = await ElMessageBox.prompt('请输入新的边', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\w+,\w+,\d+$/,
        inputErrorMessage: '边的格式必须是"节点1,节点2,权值"，其中权值必须是数字'
    });
    console.log(newEdge);
    if (newEdge) {
        newEdge = newEdge.replace(/，/g, ',');
        const [source, target, weight] = newEdge.split(',');
        if (data.value.links.some(link => (link.source === source && link.target === target) || (link.source === target && link.target === source))) {
            ElMessage({
                type: 'error',
                message: '边已存在'
            });
            return;
        } else if (!data.value.nodes.some(node => node.name === source) || !data.value.nodes.some(node => node.name === target)) {
            ElMessage({
                type: 'error',
                message: '节点不存在'
            });
            return;
        }
        data.value.links.push({ source, target, weight: parseInt(weight, 10) });
        myChart?.setOption({
            series: [{
                data: data.value.nodes.map((node) => {
                    return {
                        name: node.name,
                        x: node.x,
                        y: node.y,
                        draggable: true
                    };
                }),
                links: data.value.links
            }]
        });
        ElMessage.success('添加成功');
    }
};

// 最小生成树算法，可视化算法每一步
const visualizePrim = () => {
    // 假设 data.value.nodes 和 data.value.links 已经定义
    let mstNodes = [data.value.nodes[0].name]; // 从第一个节点开始
    let mstLinks = []; // MST 的边
    let nonMstNodes = data.value.nodes.slice(1).map(node => node.name); // 除了第一个节点外的所有节点

    const findMinEdge = () => {
        let minEdge = null;
        let minWeight = Number.MAX_SAFE_INTEGER;
        for (let edge of data.value.links) {
            if (mstNodes.includes(edge.source) && nonMstNodes.includes(edge.target) && edge.weight < minWeight) {
                minEdge = edge;
                minWeight = edge.weight;
            } else if (mstNodes.includes(edge.target) && nonMstNodes.includes(edge.source) && edge.weight < minWeight) {
                minEdge = edge;
                minWeight = edge.weight;
            }
        }
        return minEdge;
    };
    
    const updateVisualization = () => {
        if (nonMstNodes.length === 0) {
            clearInterval(visualizationInterval);
            ElMessage.success('MST 完成');
            return;
        }

        const minEdge = findMinEdge();
        if (minEdge) {
            mstLinks.push(minEdge);
            const newNode = nonMstNodes.includes(minEdge.source) ? minEdge.source : minEdge.target;
            mstNodes.push(newNode);
            nonMstNodes = nonMstNodes.filter(node => node !== newNode);

            myChart?.setOption({
                series: [{
                    data: data.value.nodes.map(node => ({
                        ...node,
                        x: node.x,
                        y: node.y,
                        itemStyle: {
                            color: mstNodes.includes(node.name) ? 'red' : '#5470c6'
                        },
                        draggable: true
                    })),
                    links: data.value.links.map(link => ({
                        ...link,
                        lineStyle: {
                            color: mstLinks.includes(link) ? 'red' : '#5470c6',
                            width: mstLinks.includes(link) ? 5 : 2
                        }
                    }))
                }]
            });
        }
    };

    const visualizationInterval = setInterval(updateVisualization, 1700);
};


onMounted(() => {
    initChart();
});



</script>

<style scoped>
    #page {
    width: 100%;
    min-height: 100vh;
    height: auto;
    margin: 0;
    padding: 0;
    background-color: #f4f7ed;
}

#algo {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: 100%;
}

.graph {
    height: 770px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
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