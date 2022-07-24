<template>
    <div class="not-found">
        <div class="icon-not-found"></div>
        <div class="text">{{ content }}</div>
    </div>
</template>
<script>
export default {
    name: 'NotFound',
    props:{
        content: {
            type: String,
            default: "Bài viết này hiện không khả dụng"
        }
    }
}
</script>
<style lang="scss" scoped>
.not-found{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 100px;
    .icon-not-found{
        background-image: url("../../assets/png/not-found.png");
        background-repeat: no-repeat;
        background-position: left;
        background-size: contain;
        height: 200px;
        width: 160px;
    }
    .text{
        font-size: 18px;
        font-weight: 450;
    }
}
</style>