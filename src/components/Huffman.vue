<template>
    <div id="page">
        <Nav />
        <div id="algo">
          <div id="main" ref="chartContainer" style="width: 1710px;height:550px;"></div>
          <input type="text" v-model="customData" placeholder="输入字符以及其对应权值，格式为字符:权值，每个之间以英文逗号分隔">
          <button @click="addNode">添加节点</button>
          <button @click="buildAndVisualizeHuffmanTree">开始构建哈夫曼树</button>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import Nav from './Nav.vue';
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { ElMessageBox } from 'element-plus';

const customData = ref('');
const isAddNode = ref(true);

const data = ref([
  { name: 'A', weight: 40},
  { name: 'B', weight: 20},
  { name: 'C', weight: 40},
  { name: 'D', weight: 10},
]);

let init = [
  {name: 'A',weight: 40},
  {name: 'B',weight: 20},
  { name: 'C', weight: 40 },
  { name: 'D', weight: 10 }
];



const links = ref([])
const huffmanData = ref([])


interface HuffmanNode {
  left?: HuffmanNode;
  right?: HuffmanNode;
  name?: string;
  weight: number;
}

const chartContainer = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

const initChart = () => {
  if (chartContainer.value && !myChart) {
        myChart = echarts.init(chartContainer.value);
  }
  // 以节点初始化数据，节点中的内容为value(weight),节点杂乱的分布在图中
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
                    fontSize: 14
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
                data: data.value.map((node) => {
                    return {
                        name: node.name + '(' + node.weight + ')',
                        x: Math.random() * 800,
                        y: Math.random() * 800,
                        draggable: true
                    };
                }),
            }
        ]
    };
  myChart?.setOption(option);

  // 删除节点
  myChart?.on('click', async function (params) {
    if (params.dataType === 'node') {
      const nodeName = params.data.name;
      ElMessageBox.confirm(`确定要删除节点 ${nodeName} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        data.value = data.value.filter((node) => node.name !== nodeName.split('(')[0]);
        initChart();
      }).catch(() => {
        // 取消删除
      });
    }
  });
}

// 添加节点
function addNode() {
  const pairs = customData.value.split(',');
  if(!customData.value) {
    ElMessage.error('请输入字符和权重');
    return;
  }
  pairs.forEach(pair => {
    const [value,weight] = pair.split(':');
    if (data.value.some(val => val.name === value.trim())) {
      isAddNode.value = false;
      ElMessage.error('字符已存在');
      return;
    }
  });
  if(data.value.length >= 8) {
    ElMessage.error('最多8个节点');
    return;
  }
  // 分割customData字符串，得到多个“字符:权重”对
  // 遍历每个对
  if(isAddNode.value) {
    pairs.forEach(pair => {
      const [value, weight] = pair.split(':');
      console.log(value, weight);
      if (value && weight) {
        // 将解析出的字符和权重添加到data数组中
        data.value.push({ name: value.trim(), weight: parseInt(weight, 10) });
        init.push({ name: value.trim(), weight: parseInt(weight, 10) });
      }
    });
    ElMessage.success('添加成功');
    customData.value = '';
    initChart();
  }
}
// 删除节点

function buildAndVisualizeHuffmanTree() {
  // 使节点排成一排
  data.value.sort((a, b) => a.weight - b.weight);
  myChart?.setOption({
    series: [
      {
        data: data.value.map((node, index) => {
          return {
            name: node.name + '(' + node.weight + ')',
            x: index * 50 + 50,
            y: 100,
            draggable: false
          };
        }),
      }
    ]
  });
  links.value = [];
  huffmanData.value = [];
  buildTreeStepByStep(data.value, links.value);
}

function layoutHuffmanTree(node, depth = 0, position = { currentX: 0 }, maxWidth = 1700) {
  if (!node) return;
  const space = maxWidth / Math.pow(2, depth + 1); // 每个深度的间隔
  layoutHuffmanTree(node.left, depth + 1, position, maxWidth);
  node.x = position.currentX * space + maxWidth / 4; // maxWidth / 4 确保哈夫曼树在data节点的右边
  node.y = depth * 100 + 50; // 每个深度的y坐标
  position.currentX += 1;
  layoutHuffmanTree(node.right, depth + 1, position, maxWidth);
}


function buildTreeStepByStep(nodes: any, links: any) {
  if(nodes.length > 1) {
    nodes.sort((a: any, b: any) => a.weight - b.weight);
    const left = nodes.shift();
    const right = nodes.shift();
    if (!huffmanData.value.some(node => node.name === left.name)) {
        huffmanData.value.push(left);
      }
    if (!huffmanData.value.some(node => node.name === right.name)) {
        huffmanData.value.push(right);
    }
    const newNode = {
      name: left.name + "+" + right.name,
      weight: left.weight + right.weight,
      left: left,
      right: right
    };
    links.push(
      {
        source: newNode.name + '(' + newNode.weight + ')',
        target: left.name + '(' + left.weight + ')',
        weight: 0
      },
      {
        source: newNode.name + '(' + newNode.weight + ')',
        target: right.name + '(' + right.weight + ')',
        weight: 0
      }
    );
    nodes.push(newNode);
    if (!huffmanData.value.some(node => node.name === newNode.name)) {
        huffmanData.value.push(newNode);
    }
     const rootNode = huffmanData.value[huffmanData.value.length - 1]; // 假设最后一个节点为根节点
    layoutHuffmanTree(rootNode);

    // 重新绘制图表
    myChart?.setOption({
      series: [
        {
          data: huffmanData.value.map((node,index) => {
            return {
              name: node.name + '(' + node.weight + ')',
              x: node.x,
              y: node.y,
              draggable: true
            };
          }),
          force: {
            repulsion: 1000,
            edgeLength: [300, 300]
          },
          edgeLabel: {
            show: false,
          },
          links: links
        },
        {
          type: 'graph',
          layout: 'none',
          symbolSize: 50,
          label: {
            show: true,
            fontSize: 14
          },
          data: data.value.map((node, index) => {
          return {
            name: node.name + '(' + node.weight + ')',
            x: index * 50 + 50,
            y: 0,
            draggable: true
          };
        }),
        }
      ]
    });
    // 递归调用,延迟2秒
    setTimeout(() => {
      buildTreeStepByStep(nodes, links);
    }, 2000);
  } else {
    ElMessage.success('构建成功');
    setTimeout(() => {
      data.value = [];
      huffmanData.value = [];
      links.value = [];
      data.value = init;
      initChart();
    }, 2000);
  }
}

onMounted(() => {
  initChart();
})

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
  width: 540px;
  height: 50px;
  color: #54b2bd;
  font-size: 16px;
  margin-top: 30px;
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