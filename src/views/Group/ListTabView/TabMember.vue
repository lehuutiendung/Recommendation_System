<template>
    <div class="tab-member">
        <div class="about-group">
            <div class="title">{{ $t('i18nGroup.TabGeneral.MemberGroup') }}</div>
            <div class="general">Nhóm có {{ totalMember }} thành viên</div>
            <InputIcon 
            v-model="searchValue"
            @input.native="filterMember"
            class="m-t-10" 
            icon="icon-search" 
            placeholder="Tìm kiếm thành viên" 
            :autoFocus="true" 
            width="auto"/>
            <!-- Thành viên-->
            <div class="sub-title">{{ $t('i18nGroup.TabMember.Member') }}</div>
            <div class="members m-b-20" v-for="(member, index) in lstMembers" :key="index">
                <ItemMember
                :member="member"
                :admin="admin"
                :dataGroup="dataGroup"
                @afterDeleteMember="afterDeleteMember"
                >
                </ItemMember>
            </div>
            <div class="no-match" v-if="lstMembers.length == 0">
                <span>{{ $t('i18nCommon.NoMatch') }}</span> 
                <span>"{{searchValue}}"</span> 
            </div>
        </div>
    </div>
</template>
<script>
import InputIcon from "@/components/input-icon/InputIcon.vue"
import GroupAPI from "@/api/GroupAPI.js"
import ItemMember from "../Item/ItemMember.vue"
export default {
    name: "TabMemberGroup",
    components:{
        InputIcon,
        ItemMember
    },
    data() {
        return {
            dataGroup: {},
            totalMember: 0,
            admin: {
                _id: "",
                userName: "",
                cloudinaryID: ""
            },
            lstMembers: [],
            isShowOption: false,    // Ẩn/hiện popup option trên các thành viên,
            searchValue: ""         // Tìm kiếm thành viên
        }
    },
    async created() {
        let param = {
            groupID: this.$route.params.id,
            userID: this.$cookie.get("u_id")
        }
        await GroupAPI.getByID(param).then((res) => {
            this.dataGroup = res.data.doc;
            this.totalMember = this.dataGroup.members.length;
            this.admin._id = this.dataGroup.admin._id;
            this.admin.userName = this.dataGroup.admin.userName;
            this.admin.cloudinaryID = this.dataGroup.admin.avatar.cloudinaryID;
        })
        await this.filterMember();
    },
    methods: {
        //Lấy tất cả thành viên của nhóm
        async filterMember(){
            let param = {
                groupID: this.dataGroup._id,
                userName: this.searchValue
            }
            await GroupAPI.filterMember(param).then(res => {
                if(res.data && res.data.success){
                    this.lstMembers = res.data.data;
                }
            })
        },
        //Loại bỏ nhân viên trong list sau khi xóa
        afterDeleteMember(memberID){
            this.lstMembers = this.lstMembers.filter(x => x._id != memberID);
        }
    },
}
</script>
<style lang="scss" scoped>
.tab-member{
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
        .sub-title{
            font-size: 15px;
            font-weight: 450;
            border-top: 1px solid #cccccc;
            margin: 10px 0;
            padding-top: 10px;
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
}  
.members{
    position: relative;
}
.username{
    font-weight: 450;
    cursor: pointer;
}
.username:hover{
    text-decoration: underline;
}
.tag{
    padding: 4px;
    background-color: #E7F3FF;
    width: fit-content;
    border-radius: 4px;
} 


</style>