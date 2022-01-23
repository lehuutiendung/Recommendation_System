<template>
    <div class="tab-general">
        <div class="about-group">
            <div class="title">{{ $t('i18nGroup.TabGeneral.IntroduceGroup') }}</div>
            <div class="general">{{ dataGroup.general }}</div>
            <div class="privacy m-t-10">
                <div class="fb-icon-private"></div>
                <div class="content-privacy">
                    <div class="type-privacy">{{ $t('i18nGroup.TabGeneral.Private') }}</div>
                    <div>{{ $t('i18nGroup.TabGeneral.PrivateRule') }}</div>
                </div>
            </div>
        </div>
        <div class="about-group">
            <div class="title">{{ $t('i18nGroup.TabGeneral.MemberGroup') }}</div>
            <div class="general">{{ totalMember }} thành viên</div>
            <div class="admin-overview m-t-10">
                <div class="icon-32 icon-avatar"></div>
                <div class="name-item p-l-10">
                    <div class="username">Lê Hữu Tiến Dũng là {{ $t('i18nGroup.TabGeneral.Admin') }}</div>
                </div>
            </div>
            <div class="view-more-member">{{ $t('i18nGroup.TabGeneral.ViewMoreMember') }}</div>
        </div>
    </div>
</template>
<script>
import GroupAPI from "@/api/GroupAPI.js"
export default {
    name: 'TabGeneralGroup',
    data() {
        return {
            dataGroup: {},
            totalMember: 0,
        }
    },
    created() {
        GroupAPI.getByID(this.$route.params.id).then((res) => {
            this.dataGroup = res.data.doc;
            this.totalMember = this.dataGroup.members.length + 1;
        })
    },
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
        .privacy{
            display: flex;
            .content-privacy{
                width: fit-content;
                padding-left: 10px;
            }
            .type-privacy{
                font-size: 16px;
                font-weight: 450;
            }
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
</style>