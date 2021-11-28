<template>
    <div class="gender-radio-wrap">
        <input class="radio-input" type="radio" >
        <span class="radio-wrap" 
        @focus="handleFocusRadio()" 
        @blur="handleBlurRadio()" 
        @keyup.enter="handleEnterRadio()" 
        @click="handleClickRadio()">
            <span class="radio-border"></span>
            <span class="radio-border-big" :class="{'active-border-radio' : index == indexRadio ? true : false }"></span>
            <span class="radio-circle" :class="{'active-circle-radio' : chooseItem }"></span>
        </span>
        <div class="name-radio">{{ nameRadio }}</div>
    </div>
</template>
<script>
export default {
    name: "Radio",
    props:{
        // Nhãn radio
        nameRadio: {
            type: String,
            default: "",
        },
        //Index của từng radio
        index: {
            type: Number,
            default(){
                return 0;
            }
        },
        //Index của Radio được chọn
        indexRadio: {
            type: Number,
            default(){
                return 0;
            }
        },
    },
    data() {
        return {
            activeBorder: false, //Mặc định chưa hiện border focus
            activeCircle: true, //Mặc định chọn item đầu tiên
        }
    },
    computed: {
        chooseItem: function(){
            if(this.activeCircle && this.index == this.indexRadio){
                return true;
            }else{
                return false;
            }
        }
    },
    methods: {
        //Focus vào radio, hiển thị border
        handleFocusRadio(){
            this.activeBorder = true;
        },
        //Blur ra ngoài radio, ẩn border
        handleBlurRadio(){
            this.activeBorder = false;
        },
        //Bắt sự kiện phím enter chọn radio
        handleEnterRadio(){
            this.activeCircle = true;
            this.$emit('radio', this.index);
        },
        //Bắt sự kiện click radio
        handleClickRadio(){
            this.activeCircle = true;
            this.$emit('radio', this.index);
        }
    },
}
</script>
<style scoped>
.gender-radio-wrap{
    position: relative;
    display: flex;
    height: 32px;
    align-items: center;
    margin-right: 20px;
    cursor: pointer;
}

.radio-input{
    position: absolute;
    left: 0;
    opacity: 0;
    width: 20px;
}

.radio-wrap{
    display: block;
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    cursor: pointer;
}

.radio-border{
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1px solid #afafaf;
    background: #fff;
    z-index: 1;
    justify-content: center;
    display: block;
}

.radio-border-big{
    display: none;
    position: absolute;
    width: 24px;
    height: 24px;
    top: -3px;
    left: -3px;
    border-radius: 50%;
    border: 1px solid #adddf3;
}

.radio-circle{
    display: none;
    position: absolute;
    width: 10px;
    height: 10px;
    top: 4px;
    left: 4px;
    border-radius: 50%;
    background: #297deb;

}

.name-radio{
    margin-left: 28px;
}

.active-border-radio{
    display: block;
}

.active-circle-radio{
    display: block;
}
</style>