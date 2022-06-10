<template>
    <div class="view-zoom-img">
        <div class="dimmed"></div>
        <div class="icon-34 button-exit" @click.stop="clickExitDimmed">
            <div class="icon-16 icon-exit"></div>
        </div>
        <div class="full-image">
            <cld-image 
                :publicId="dataZoomImage" 
                loading="lazy">
                <cld-transformation width="auto" gravity="south" crop="fill"/>
            </cld-image>
        </div>
    </div>
</template>
<script>
export default {
    name: "ZoomImage",
    props:{
        dataZoomImage:{
            type: String,
            default: ""
        }
    },
    methods: {
        clickExitDimmed(){
            this.$emit("exitDimmed");
        }
    },
}
</script>
<style lang="scss" scoped>
.view-zoom-img{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
}
.dimmed{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #111;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    opacity: 0.8;
}    
.button-exit{
    position: absolute;
    top: 15px;
    right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    z-index: 999;
    cursor: pointer;
    background-color: #ffffff;
}
.button-exit:hover{
    background-color: #dddddd;
}
.icon-exit{
    background: url(../../assets/svg/x-svgrepo-com.svg);
    background-size: contain;
}
.full-image{
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 999;
    img{
        height: 90vh;
        object-fit: cover;
        z-index: 100;
        transition: all 0.3s ease-in-out;
    }
}
</style>