<template>
    <div id="nav" @click="router.push('/')">
        <span id="title">algo-visualization | 一个简单的算法可视化应用</span>
        <a href="https://github.com/zhangyialn" target="_blank">Author: zhangyialn</a>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
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
    margin-left: 3cqw;
    font-family: fantasy;
}

a {
    all: initial;
    cursor: pointer;
    color: #54b2bd;
    font-size: 22px;
    line-height: 50px;
    margin-right: 30px;
    font-family: fantasy;
}
</style>