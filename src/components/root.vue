<template>
    <div id="page">
        <Nav />
        <div id="algo">
            选择算法
            <div @click="router.push('/bubblesort')">Bubble Sort</div>
            <div @click="router.push('/mst')">Minimum Spanning Tree</div>
            <div @click="router.push('/huffman')">Huffman Tree</div>
            <div @click="router.push('/hanoi')">Hanoi Tower</div>
            <div @click="router.push('/checkerboardCover')">Cover</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Nav from './Nav.vue';
import { useRouter } from 'vue-router'
const router = useRouter()
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

#nav {
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    position: sticky;
    top: 0;
}

#title {
    cursor: pointer;
    color: #54b2bd;
    font-size: 22px;
    line-height: 50px;
    margin-left: 20px;
    font-family: fantasy;
}

a {
    all: initial;
    cursor: pointer;
    color: #54b2bd;
    font-size: 22px;
    line-height: 50px;
    margin-right: 20px;
    font-family: fantasy;
}

#algo {
    width: 400px;
    height: 400px;
    margin: 150px auto 0 auto;
    font-size: 30px;
    color: #54b2bd;
    text-align: center;
    font-family: fantasy;
    background-color: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

#algo div {
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 6px;
    padding: 10px;
}

#algo div:hover {
    border: 2px solid #54b2bd;
    background-color: #f4f7ed;
}
</style>