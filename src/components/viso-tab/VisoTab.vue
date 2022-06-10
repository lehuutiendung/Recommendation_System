<template v-for="item in listTab">
    <div class="h-full">
        <div class="flex tab-header">
            <div
                v-for="tab in listTab"
                :key="tab.tabKey"
                @click="tabActive(tab)"
                class="viso-tab"
                :class="{'tabActived': tab.tabKey == tabActived.tabKey}"
            >{{tab.titleTab}}</div>
        </div>
        <template v-for="tab in listTabRender">
            <div class="tab-item" :key="tab.tabKey" v-show="tab == tabActived">
                <components :is="tab.component"></components>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    name: 'VisoTab',
    props: {
        listTab: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            tabActived: null,
            listTabRender: [],
        }
    },
    created() {
        const me = this;
        me.tabActive(me.listTab[0])
    },
    methods: {
        tabActive(tab){
            const me = this;
            me.tabActived = tab;
            me.$emit("changeTab", tab);
            if(!me.listTabRender.includes(tab)){
                me.listTabRender.push(tab);
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.tabActived{
    font-weight: bold;
    border-bottom: 3px solid #cccccc;
    color: #111 !important
}
.viso-tab{
    padding: 14px 20px;
    height: 48px;
    cursor: pointer;
    font-size: 14px;
    color: #666;
}
.tab-header{
    border-bottom: 1px solid #eaedf3;
    height: 48px;
}
.tab-item{
    height: calc(100% - 48px);
    overflow-y: auto;
}
</style>