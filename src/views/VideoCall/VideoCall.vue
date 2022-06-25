<template>
    <div class="monitor-video-call">
        <div class="zone-remote">
            <video id="remote-video" autoplay playsinline></video>
        </div>
        <div class="zone-local">
            <video id="local-video" autoplay muted playsinline></video>
        </div>
    </div>
</template>
<script>
export default {
    name: "VideoCall",
    data() {
        return {
            isChannelReady: false,
            isInitiator: false,
            isStarted: false,
        }
    },
    methods: {
        initVideoStream(){
            
        }
    },
}
</script>
<style lang="scss" scoped>
.monitor-video-call{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    .zone-remote{
        width: 40%;
        height: 40%;
    }
    .zone-local{
        width: 40%;
        height: 40%;
    }
}    
</style>