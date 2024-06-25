<template>
    <div id="page">
        <Nav />
        <div id="algo">
            <div id="box">
                <div>
                    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
                        <div v-for="(cell, colIndex) in row" :key="colIndex"
                            :class="['cell', { special: cell === 1 }]"
                            v-bind:style="{
                        width: k > 4 ? '15px' : '28px', height: k > 4 ? '15px' : '28px',
                        backgroundColor: getCellColor(cell)
                            }">
                        </div>
                    </div>
                </div>
                <div class="shapes">
                    <!-- 四个填充L型方块 -->
                    <div v-for="(shape, index) in shapes" :key="index" class="shape">
                        <div v-for="(row, rowIndex) in shape" :key="rowIndex" class="row">
                            <div v-for="(cell, colIndex) in row" :key="colIndex"
                                :class="['shape-cell', { filled: cell === 1 }]">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button @click="coverBoard">覆盖棋盘</button>
            <input type="number" v-model.number="k" placeholder="输入棋盘大小的k值" />
            <input type="number" v-model.number="specialRow" placeholder="特殊点的行" />
            <input type="number" v-model.number="specialCol" placeholder="特殊点的列" />
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, watch, watchEffect } from 'vue';
import Nav from './Nav.vue'
import { ElMessage } from 'element-plus';

const k = ref(2);
const specialRow = ref(1);
const specialCol = ref(2);
const board = reactive([]);

// 特殊方格的位置，可以修改为其他位置
const tileNumber = ref(2)

const shapes = [
    [
        [1, 1],
        [1, 0]
    ],
    [
        [1, 1],
        [1, 0]
    ],
    [
        [0, 1],
        [1, 1]
    ],
    [
        [1, 1],
        [0, 1]
    ]
];


function getCellColor(cell) {
    if (cell === 1) return 'transparent'; // 特殊单元格不着色
    const baseHue = 240; // 可以选择一个基础色调
    return `hsl(${baseHue + cell * 137 % 360}, 50%, 60%)`; // 使用黄金角度来生成颜色
}

const initBoard = () => {
    if((specialRow.value > 2 ** k.value || specialCol.value > 2 ** k.value) && k.value !== '') {
        ElMessage.error('特殊点的位置不在棋盘范围内！');
        return;
    }
    if (k.value > 5) {
        ElMessage.error('k值不能大于6！');
        return;
    }
    if(specialRow.value !== '' && specialCol.value !== '' && k.value !== '') {
        board.splice(0); // 清空board数组
        const size = 2 ** k.value;
        for (let i = 0; i < size; i++) {
            board.push(Array(size).fill(0)); // 使用push添加新的行
        }
        board[specialRow.value - 1][specialCol.value - 1] = 1;
    }
};

const coverBoard = async () => {
    tileNumber.value = 2; // Reset tile number
    await cover(0, 0, Math.pow(2, k.value), specialRow.value -1 , specialCol.value-1);
    ElMessage.success('覆盖完成!');
};

const cover = async (r, c, size, sr, sc) => {
    if (size === 2) {
        // Smallest sub-board, place a single tromino
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                // Check if the current position is not the special tile
                if (!(r + i === sr  && c + j === sc )) {
                    board[r + i][c + j] = tileNumber.value;
                }
            }
        }
        tileNumber.value++;
        return;
    }

    const s = size / 2;
    const t = tileNumber.value++;

    // Determine which sub-board contains the special square
    if (sr < r + s && sc < c + s) {
        // 特殊方格在上左子棋盘
        await cover(r, c, s, sr, sc);
        await new Promise(resolve => setTimeout(resolve, 1500));
        board[r + s - 1][c + s] = t;
        board[r + s][c + s - 1] = t;
        board[r + s][c + s] = t;
        await cover(r, c + s, s, r + s - 1, c + s);
        await new Promise(resolve => setTimeout(resolve, 1500));
        await cover(r + s, c, s, r + s, c + s - 1);
        await new Promise(resolve => setTimeout(resolve, 1500));
        await cover(r + s, c + s, s, r + s, c + s);
        await new Promise(resolve => setTimeout(resolve, 1500));
    } else if (sr < r + s && sc >= c + s) {
        // 特殊方格在上右子棋盘
        await cover(r, c + s, s, sr, sc);
        await new Promise(resolve => setTimeout(resolve, 1500));
        board[r + s - 1][c + s - 1] = t;
        board[r + s][c + s - 1] = t;
        board[r + s][c + s] = t;
        await cover(r, c, s, r + s - 1, c + s - 1);
        await new Promise(resolve => setTimeout(resolve, 1500));
        await cover(r + s, c, s, r + s, c + s - 1);
        await new Promise(resolve => setTimeout(resolve, 1500));
        await cover(r + s, c + s, s, r + s, c + s);
        await new Promise(resolve => setTimeout(resolve, 1500));
    } else if (sr >= r + s && sc < c + s) {
        // 特殊方格在下左子棋盘
        await cover(r + s, c, s, sr, sc);
        await new Promise(resolve => setTimeout(resolve, 1500));
        board[r + s - 1][c + s - 1] = t;
        board[r + s - 1][c + s] = t;
        board[r + s][c + s] = t;
        await cover(r, c, s, r + s - 1, c + s - 1);
        await new Promise(resolve => setTimeout(resolve, 1500));
        await cover(r, c + s, s, r + s - 1, c + s);
        await new Promise(resolve => setTimeout(resolve, 1500));
        await cover(r + s, c + s, s, r + s, c + s);
        await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
        // 特殊方格在下右子棋盘
        await cover(r + s, c + s, s, sr, sc);
        await new Promise(resolve => setTimeout(resolve, 1500));
        board[r + s - 1][c + s - 1] = t;
        board[r + s - 1][c + s] = t;
        board[r + s][c + s - 1] = t;
        await cover(r, c, s, r + s - 1, c + s - 1);
        await new Promise(resolve => setTimeout(resolve, 1500));
        await cover(r, c + s, s, r + s - 1, c + s);
        await new Promise(resolve => setTimeout(resolve, 1500));
        await cover(r + s, c, s, r + s, c + s - 1);
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1200);
    });
};


// 使用watchEffect监听board的变化
watchEffect(() => {
    initBoard();
})

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

#box {
    width: 1200px;
    display: flex;
    justify-content: space-evenly;
}

input {
    all: initial;
    border: 2px solid #54b2bd;
    border-radius: 8px;
    padding-left: 35px;
    margin-top: 30px;
    width: 278px;
    height: 50px;
    color: #54b2bd;
    font-size: 22px;
}

.row {
    display: flex;
}

.cell {
    width: 28px;
    height: 28px;
    border: 1.3px solid #f4f7ed;
}

.special {
    background-color: gray;
}

.covered {
    background-color: yellow;
}

.shapes {
    width: 300px;
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.shape {
    display: flex;
    flex-direction: column;
}

.shape .row {
    display: flex;
}

.shape-cell {
    width: 30px;
    height: 30px;
    border: 1.3px solid #f4f7ed;
}

.filled {
    background-color: blue;
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
