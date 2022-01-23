<template>
    <div class="body-about-personal">
        <!-- Center -->
        <div class="center">
            <div class="visonet center-about">
                <!-- Thông tin chung -->
                <div class="wrap-flex">
                    <div class="title">{{ $t('i18nPersonal.TabAbout.GeneralInformation' )}}</div>
                    <ButtonIcon :text="$t('i18nPersonal.TabAbout.UpdateInformation')" width="auto" color="white" icon="fb-icon-pencil" @click.native="clickUpdate" v-if="stateView"/>
                    <div class="flex" v-else>
                        <ButtonIcon :text="$t('i18nCommon.Cancel')" width="auto" color="white" @click.native="clickCancel"/>
                        <ButtonIcon :text="$t('i18nCommon.Save')" width="auto" color="blue" @click.native="clickSave"/>
                    </div>
                </div>
                <div class="grid-2-col">
                    <div class="item">  
                        <div class="label-item">Họ và tên</div>
                        <Input :stateView="stateView" v-model="userData.userName" :valueInput="userData.userName"/>
                    </div>
                    <div class="item">  
                        <div class="label-item">Dân tộc</div>
                        <Input :stateView="stateView" v-model="userData.ethnic"/>
                    </div>
                    <div class="item">  
                        <div class="label-item">Giới tính</div>
                        <Input :stateView="stateView" v-model="userData.genderName"/>
                    </div>
                    <div class="item">  
                        <div class="label-item">Tôn Giáo</div>
                        <Input :stateView="stateView" v-model="userData.religion"/>
                    </div>
                    <div class="item">  
                        <div class="label-item">Ngày sinh</div>
                        <Input :isInputDate="true" :stateView="stateView" v-model="userData.dateOfBirthConverted" :ISODate="userData.dateOfBirth" @datepicker="getValueDatePicker"/>
                    </div>
                    <div class="item">  
                        <div class="label-item">Quốc tịch</div>
                        <Input :stateView="stateView" v-model="userData.nationality"/>
                    </div>
                    <div class="item">  
                        <div class="label-item">Đến từ</div>
                        <Input :stateView="stateView" v-model="userData.hometown"/>
                    </div>
                </div>
                <!-- Thông tin liên hệ -->
                <div class="title">{{ $t('i18nPersonal.TabAbout.ContactInformation') }}</div>
                <div class="w-50-per">
                    <div class="item">  
                        <div class="label-item">Email</div>
                        <Input :stateView="stateView" v-model="userData.email"/>
                    </div>
                    <div class="item">  
                        <div class="label-item">Di động</div>
                        <Input :stateView="stateView" v-model="userData.phoneNumber"/>
                    </div>
                </div>
                <!-- Công việc và học vấn
                <div class="title">{{ $t('i18nPersonal.TabAbout.WorkInformation') }}</div>
                <div class="w-50-per">
                    <div class="item">  
                        <div class="label-item">Công việc</div>
                        <Input :stateView="stateView"/>
                    </div>
                    <div></div>
                    <div class="item">  
                        <div class="label-item">Đại học/Cao đẳng</div>
                        <Input :stateView="stateView"/>
                    </div>
                    <div></div>
                    <div class="item">  
                        <div class="label-item">Trường trung học</div>
                        <Input :stateView="stateView"/>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script>
import Input from "@/components/input/BaseInput.vue";
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue"
import UserAPI from "@/api/UserAPI.js"
import moment from "moment"

export default {
    name: 'TabAboutPersonal',
    components:{
        Input,
        ButtonIcon
    },
    data() {
        return {
            stateView: true,
            userData: {},
        }
    },
    created() {
        this.getUserData();
    },
    methods: {
        //Call API lấy thông tin của người dùng
        getUserData(){
            UserAPI.getByID(this.$route.params.id).then( (res) => {
                this.userData = res.data.doc;
                // Chuyển đổi enum => loại giới tính
                if(this.userData.gender == 0){
                    this.userData.genderName = "Nam";
                }else if(this.userData.gender == 1){
                    this.userData.genderName = "Nữ";
                }else{
                    this.userData.genderName = "Khác";
                }
                // Chuyển đổi ngày tháng DD/MM/YYYY
                this.userData.dateOfBirthConverted = this.convertDateVN(this.userData.dateOfBirth);
            })
        },
        //Click button cập nhật thông tin
        clickUpdate(){
            this.stateView = false;
        },
        //Click button Hủy
        clickCancel(){
            this.stateView = true;
        },
        //Click button Lưu -> Lưu thông tin
        clickSave(){
            let newDataUser = {
                // Không cho cập nhật trường email
                // email: this.userData.email,
                userName: this.userData.userName,
                phoneNumber: this.userData.phoneNumber,
                gender: this.userData.gender,
                dateOfBirth: this.userData.dateOfBirth,
                hometown: this.userData.hometown,
                ethnic: this.userData.ethnic,
                religion: this.userData.religion,
                nationality: this.userData.nationality
            }
            UserAPI.update(this.$route.params.id, newDataUser).then( () => {
                this.stateView = true;
                this.getUserData();
            })
        },
        /**
         * Convert định dạng ngày tháng Việt Nam
         */
        convertDateVN(date){
            return moment(date).format('DD-MM-YYYY');
        },
        /**
         * Nhận giá trị của date-picker
         */
        getValueDatePicker(e){
            this.$set(this.userData, "dateOfBirth", moment(e).format());
        },
    },
}
</script>
<style lang="scss" scoped>
@import "../../../css/views/NewsFeed/newsfeed.css";
.body-about-personal{
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    min-height: 400px;
    height: 100%;
    .center{
        width: 70vw;
        background-color: #ffffff;
        border-radius: 0.5rem;
        box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%);
        -webkit-transition: all 0.3s ease-in-out;
        margin-top: 10px;
        margin-bottom: 20px;
        padding: 24px;
        .center-about{
            width: 100%;
            .wrap-flex{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-right: 30px;
            }
            .title{
                font-size: 18px;
                font-weight: 500;
            }
            .grid-2-col{
                display: grid;
                grid-column-gap: 10%;
                grid-template-columns: 45% 45%;
                padding: 10px 30px;
                
            }
            .w-50-per{
                display: grid;
                grid-column-gap: 10%;
                grid-template-columns: 45% 45%;
                padding: 10px 30px;
            }
        }
    }
    .item{
        display: flex;
        align-items: center;
        .label-item{
            width: 6vw;
            margin-right: 8px;
        }
    }
}    
</style>