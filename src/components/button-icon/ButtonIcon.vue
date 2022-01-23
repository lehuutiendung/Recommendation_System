<template>
    <div class="button-icon" :class="{ 'disable': disable , 'btn-color-white': btnWhite }" :style="{'width': width + 'px' , 'height' : height + 'px' }">
        <div class="fb" :class="icon"></div>
        <div class="wrap-text">{{ text }}</div>
    </div>
</template>
<script>
export default {
    name: 'ButtonIcon',
    props: {
        text:{
            type: String,
            default: ""
        },
        width: {
            type: [Number, String],
            default: 80
        },
        height: {
            type: Number,
            default: 35
        },
        border_radius:{
            type: Number,
            default: 20,
        },
        disable:{
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ""
        },
        color:{
            type: String,
            default: ""
        }
    },
    computed:{
        btnWhite(){
            if(this.color === "white"){
                return true;
            }else{
                return false;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.button-icon{
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
    white-space: nowrap;
    padding: 0 10px;
}
.button-icon:hover{
    background-color: #3c8bf3;
}
.button-icon:active{
    background-color: #1877F2;
}
.disable{
    background-color: #E4E6EB;
}
.disable:hover{
    background-color: #E4E6EB;
    cursor: not-allowed;
}
.btn-color-white{
    background-color: #e3e5eb !important;
    color: #050505 !important;
}
.btn-color-white:hover{
    background-color: #D8DADF !important;
}
.btn-color-white:active{
    background-color: #e3e5eb !important;
}
</style>