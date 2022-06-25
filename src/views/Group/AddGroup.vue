<template lang="">
    <div>
        <Overview :showRightBar="false" :paddingTopContent="0">
            <template v-slot:left-bar>
                <div class="left-bar bar-create-group">
                    <div class="title-bar">{{ $t('i18nGroup.AddGroup.CreateGroup') }}</div>
                    <div class="wrap-item mg-b-10">
                        <div class="icon-40 icon-avatar">
                            <cld-image 
                                :publicId="cloudinaryID">
                                <cld-transformation gravity="south" crop="fill"/>
                            </cld-image>
                        </div>
                        <div class="name-item">
                            <div class="username">{{ userNameAccount }}</div>
                            <div class="admin">{{ $t('i18nGroup.AddGroup.Admin' )}}</div>
                        </div>
                    </div>
                    <Input class="m-b-14" label="Tên nhóm" :required="true" :maxlength="255" :autoFocus="true" v-model="groupName"/>
                    <Input class="m-b-20" label="Thông tin chung" v-model="generalGroup" :maxlength="1000"/>
                    <InputFile class="m-b-20" indexFile="add-group" @getDataImage="getDataImage"/>
                    <Button text="Tạo" Width="100%" :Height="44" :border_radius="5" :disable=" groupName ? false : true" @click.native="handleCreateGroup"/>
                </div>
            </template>
            <template v-slot:center>
                <div class="wrap-preview-group">
                    <div class="preview-group">
                        <div class="preview-background">
                            <img :src="previewImage" alt="" v-if="previewImage">
                            <img class="image-default" src="../../assets/groups-default-cover-photo-2x.png" alt="" v-else>
                        </div>
                        <div class="preview-name">
                            <div class="group-name" v-if="groupName">{{ groupName }}</div>
                            <div class="name-default" v-else>Tên nhóm</div>
                            <div class="members-default">1 thành viên</div>
                        </div>
                    </div>
                </div>
            </template>
        </Overview>
    </div>
</template>
<script>
import Overview from "@/views/Overview/Overview.vue"
import Input from "@/components/input/BaseInput.vue"
import InputFile from "@/components/input-file/InputFile.vue"
import Button from "@/components/buttontext/ButtonText.vue"
import GroupAPI from "@/api/GroupAPI.js"
export default {
    name: 'AddGroup',
    components:{
        Overview,
        Input,
        Button,
        InputFile
    },
    data() {
        return {
            previewImage: "",           //base64 preview image
            groupName: "",              //Tên nhóm
            backgroundGroup:{           //Background group
                type: File,
            },
            generalGroup: "",           //Thông tin chung group
            userNameAccount: "",
            cloudinaryID: ""
        }
    },
    created() {
        let userInfor = this.$store.getters.userInfor;
        this.userNameAccount = userInfor.userName;
        this.cloudinaryID = userInfor.avatar.cloudinaryID;
    },
    methods: {
        /**
         * Nhận emit thay đổi từ input file
         */
        getDataImage(file, preview){
            this.previewImage = preview;
            this.backgroundGroup = file;
        },
        /**
         * Sự kiện click tạo nhóm
         */
        handleCreateGroup(){
            let formData = new FormData();
            formData.append('admin', this.$cookie.get('u_id'));
            formData.append('name', this.groupName);
            formData.append('general', this.generalGroup);
            formData.append('background', this.backgroundGroup);
            GroupAPI.save(formData).then((res) => {
                this.$router.push({
                    name: 'GroupDetail',
                    params: { id: res.data.data.doc._id}
                });
            });
        }
    },
}
</script>
<style lang="scss" scoped>
.bar-create-group{
    background-color: #ffffff;
    padding: 20px;
    .title-bar{
        font-size: 22px;
        font-weight: 450;
    }
    .wrap-item{
        display: inline-flex;
        margin: 20px 0;
        .name-item{
            margin-left: 5px;
            .username{
                color: #111111;
                font-weight: 500;
            }
            .time{
                color: #656565;
            }
        }
    }
}    
.wrap-preview-group{
    width: calc(100% - var(--sidebarLeft-width));
    padding: 20px;
    box-sizing: border-box;
    .preview-group{
        background-color: #ffffff;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        padding: 16px;
        .preview-background{
            width: 100%;
            height: 360px;
            img{
                width: inherit;
                height: inherit;
                border-radius: 8px;
                object-fit: cover;
            }
            .image-default{
                -webkit-filter: grayscale(100%) contrast(30%) brightness(150%);
            }
        }
        .preview-name{
            width: 100%;
            padding: 16px;
            .group-name{
                font-size: 26px;
                font-weight: 700;
            }
            .name-default{
                font-size: 26px;
                font-weight: 700;
                color: #BCC0C4;
            }
            .members-default{
                font-size: 18px;
                color: #BCC0C4;
            }
        }
    }
}
</style>