<template>
    <div class="tab-general">
        <div class="about-group">
            <div class="title">{{ $t('i18nGroup.TabGeneral.IntroduceGroup') }}</div>
            <div class="general">
                <div v-if="dataGroup.general != ''">{{ dataGroup.general }}</div>
                <div v-else>Hãy tham gia nhóm {{ dataGroup.name }} để cập nhật những thông tin hữu ích.</div>
            </div>
        </div>
        <div class="about-group">
            <div class="title">{{ $t('i18nGroup.TabGeneral.AdminGroup') }}</div>
            <div class="admin-overview m-t-10">
                <div class="icon-32 icon-avatar">
                    <cld-image
                        :publicId="adminGroup.avatar.cloudinaryID">
                        <cld-transformation gravity="south" crop="fill"/>
                    </cld-image>
                </div>
                <div class="name-item p-l-10">
                    <div class="username">{{ adminGroup.userName }} {{ $t('i18nGroup.TabGeneral.Admin') }}</div>
                </div>
            </div>
        </div>
        <div class="about-group out-group" v-if="userJoined" @click="handleOutGroup">
            <div v-if="isOwner">Xóa nhóm</div>
            <div v-if="!isOwner">Rời nhóm</div>
        </div>
    </div>
</template>
<script>
import GroupAPI from "@/api/GroupAPI.js"
export default {
    name: 'TabGeneralGroup',
    props:{
        userJoined: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dataGroup: {},
            adminGroup: {
                avatar: {
                    cloudinaryID: "",
                }
            },
            totalMember: 0,
            isOwner: false,
        }
    },
    created() {
        let param = {
            groupID: this.$route.params.id,
            userID: this.$cookie.get("u_id")
        }
        GroupAPI.getByID(param).then((res) => {
            if(res.data && res.data.success){
                this.dataGroup = res.data.doc;
                this.adminGroup = this.dataGroup.admin;
                this.totalMember = this.dataGroup.members.length;
                if(this.adminGroup._id == this.$cookie.get("u_id")){
                    this.isOwner = true;
                }
            }
        })
    },
    methods: {
        handleOutGroup(){
            // Xóa nhóm
            if(this.isOwner){
                GroupAPI.deleteByID(this.dataGroup._id);
                
            }else{
                // Rời nhóm
                let dataRequest = {
                    groupID: this.dataGroup._id,
                    userID: this.$cookie.get("u_id")
                }
                GroupAPI.outGroup(dataRequest);
            }
            this.$router.push({
                name: 'OverviewGroup'
            }).catch(()=>{});
        },
    }
}
</script>
<style lang="scss" scoped>
.tab-general{
    display: flex;
    flex-direction: column;
    width: 100%;
    .about-group{
        padding: 18px;
        margin-top: 15px;
        background-color: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 8px;
        box-shadow: var(--shadow-008);
        .title{
            font-size: 17px;
            font-weight: 450;
            padding-bottom: 10px;
            border-bottom: 1px solid #cccccc;
            margin-bottom: 10px;
        }
        .admin-overview{
            display: flex;
            align-items: center;
        }
        .view-more-member{
            font-weight: 450;
            cursor: pointer;
            margin-top: 10px;
        }
        .view-more-member:hover{
            text-decoration: underline;
        }
    }
    .out-group{
        display: flex;
        justify-content: center;
        color: red;
        cursor: pointer;
        font-weight: 500;
    }
    .out-group:hover{
        background-color: #fdf4f4;
    }
}    
</style>