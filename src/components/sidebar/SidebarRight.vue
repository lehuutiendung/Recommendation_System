<template>
    <div class="sidebar-right">
        <slot name="title">
            <div class="title">{{$t('i18nCommon.SuggestForYou')}}</div>
        </slot>
        <div v-for="(skeleton, index) in 4" :key="`skeleton-${index}`" v-show="showSkeleton">
            <Skeleton></Skeleton>
        </div>
        <div v-for="(detailData, index) in dataSource" :key="index" v-show="!showSkeleton">
            <recommend-post-card
                :detailData="detailData"
            ></recommend-post-card>
        </div>
    </div>
</template>
<script>
import RecommendAPI from "@/api/RecommendAPI.js"
import RecommendPostCard from "@/components/recommend-post/RecommendPostCard.vue"
import Skeleton from "@/components/skeleton/Skeleton.vue"
export default {
    name: 'SidebarRight',
    components: {
        RecommendPostCard,
        Skeleton
    },
    data() {
        return {
            dataSource: [],
            showSkeleton: true,
        }
    },
    methods: {
        async recommendPost(){
            let userInfo = this.$store.getters.userInfor
            let userID = userInfo.userID;
            let userIDMongo = userInfo._id;
            let param = {
                userID: userID,
                userIDMongo: userIDMongo
            }
            await RecommendAPI.getRecommendPost(param).then(res => {
                this.dataSource = res.data;
                this.showSkeleton = false;
            })
        }
    },
    watch:{
        "$store.getters.userInfor":{
            handler(val){
                if(val && val._id){
                    this.recommendPost();
                }
            },
            deep: true,
            immediate: true
        }
    }
}
</script>
<style lang="scss" scoped>
.sidebar-right{
    padding-right: 30px;
    .title{
        font-size: 16px;
        font-weight: 450;
    }
}
</style>
