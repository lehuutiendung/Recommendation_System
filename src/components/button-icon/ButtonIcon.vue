<template>
    <div class="button-icon" :class="[disableClass, colorClass]" :style="{'width': width + 'px' , 'height' : height + 'px', 'border-radius' : border_radius + 'px'}">
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
    data() {
        return {
            disableClass: this.disable,
            colorClass: this.color
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

// Màu
.white{
    background-color: #e3e5eb !important;
    color: #050505 !important;
}
.white:hover{
    background-color: #D8DADF !important;
}
.white:active{
    background-color: #e3e5eb !important;
}
.light-blue{
    background-color: var(--light-blue) !important;
    color: #1877F2;
}
.light-blue:hover{
    background-color: #7abaff !important;
}
.light-blue:active{
    background-color: var(--light-blue) !important;
}

</style>