<template>
    <div class="input-icon flex" :class="{'focus' : isFocus}" :style="{ 'height' : height + 'px', 'width' : width + 'px' }">
        <div class="icon-24 flex-justify-center">
            <div class="icon-16" :class="icon"></div>
        </div>
        <input class="input" type="text" :placeholder="placeholder" v-on="inputListeners" @focus="focusInput" @blur="undoFocusInput">
    </div>
</template>
<script>
export default {
    name: 'InputIcon',    
    props: {
        // value
        value:{
            type: String,
            default(){
                return "";
            }
        },
        //Class icon 
        icon:{
            type: String,
            default: ""
        },
        //Chiều cao
        height: {
            type: Number,
            default: 35
        },
        //Độ rộng
        width: {
            type: [Number,String],
            default: 250
        },
        //Placeholder
        placeholder:{
            type: String,
            default: ""
        },
        //Tự động focus ( trường đầu tiên)
        autoFocus:{
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isFocus: false,
        }
    },
    mounted() {
        if(this.autoFocus){
            this.focusFirstField();
        }
    },
    computed: {
        inputListeners: function () {
            var vm = this
            return Object.assign({},
                this.$listeners,
                {
                    input: function (event) {
                    vm.$emit('input', event.target.value)
                    }
                }
            )
        },
    },
    methods: {
        /**
         * Focus trường input đầu tiên
         */
        focusFirstField(){
            document.querySelectorAll('input')[0].focus();
        },
        /**
         * Focus thay đổi border input
         */
        focusInput(){
            this.isFocus = true;
        },
        /**
         * Blur thay đổi border input
         */
        undoFocusInput(){
            this.isFocus = false;
        }
    },
}
</script>
<style scoped>
.input-icon{
    border: 1px solid #cccccc;
    border-radius: 5px;
    padding: 4px;
}
.input-icon .input{
    width: 100%;
    border: none;
    padding: 0 4px;
    font-size: 15x;
}
.focus{
    border: 1px solid #3C8BF3!important;;
}
.icon-search{
    background: url(../../assets/icon/ICON.svg) -172px -76px no-repeat;
} 
</style>