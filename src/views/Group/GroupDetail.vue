<template>
    <div class="group-detail">
        <Overview :showPreContent="true" :paddingTopContent="0">
            <template v-slot:pre-content>
                <div class="header-group">
                    <div class="background">
                        <cld-image 
                            :publicId="dataGroup.background ? dataGroup.background.cloudinaryID : imageDefault" 
                            loading="lazy">
                            <cld-transformation width="auto" gravity="south" crop="fill"/>
                        </cld-image>
                    </div>
                    <div class="block-name">
                        <div class="group-name">{{ dataGroup.name }}</div>
                        <div class="flex">
                            <div class="privacy-group icon-private m-r-10"></div>
                            <div class="private-group">Nhóm riêng tư</div>
                            <span class="m-l-10 m-r-10">.</span>
                            <div class="members-default">{{ totalMember }} thành viên</div>
                        </div>
                        <div class="flex-end">
                            <ButtonText text="Đã tham gia"/>
                            <ButtonIcon text="Mời" icon="fb-icon-add"/>
                        </div>
                        <div class="wrap-header-item">
                            <div class="tab-item" v-for="(tab, index) in listTab" :key="index" @click="changeTab(index)">
                                {{ tab.titleTab }}
                                <div class="focus-tab" :class="{'active-tab' : currentTab == index ? true : false}"></div>
                            </div>    
                        </div>  
                    </div>
                </div>
            </template>
            <template v-slot:left-bar>
                <div class="left-bar"></div>
            </template>
            <template v-slot:center>
                <div class="center">
                    <router-view></router-view>
                </div>
            </template>
            <template v-slot:right-bar>
                <div class="right-bar"></div>
            </template>
        </Overview>
    </div>
</template>
<script>
import Overview from "@/views/Overview/Overview.vue"
import GroupAPI from "@/api/GroupAPI.js"
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue"
import ButtonText from "@/components/buttontext/ButtonText.vue"
export default {
    name: 'GroupDetail',
    components:{
        Overview,
        ButtonIcon,
        ButtonText
    },
    data() {
        return {
            imageDefault: "Image Default/groups-default-cover-photo-2x_k8zc6f",
            dataGroup: {},
            totalMember: 0,
            listTab:[
                {
                    titleTab: 'Giới thiệu'
                },
                {
                    titleTab: 'Thảo luận'
                },
                {
                    titleTab: 'Thành viên'
                }
            ],
            currentTab: 0,              //Tab giới thiệu
        }
    },
    created() {
        this.detectActiveTab();
        GroupAPI.getByID(this.$route.params.id).then((res) => {
            this.dataGroup = res.data.doc;
            this.totalMember = this.dataGroup.members.length + 1;
        })
    },
    methods: {
        /**
         * Phát hiện tab hiện tại và bật active tab tương ứng
         */
        detectActiveTab(){
            let nameRoute = this.$route.name;
            if(nameRoute == "GroupDetail.TabGeneralGroup"){
                this.currentTab = 0;
            }else if(nameRoute == "GroupDetail.TabDiscussionGroup"){
                this.currentTab = 1;
            }else{
                this.currentTab = 2;
            }
        },
        /**
         * Thay đổi màn các tab
         */
        changeTab(index){
            this.currentTab = index;
            switch (index) {
                case 0:
                    this.$router.push({
                        name: 'GroupDetail.TabGeneralGroup',
                        params: { id: this.dataGroup._id}
                    }).catch(()=>{});
                    break;
                case 1:
                    this.$router.push({
                        name: 'GroupDetail.TabDiscussionGroup',
                        params: { id: this.dataGroup._id}
                    }).catch(()=>{});
                    break;
                case 2: 
                    this.$router.push({
                        name: 'GroupDetail.TabMemberGroup',
                        params: { id: this.dataGroup._id}
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
.group-detail{
    overflow: auto;
    .header-group{
        background-color: #ffffff;
        .background{
            width: 100%;
            height: 350px;
            display: flex;
            justify-content: center;
            background-color: #FFDEE9;
            background-image: linear-gradient(0deg, #FFFFFF 0%, #B5FFFC 100%);
            img{
                width: 70%;
                height: inherit;
                object-fit: cover;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }
        }
        .block-name{
            width: 100%;
            padding-top: 16px;
            padding-left: 15%;
            padding-right: 15%;
            .group-name{
                font-size: 26px;
                font-weight: 700;
            }
            .name-default{
                font-size: 26px;
                font-weight: 700;
                color: #BCC0C4;
            }
            .privacy-group{
                background-image: url(https://www.facebook.com/rsrc.php/v3/yh/r/JFz-Mva7-Bh.png);
                background-size: auto;
                width: 12px;
                height: 12px;
                background-repeat: no-repeat;
                display: inline-block;
                -webkit-filter: var(--filter-secondary-icon);
            }
            .icon-private{
                background-position: 0px -583px;
            }
            .private-group{
                font-size: 18px;
                color: #606770;
            }
            .members-default{
                font-size: 18px;
                color: #606770;
            }
            .members-default:hover{
                text-decoration: underline;
                cursor: pointer;
            }
        }
    }
}    
.block-name .wrap-header-item{
    padding: 4px 15%;
    margin-top: 20px;
    border-top: 1px solid #cccccc;
    display: flex;
    .tab-item{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #65676B;
        font-weight: 500;
        height: 46px;
        width: 100px;
        cursor: pointer;
        margin-right: 4px;
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
</style>