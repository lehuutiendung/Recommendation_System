<template>
    <div class="body-friend-personal">
        <!-- Center -->
        <div class="center">
            <div class="visonet center-friend">
                <div class="wrap-box">
                    <div class="title">{{ $t('i18nPersonal.TabFriend.Friend') }}</div>
                    <InputIcon 
                    v-model="searchValue"
                    class="mg-r-10" 
                    icon="icon-search" 
                    placeholder="Tìm kiếm bạn bè" 
                    :autoFocus="true"/>
                </div>
                <div class="group-tab">
                    <div class="tab-item" v-for="(tab, index) in listTab" :key="index" @click="changeTab(index)">
                        {{ tab.titleTab }}
                        <div class="focus-tab" :class="{'active-tab' : currentTab == index ? true : false}"></div>
                    </div>
                </div>
                <div class="body-sub-tab">
                    <router-view :key="$route.path" :searchValue="searchValue"></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import InputIcon from "@/components/input-icon/InputIcon.vue"
export default {
    name: 'TabFriendPersonal',
    components: {
        InputIcon
    },
    data() {
        return {
            listTab:[
                {
                    titleTab: 'Tất cả bạn bè'
                },
                {
                    titleTab: 'Quê quán'
                },
            ],
            currentTab: 0,              //Tab dòng thời gian      
            searchValue: "",           
        }
    },
    methods: {
        /**
         * Thay đổi màn các tab
         */
        changeTab(index){
            this.currentTab = index;
            //ID của người dùng truy cập trang cá nhân
            let userID = this.$route.params.id;
            switch (index) {
                case 0:
                    this.$router.push({
                        name: 'TabAllFriend',
                        params: { id: userID }
                    }).catch(()=>{});
                    break;
                default:
                    break;
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.body-friend-personal{
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
    }
} 
.center-friend{
    width: 100%;
    .wrap-box{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title{
            font-size: 18px;
            font-weight: 500;
        }
        .row {
            display: -ms-flexbox; /* IE10 */
            display: flex;
            -ms-flex-wrap: wrap; /* IE10 */
            flex-wrap: wrap;
            padding: 0 4px;
        }
    }
    .group-tab{
        display: flex;
        margin-top: 16px;
        border-top: 1px solid #cccccc;
        .tab-item{
            white-space: nowrap;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #65676B;
            font-weight: 500;
            height: 46px;
            cursor: pointer;
            margin-right: 4px;
            padding: 0 10px;
            border-radius: 5px;
            .focus-tab{
                position: absolute;
                bottom: -4px;
                height: 3px;
                width: 100%;
            }
            .active-tab{
                background-color: #1876F2;
            }
        }
        .tab-item:hover{
            background-color: #F2F2F2;
        }
    }
    .body-sub-tab{
        width: 100%;
    }
}  
</style>