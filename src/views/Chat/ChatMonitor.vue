<template>
    <div class="monitor-chat">
        <Overview :showRightBar="false" :paddingTopContent="0">
            <template v-slot:left-bar>
                <div class="left-bar left-bar-chat">
                    <div class="wrap-online">
                        <div class="title-online m-l-20">{{$t('i18nCommon.Online')}}</div>
                        <div class="wrap-item flex m-b-4" v-for="friend in lstFriends" :key="friend.userID" @click="chatWithFriend(friend)">
                            <div class="icon-online m-r-4" v-if="friend.isOnline"></div>
                            <div class="icon-offline m-r-4" v-else></div>
                            <div class="flex">
                                <div class="icon-32 icon-avatar">
                                    <cld-image 
                                        :publicId="friend.avatar.cloudinaryID">
                                        <cld-transformation gravity="south" crop="fill"/>
                                    </cld-image>
                                </div>
                                <div class="name-item">{{friend.userName}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:center>
                <div class="body-content">
                    <div class="frame-chat">
                        <div class="header-box">
                            <div class="flex">
                                <div class="icon-32 icon-avatar">
                                    <cld-image 
                                        :publicId="dataFriend.avatar.cloudinaryID">
                                        <cld-transformation gravity="south" crop="fill"/>
                                    </cld-image>
                                </div>
                                <div class="name">{{ dataFriend.userName }}</div>
                            </div>
                        </div>
                        <div class="wrap-flex" ref="contentMessage">
                            <div class="content-box">
                                <!-- Title khi không có bạn bè -->
                                <div class="no-friend-content" v-if="lstFriends.length == 0">{{ $t('i18nChat.NoFriendContent') }}</div>
                                <ul class="messages" v-for="(message, index) in lstMessage" :key="index">
                                    <li class="self" v-if="message.fromUserID == fromUserID">
                                        <div>{{message.content}}</div>
                                        <div v-for="image in message.image" :key="image.cloudinaryID">
                                            <cld-image 
                                                :publicId="image.cloudinaryID" loading="lazy">
                                                <cld-transformation gravity="south" crop="fill"/>
                                            </cld-image>
                                        </div>
                                    </li>
                                    <li class="other" v-else>
                                        <div>{{message.content}}</div>
                                        <div v-for="image in message.image" :key="image.cloudinaryID">
                                            <cld-image 
                                                :publicId="image.cloudinaryID" loading="lazy">
                                                <cld-transformation gravity="south" crop="fill"/>
                                            </cld-image>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="preview-image" v-if="previewImages.length > 0">
                                <div class="image" v-for="(image, key) in previewImages" :key="key">
                                    <img ref="image" :src="image">
                                    <div class="icon-24 clear-img" @click="clearImage(key)">
                                        <div class="icon-16 icon-exit"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="typing-chat" v-if="dataTyping.typing && (dataTyping.toUserID == fromUserID)">{{ dataTyping.fromUserName }} đang soạn tin nhắn</div>
                        </div>
                        <div class="footer-box">
                            <div class="comment" 
                            contenteditable="true" 
                            v-on="listeners" 
                            ref="messagechat" 
                            @keydown.enter.prevent="submitChat"
                            ></div>
                            <div class="item-comment">
                                <div class="icon-24 icon-filter-invert item-image">
                                    <input class="input-file" ref="inputfilechat" type="file" accept=".jpg, .jpeg, .png, .gif" multiple @change="onFileChange">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Overview>
    </div>
</template>
<script>
import Overview from "@/views/Overview/Overview.vue"
import UserAPI from "@/api/UserAPI.js"
import ChatAPI from "@/api/ChatAPI.js";
import {EventBus} from "../../main"
export default {
    name: 'ChatMonitor',
    components:{
        Overview,
    },
    data() {
        return {
            lstFriends: [],
            lstMessage: [],
            previewImages: [],      //Danh sách các src ảnh base 64 -> Preview Image
            chatImages: [],         //Ảnh trong chat
            textMessage: "",        //Tin nhắn text
            fromUserID: "",         //ID người gửi tin nhắn,
            toUserID: "",           //ID nggười nhận tin nhắn    ,
            pageSize: 1,
            onTopPageSize: false,   //Đã scroll hết bản ghi
            dataFriend: {
                avatar:{
                    cloudinaryID: ""
                }
            },
            isViewChatMonitor: false,       //Tại màn chat lớn ChatMonitor hay không (giải quyết vấn đề nhận tin nhắn mới, tự động scroll bottom),
            dataTyping: {},          //Đang gõ tin nhắn hay không,
            ownerName: null,        //Tên người dùng tài khoản
        }
    },
    async created() {
        EventBus.$emit("exit-chat");
        await this.statusFriends();
        let userInfor = this.$store.getters.userInfor;
        this.fromUserID = userInfor._id;
        this.ownerName = userInfor.userName;
        if(this.lstFriends.length > 0){
            this.toUserID = this.lstFriends[0]._id;
            this.dataFriend = this.lstFriends[0];
            this.isViewChatMonitor = true;      
            await this.getPagingMessage();
            this.pageSize++;
            await this.getPagingMessage();
        }
    },
    computed: {
        listeners() {
            return { ...this.$listeners, input: this.onInput };
        },
    },
    mounted() {
        // this.$refs.messagechat.innerText = this.value;
        let framechatBody = this.$refs.contentMessage;
        setTimeout(() => {
            framechatBody.scrollTo(0, document.body.scrollHeight + 100)
        }, 100);

        this.$socket.on("typing", (data) => {
            this.dataTyping = data;
        })

        //Nhận message từ socket server
        this.$socket.on("receive-message", (message) => {
            //Bắn tin nhắn socket và cập nhật list message về đúng box chat có người gửi trùng khớp người nhận
            if(this.toUserID == message.fromUserID){
                this.lstMessage.push(message);
                if(this.isViewChatMonitor){
                    this.scrollToBottomChat();
                }
            }
        })

        framechatBody.addEventListener("scroll", async () => {
            let initialHeight = framechatBody.scrollHeight;
            if (framechatBody.scrollTop == 0 && !this.onTopPageSize) {
                this.pageSize++;
                await this.getPagingMessage();
                this.$nextTick(()=>{
                    framechatBody.scrollTop = framechatBody.scrollHeight - initialHeight;
                })
            }
        })
    },
    methods: {
        async statusFriends(){
            let param = {
                userID: this.$cookie.get('u_id')
            }
            await UserAPI.getStatusOfFriends(param).then(res => {
                if(res.data && res.data.success){
                    this.lstFriends = res.data.lstFriends;
                }
            })
        },
        //Click chọn chat với bạn bè
        async chatWithFriend(data){
            this.lstMessage = [];
            this.dataFriend = data; 
            this.toUserID = this.dataFriend._id;
            this.pageSize = 1;
            await this.getPagingMessage();
            this.pageSize++;
            await this.getPagingMessage();

        },
        onInput(e) {
            this.textMessage = e.target.innerText;
        },
        /**
         * Render preview image
         */
        onFileChange(e) {
            let arrayImages = e.target.files;
            // Lưu vào mảng images dùng làm data call api
            this.chatImages = e.target.files;
            for (let i = 0; i < arrayImages.length; i++) {
                let reader = new FileReader();
                reader.readAsDataURL(arrayImages[i]);
                reader.onload = () => {
                    this.imgSrc = reader.result;
                    this.previewImages.push(this.imgSrc);
                };
            }
        },
        /**
         * Xóa image preview
         */
        clearImage(key){
            this.$refs.inputfilechat.value = "";
            //Không thể splice với array File, cần convert sang Array.
            let tempArr = Array.from(this.chatImages);
            tempArr.splice(key, 1);
            this.chatImages = tempArr;
            this.previewImages.splice(key, 1);
        },
        //Check image định dạng base64
        isBase64(str) {
            if(str.includes("data:image/jpeg;base64") 
            || str.includes("data:image/png;base64") 
            || str.includes("data:image/jpg;base64") 
            || str.includes("data:image/gif;base64")){
                return true;
            }else{
                return false;
            }
        },
        //Gửi tin nhắn chat
        async submitChat(){
            if(this.textMessage == '' && this.chatImages.length == 0){
                return;
            }

            let images = [];
            if(this.chatImages.length > 0){
                let formData = new FormData();
                for( var i = 0; i < this.chatImages.length; i++ ){
                    let file = this.chatImages[i];
                    formData.append('image', file);
                }
                //Lưu hình ảnh lên cloudinary => trả về list cloudinaryID (lưu ID vào db)
                await ChatAPI.saveImgToCloud(formData).then((res) => {
                    images = res.data.urls;
                });
            }
            let message = {
                fromUserID: this.fromUserID,
                toUserID: this.toUserID,
                content: this.textMessage,
                image: images,
            }
            
            this.$socket.emit('send-message', message);
            this.lstMessage.push(message);
            this.$emit("clearMessage");
            this.scrollToBottomChat();
            this.chatImages = [];
            this.previewImages = [];
            this.textMessage = "";
        },
        async getPagingMessage(){
            let param = {
                fromUserID: this.fromUserID,
                toUserID: this.toUserID,
                pageSize: this.pageSize
            }
            await ChatAPI.pagingMessage(param).then(res => {
                if(res.data.success && res.data.data){
                    this.lstMessage = res.data.data.messages.concat(this.lstMessage);
                }else{
                    this.onTopPageSize = true;
                }
            })
            
        },
        //Xử lý scroll khi có tin nhắn mới
        scrollToBottomChat(){
            setTimeout(() => {
                let frameChat = this.$refs.contentMessage;
                if(frameChat){
                    frameChat.scrollTop = frameChat.scrollHeight;
                }
            }, 200);
        },
        //Tắt box chat
        exitChat(){
            this.$emit("exitChat");
        }
    },
    watch:{
        textMessage: function(){
            if(this.textMessage == ""){
                this.$refs.messagechat.innerText = this.textMessage;
                let data = {
                    fromUserID: this.fromUserID,
                    fromUserName: this.ownerName,
                    toUserID: this.toUserID,
                    typing: false
                }
                this.$socket.emit("stopTyping", data)
            }else{
                let data = {
                    fromUserID: this.fromUserID,
                    fromUserName: this.ownerName,
                    toUserID: this.toUserID,
                    typing: true
                }
                this.$socket.emit("typing", data);
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.left-bar-chat{
    background-color: #ffffff;
    padding: 20px;
    .wrap-online{
        display: flex;
        flex-direction: column;
        padding: 6px 0px;
        padding-right: 13px;
        cursor: pointer;
        height: 100%;
    }
    .title-online{
        font-weight: 450;
        margin-bottom: 10px;
        margin-top: 6px;
    }
    .wrap-item{
        position: relative;
        display: flex;
        align-items: center;
        height: 50px;
        margin-left: 10px;
        padding: 6px 10px;
        cursor: pointer;
        border-radius: 5px;
    }
    .wrap-item:hover{
        background-color: #DEE4ED;
    }
    .wrap-item .name-item{
        margin-left: 10px;
        font-weight: 500;
        font-size: 15px;
        color: #313131;
    }
    .wrap-item .name-item .username{
        font-weight: 500;
    }
    .wrap-item .name-item .title{
        font-weight: 400;
        color: #747575;
    }
}    
.body-content{
    width: calc(100% - var(--sidebarLeft-width));
    height: calc(100% - 56px);
    padding: 20px;
    box-sizing: border-box; 
}
.frame-chat{
    position: relative;
    // background-color: #ffffff;
    // width: 100%;
    // height: 100%;
    // border-radius: 8px;
    // padding: 16px;

    width: 100%;
    height: calc(103vh - 111px);
    background-color: #ffffff;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;;
    border-radius: 10px;
    overflow: hidden;
}
.header-box{
    width: 100%;
    height: 52px;
    // background-color: #03a0df;
    background-color: #CEF4CF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    .name{
        margin-left: 10px;
        color: #111111;
        font-weight: 450;
    }
}
.button-exit{
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    cursor: pointer;
}
.button-exit:hover{
    background-color: #dddddd;
}
.icon-exit{
    background: url("../../assets/svg/x-svgrepo-com.svg");
    background-size: contain;
}
.footer-box{
    height: 43px;
    width: 96%;
    position: absolute;
    bottom: 12px;
    left: 18px;
    padding: 4px 0;
    .comment{
        width: 100%;
        height: 100%;
        padding: 10px;
        padding-right: 32px;
        background-color: #F0F2F5;
        overflow-y: scroll;
    }
    .item-comment{
        display: flex;
        position: absolute;
        top: 12px;
        right: 12px;
    }
    .item-comment .item-image{
        background: url(../../assets/icon/ICON.svg) -336px -216px no-repeat;
        cursor: pointer;
    }
    .item-comment .icon-filter-invert:hover {
        filter: invert(.5) sepia(1) hue-rotate(180deg) saturate(4) brightness(1);
    }
    .input-file{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: inherit;
        opacity: 0;
        cursor: pointer;
    }
}
.typing-chat{
    position: sticky;
    width: 100%;
    bottom: 0px;
    display: flex;
    padding-left: 18px;
    padding-bottom: 4px;
    padding-top: 4px;
    background-color: #ffffff;
}
.preview-image{
    position: sticky;
    width: 100%;
    bottom: 0px;
    display: flex;
    padding-left: 20px;
    padding-bottom: 4px;
    padding-top: 4px;
    overflow-y: scroll;
    overflow-x: overlay;
    background-color: #ffffff;
}
.preview-image .image{
    position: relative;
    margin-right: 10px;
}
.preview-image .image .clear-img{
    position: absolute;
    top: 0;
    right: 0;
    background-color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
    cursor: pointer;
}
.preview-image .image .clear-img:hover{
    background-color: #dfdfdf;
}
.preview-image img{
    max-width: 100px;
    max-height: 100px;
}
.wrap-flex{
    width: 100%;
    height: calc(100% - 118px);
    position: relative;
    overflow-x: auto;
    .content-box{
        height: 100%;
        .no-friend-content{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            -webkit-transform: translate(-50%, -50%);
            font-size: 20px;
            font-weight: 450;
            text-align: center;
            white-space: nowrap;
        }
    }
}
$chat-thread-bgd-color: #CEF4CF;
$chat-text-color: #111111;
$chat-thread-msg-arrow-size: 10px;
$chat-thread-avatar-size: 25px;
$chat-thread-offset: #{$chat-thread-avatar-size - 10px};
.messages {
    padding: 10px;
    margin: 0;
    list-style: none;
    flex-grow: 1;
    border-radius: 4px;
    background: transparent;
    li {
        position: relative;
        clear: both;
        display: inline-block;
        padding: 14px;
        margin: 0 0 10px 0;
        border-radius: 10px;
        background-color: $chat-thread-bgd-color;
        word-wrap: break-word;
        max-width: 81%;
        &:before {
            position: absolute;
            top: 0;
            width: $chat-thread-avatar-size;
            height: $chat-thread-avatar-size;
            border-radius: $chat-thread-avatar-size;
            content: '';
            background-size: cover;
        }
        &:after {
            position: absolute;
            top: $chat-thread-msg-arrow-size;
            content: '';
            width: 0;
            height: 0;
            border-top: $chat-thread-msg-arrow-size solid $chat-thread-bgd-color;
        }
    }
    li.self {
        animation: show-chat-odd 0.15s 1 ease-in;
        -moz-animation: show-chat-odd 0.15s 1 ease-in;
        -webkit-animation: show-chat-odd 0.15s 1 ease-in;
        float: right;
        margin-right: $chat-thread-offset;
        color: $chat-text-color;
    }
    // li.self:before {
    //     right: -$chat-thread-offset;
    //     // Placeholder avatar 1
    //     background-image: url(https://github.com/Thatkookooguy.png);
    // }
    li.self:after {
        border-right: $chat-thread-msg-arrow-size solid transparent;
        right: -$chat-thread-msg-arrow-size;
    }
    li.other {
        animation: show-chat-even 0.15s 1 ease-in;
        -moz-animation: show-chat-even 0.15s 1 ease-in;
        -webkit-animation: show-chat-even 0.15s 1 ease-in;
        float: left;
        margin-left: $chat-thread-offset;
        color: $chat-text-color;
    }
    // li.other:before {
    //     left: -$chat-thread-offset;
    //     // Placeholder avatar 2
    //     background-image: var(--avatarCloud);
    // }
    li.other:after {
        border-left: $chat-thread-msg-arrow-size solid transparent;
        left: -$chat-thread-msg-arrow-size;
    }
    li img{
        // width: -webkit-fill-available;
        width: 380px;
        margin-top: 4px;
    }
}
.icon-online{
    width: 18px;
    height: 18px;
    background-size: contain;
    background-image: url(../../assets/png/online.png);
}
.icon-offline{
    width: 18px;
    height: 18px;
    background-size: contain;
    background-image: url(../../assets/png/offline.png);
}
</style>
<style lang="scss">
.monitor-chat .overview .content{
    overflow-y: hidden!important;;
}
</style>