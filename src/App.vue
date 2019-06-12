<template>
    <div id="app">
        <h1>{{ msg }}</h1>
        <img src="./img/logo.png" alt="" />
        <input type="text" v-model="msg" />
    </div>
</template>

<script>

import getData from './utils';
export default {
    name: 'app',
    data(){
        return {
            msg: 'Welcome to Your Vue.js!'
        }
    },
    created(){
        this.fetchData();
        console.log('33333');
    },
    methods: {
        async fetchData(){
            const data = await getData();
            this.msg = data;
        }
    }
}
</script>

<style lang="scss">
#app{
    font-family: Arial, Helvetica, sans-serif;
    h1{
        color:#cc3333;
    }
}
</style>



