<template>
    <div class="item-member">
        <div class="icon-40 icon-avatar">
            <cld-image 
                :publicId="member.avatar.cloudinaryID">
                <cld-transformation gravity="south" crop="fill"/>
            </cld-image>
        </div>
        <div class="name-item p-l-10">
            <div class="username">{{ member.userName }}</div>
            <div class="tag" v-if="member._id == admin._id">{{ $t('i18nGroup.TabMember.Admin') }} </div>
            <div class="tag" v-else>{{ $t('i18nGroup.TabMember.Member') }} </div>
        </div>
        <div class="icon-32 option-post" v-if="member._id != admin._id && admin._id == userID" @click="showOption" v-click-outside="hidePopupOption">
            <div class="icon-16 icon-three-dots"></div>
        </div>
        <div class="popup-option" v-if="isShowOption">
            <div class="item-option item-delete" @click="deleteMember(member._id)">Xóa thành viên</div>
        </div>
    </div>
</template>
<script>
import ClickOutSide from "@/mixins/detectoutside.js"
import GroupAPI from "@/api/GroupAPI.js"
export default {
    name: 'ItemMember',
    directives: {
        ClickOutSide
    },
    props:{
        member:{
            type: Object,
            default(){
                return {
                    avatar: {
                        cloudinaryID: ""
                    }
                }
            }
        },
        admin:{
            type: Object,
            default(){
                return {}
            }
        },
        dataGroup:{
            type: Object,
            default(){
                return {}
            }
        }
    },
    data() {
        return {
            userID: "",
            isShowOption: false,    // Ẩn/hiện popup option trên các thành viên
        }
    },
    created() {
        let userInfor = this.$store.getters.userInfor;
        this.userID = userInfor._id;
    },
    methods: {
        // Hiện option (3 dots)
        showOption(index){
            this.isShowOption = !this.isShowOption;
            this.currentMemberChoose = index;
        },
        // Ẩn option (3 dots)
        hidePopupOption(){
            this.isShowOption = false;
        },
        //Xóa thành viên
        deleteMember(memberID){
            let dataRequest = {
                groupID: this.dataGroup._id,
                userID: memberID
            }
            GroupAPI.outGroup(dataRequest).then(res => {
                if(res.data && res.data.success){
                    this.$emit("afterDeleteMember", memberID);
                }
            });
        }
    },
}
</script>
<style lang="scss" scoped>
.item-member{
    display: flex;
    position: relative;
    margin-bottom: 20px;
    .option-post{
        position: absolute;
        top: 4px;
        right: 0px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .option-post:hover{
        background-color: #dddddd;
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
.icon-three-dots{
    background: url(../../../assets/svg/three-dots-svgrepo-com.svg);
    background-size: contain; 
    -webkit-filter: var(--filter-secondary-icon);
}
/* Popup lựa chọn bài viết */
.popup-option{
    position: absolute;
    top: 40px;
    right: 14px;
    padding: 4px;
    background-color: #ffffff;
    box-shadow: 0 0 2px 0 rgb(0 0 0 / 50%);
    border-radius: 4px;
    font-weight: 500;
    z-index: 10;
}
.popup-option .item-option{
    padding: 10px;
    cursor: pointer;
}
.popup-option .item-delete{
    color: #ff3217;
}
.popup-option .item-option:hover{
    background-color: #F2F7FC;
}
</style>