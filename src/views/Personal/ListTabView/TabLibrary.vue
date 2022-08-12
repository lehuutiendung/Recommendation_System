<template>
    <div class="body-library-personal">
        <!-- Center -->
        <div class="center">
            <div class="visonet center-library">
                <div class="wrap-box">
                    <div class="title">{{ $t('i18nPersonal.TabLibrary.Picture') }}</div>
                    <div class="image-mosaic">
                        <!-- <div class="card card-tall card-wide">
                            <cld-image 
                                :publicId="imageDefault" 
                                loading="lazy">
                                <cld-transformation width="auto" gravity="south" crop="fill"/>
                            </cld-image>
                        </div>
                        <div class="card card-tall">
                            <cld-image 
                                :publicId="imageDefault" 
                                loading="lazy">
                                <cld-transformation width="auto" gravity="south" crop="fill"/>
                            </cld-image>
                        </div> -->
                        <div class="card" v-for="(item, index) in listPostImage" :key="index">
                            <cld-image 
                                v-if="item.resourceType == 'image'"
                                :publicId="item.cloudinaryID" 
                                loading="lazy" @click.native="viewFullImage(item.cloudinaryID)">
                                <cld-transformation width="auto" gravity="south" crop="fill"/>
                            </cld-image>
                            <cld-video 
                                v-if="item.resourceType == 'video'"
                                :publicId="item.cloudinaryID" controls="true">
                            </cld-video>
                        </div>
                    </div>
                    <Observer @getPaging="scrollPaging"/>
                </div>
            </div>
        </div>
        <ZoomImage v-if="showZoomImage" :dataZoomImage="dataZoomImage" @exitDimmed="exitDimmed"></ZoomImage>
    </div>
</template>
<script>
import UserAPI from "@/api/UserAPI.js"
import Observer from "@/components/observer/Observer.vue"
import ZoomImage from "@/components/zoom-image/ZoomImage.vue"

export default {
    name: 'TabLibraryPersonal',
    components: {
        Observer,
        ZoomImage
    },
    data() {
        return {
            listPostImage: [],      //Danh sách chứa các object hình ảnh {postID, cloudinaryID}
            pageSize: 10,
            pageIndex: 1,
            totalPage: 0,
            showZoomImage: false,
            dataZoomImage: ""
        }
    },
    created() {
        this.getPagingImage();
    },
    methods: {
        /**
         * Gọi API phân trang lấy hình ảnh library
         */
        getPagingImage(){
            let dataFilter = {
                userID: this.$route.params.id,
                pageSize: this.pageSize,
                pageIndex: this.pageIndex
            }

            UserAPI.getImageLibrary(dataFilter).then((res) => {
                //Tạo 1 mảng chứa các object image { postID, cloudinaryID }
                let resDoc = res.data.doc;
                resDoc.forEach(element => {
                   let imageIDs = element.image;
                   imageIDs.forEach(imageID => {
                        let dataImage = {
                            postID: element._id,
                            cloudinaryID: imageID.cloudinaryID,
                            resourceType: imageID.resourceType
                        }
                        this.listPostImage.push(dataImage);
                   });
                });
                this.totalPage = res.data.totalPage;
            })
        },
        /**
         * Scroll trang - paging
         */
        scrollPaging(){
            this.pageIndex++;
            if(this.pageIndex <= this.totalPage){
                this.getPagingImage();
            }
        },
        /**
         * Click ảnh để xem chế độ toàn ảnh
         */
        viewFullImage(cloudinaryID){
            this.showZoomImage = true;
            this.dataZoomImage = cloudinaryID;
        },
        /**
         * Tắt xem phóng to ảnh
         */
        exitDimmed(){
            this.showZoomImage = false;
        }
    },
}
</script>
<style lang="scss" scoped>
.body-library-personal{
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    min-height: 400px;
    height: 100%;
    .center{
        width: 70vw;
        background-color: #ffffff;
        border-radius: 0.5rem;
        box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%);
        -webkit-transition: all 0.3s ease-in-out;
        margin-top: 10px;
        margin-bottom: 20px;
        padding: 24px;
    }
} 
.center-library{
    width: 100%;
    .wrap-box{
        .title{
            font-size: 18px;
            font-weight: 500;
        }
        .row {
            display: -ms-flexbox; /* IE10 */
            display: flex;
            -ms-flex-wrap: wrap; /* IE10 */
            flex-wrap: wrap;
            padding: 0 4px;
        }

        .image-mosaic {
            display: grid;
            gap: 1rem;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            grid-auto-rows: 240px;
            margin-top: 10px;
        }

        .card {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #353535;
            font-size: 3rem;
            color: #fff;
            box-shadow: rgba(3, 8, 20, 0.1) 0px 0.15rem 0.5rem, rgba(2, 8, 20, 0.1) 0px 0.075rem 0.175rem;
            height: 100%;
            width: 100%;
            border-radius: 4px;
            transition: all 500ms;
            overflow: hidden;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            padding: 0;
            margin: 0;
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
                cursor: pointer;
            }
            video{
                width: 100%;
                height: 100%;
                object-fit: cover;
                cursor: pointer; 
            }
        }

        @media screen and (min-width: 600px) {
            .card-tall {
                grid-row: span 2 / auto;
            }

            .card-wide {
                grid-column: span 2 / auto;
            }
        }
    }
}    
</style>