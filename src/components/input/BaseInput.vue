<template>
    <div class="wrap-input" :style="{width : width}">
        <!-- Label của input -->
        <div class="input-label">{{ label }}<span class="required" v-if="required">&nbsp;*</span></div>
        <div class="wrap-input-view" v-if="stateView">{{ value ? value : '-' }}</div>
        <div class="custome-input-date" v-if="isInputDate && !stateView">
            <date-picker v-model="date" :value="value" :lang="lang" format="DD-MM-YYYY" @change="handleChange"></date-picker>
        </div>
        <input type="text"
        class="input-text"
        :value="value"
        :class="{ 'required' : required , 'input-view' : stateView }"
        :maxlength="maxlength" 
        v-on="inputListeners" 
        v-if="!isInputDate && !isPassword && !stateView"
        >
        <input type="password"
        class="input-text" 
        :class="{ 'required' : required}"
        v-on="inputListeners" 
        v-if="isPassword && !stateView"
        >
    </div>
</template>
<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import moment from "moment"

export default {
    name: 'BaseInput',
    components: {
        DatePicker
    },
    props:{
        // value
        value:{
            type: [String, Date],
            default(){
                return "";
            }
        },
        // Nhãn input
        label:{
            type: String,
            default: "",
        },
        // Độ rộng input
        width:{
            type: String,
            default: "100%",
        },
        // Độ cao input
        height:{
            type: String,
            default: "40px"
        },
        // Trường ngày tháng
        isInputDate:{
            type: Boolean,
            default: false,
        },
        // Trường nhập mật khẩu
        isPassword:{
            type: Boolean,
            default: false,
        },
        // Trường bắt buộc
        required:{
            type: Boolean,
            default: false,
        },
        //Độ dài tối đa nhập input
        maxlength: {
            type: Number,
            default(){
                return 255;
            }
        },
        autoFocus: {
            type: Boolean,
            default: false
        },
        stateView: {
            type: Boolean,
            deafult: false
        },
        ISODate: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            date: '',
            lang: {
                days: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                months: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
                placeholder: {
                    date: 'Select Date',
                    dateRange: 'Select Date Range'
                }
            },
            //Max date là ngày hiện tại
            datePickerOptions: {
                  disabledDate (date) {
                        return date > new Date();
                 }
            },
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
         * Emit giá trị ngày tháng được chọn từ input date
        */ 
        handleChange(e){
            this.$emit('datepicker', e);
        },
        /**
         * Focus trường input đầu tiên
         */
        focusFirstField(){
            document.querySelectorAll('input')[0].focus();
        },
    },
    watch: {
        stateView: function(){
            if(!this.stateView){
                this.date = moment(this.ISODate).utc(this.ISODate).toDate();
            }
        }
    }
}
</script>
<style lang="scss">
.input-label{
    margin-bottom: 6px;
}
.input-text{
    width: -webkit-fill-available;
    padding: 8px 10px;
    border: 1px solid #cccccc;
    border-radius: 4px;
}
.input-text:focus{
    border: 1px solid rgb(50, 177, 236);
}
// Css input trong màn xem
.wrap-input-view{
    width: -webkit-fill-available;
    height: 36px;
    padding: 8px 10px;
    border-bottom: 1px solid #cccccc;
    font-weight: 500;
}
.input-label .required{
    color: red;
}
.datepicker{
    width: 200px;
    border: 1px solid #cccccc;
    height: 40px;
    display: flex;
    align-items: center;
}
.wrap-input{
    .mx-datepicker{
        width: 100% !important;
    }
}
.mx-input{
    color: #000000 !important;
    font-weight: 400;
    font-size: 15px;
}

</style>    