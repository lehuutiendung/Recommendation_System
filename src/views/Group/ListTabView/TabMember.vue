<template>
    <div class="tab-member">
        <div class="about-group">
            <div class="title">{{ $t('i18nGroup.TabGeneral.MemberGroup') }}</div>
            <div class="general">Nhóm có {{ totalMember }} thành viên</div>
            <InputIcon class="m-t-10" icon="icon-search" placeholder="Tìm kiếm thành viên" :autoFocus="true" width="auto"/>
            <!-- Quản trị viên -->
            <div class="sub-title">{{ $t('i18nGroup.TabMember.Admin') }}</div>
            <div class="admin-overview m-t-10">
                <div class="icon-40 icon-avatar"></div>
                <div class="name-item p-l-10">
                    <div class="username">Lê Hữu Tiến Dũng</div>
                    <div class="tag">{{ $t('i18nGroup.TabMember.Admin') }} </div>
                </div>
            </div>
            <!-- Thành viên khác -->
            <div class="sub-title">{{ $t('i18nGroup.TabMember.OtherMembers') }}</div>
            <div class="members" v-for="(item, index) in 10" :key="index">
                <ItemMember/>
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
        }
    },
    created() {
        GroupAPI.getByID(this.$route.params.id).then((res) => {
            this.dataGroup = res.data.doc;
            this.totalMember = this.dataGroup.members.length;
        })
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