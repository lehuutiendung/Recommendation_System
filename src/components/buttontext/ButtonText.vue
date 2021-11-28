<template>
    <div>
        <div class="wrap-button-text" :class="{ 'disable': disable }" :style="{'width': Width + 'px'}">{{ text }}</div>
    </div>
</template>
<script>
export default {
    name: 'ButtonText',
    props:{
        text:{
            type: String,
            default: ""
        },
        Width: {
            type: Number,
            default: 80
        },
        disable:{
            type: Boolean,
            default: false
        }
    }
}
</script>
<style>
.wrap-button-text{
    height: 35px;
    min-width: 80px;
    background-color: #1877F2;
    cursor: pointer;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    box-sizing: border-box;
    font-weight: 500;
}
.wrap-button-text:hover{
    background-color: #3c8bf3;
}
.disable{
    background-color: #E4E6EB;
}
.disable:hover{
    background-color: #E4E6EB;
    cursor: not-allowed;
}
</style>