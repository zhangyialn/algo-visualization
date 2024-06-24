<template>
    <div id="page">
        <Nav />
        <div id="algo">
            <div class="towers">
                <div v-for="(tower, index) in towers" :key="index" class="tower">
                    <div class="disk" v-for="disk in tower" :key="disk" :style="getDiskStyle(disk)"></div>
                </div>
            </div>
            <input type="number" v-model.number="diskCount" placeholder="输入圆盘数量" />
            <button @click="solveHanoi()">Solve</button>
        </div>
    </div>
</template>

<script setup>
import Nav from './Nav.vue'
import { ref, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'

const diskCount = ref(3)
const towers = ref([])

watchEffect(() => {
    towers.value = [Array.from({ length: diskCount.value }, (_, i) => diskCount.value - i),
        [],
        []
    ]
})

const resetTowers = () => {
    towers.value = [
        Array.from({ length: diskCount.value }, (_, i) => diskCount.value - i),
        [],
        []
    ]
}


const diskHeight = 20

const moveDisk = async (from, to) => {
    const disk = towers.value[from].pop()
    towers.value[to].push(disk)
    // 强制组件重新渲染
    towers.value = towers.value.slice()
    await new Promise(resolve => setTimeout(resolve, 1200))  // 等待两秒
}

const hanoi = async(n, from, to, aux) => {
    if (n > 0) {
        await hanoi(n - 1, from, aux, to)
        await moveDisk(from, to)
        await hanoi(n - 1, aux, to, from)
    } 
        
}

const solveHanoi = async () => {
    await hanoi(towers.value[0].length, 0, 2, 1)
    ElMessage.success('已完成')
    resetTowers()
}

const getDiskStyle = (disk) => {
    const hue = disk * 137.508
    return {
        height: diskHeight + 'px',
        width: disk * 40 + 'px',
        backgroundColor: `hsl(${hue}, 100%, 50%)`,
        color: '#fff',
    }
}

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
    margin-top: 40px;
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

.towers {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    width: 1400px;
    height: 300px;
}

.tower {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    width: 100px;
    position: relative;
    z-index: 1;
}

.disk {
    margin:  0;
    background-color: #ccc;
    text-align: center;
    border: 1px solid #000;
    z-index: 2;
}

.tower::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 10px;
    height: 300px;
    background-color: #964B00;
    left: 50%;
    transform: translateX(-50%);
}
</style>