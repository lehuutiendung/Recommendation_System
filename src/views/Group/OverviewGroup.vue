<template>
  <div class="overview-group">
    <Overview>
      <template v-slot:center>
        <div class="center-group">
          <div class="group">
            <!-- Header tạo nhóm mới -->
            <div class="tab-group-title">
              <div class="text-size-24">Nhóm</div>
              <div class="flex">
                <InputIcon
                  class="mg-r-10"
                  icon="icon-search"
                  placeholder="Tìm kiếm nhóm"
                  v-model="searchValue"
                  @input.native="handleSearch" 
                  :autoFocus="true"
                />
                <ButtonText
                  :Width="120"
                  text="Tạo nhóm mới"
                  @click.native="showCreateGroup"
                />
              </div>
            </div>
            <!-- List render nhóm -->
            <div class="tab-group-render">
              <div
                class="item-group"
                v-for="(item, index) of listGroup"
                :key="index"
              >
                <div class="image-group">
                  <!-- <img :src="item.background.imageURL" alt=""> -->
                  <cld-image
                    :publicId="
                      item.background.cloudinaryID
                        ? item.background.cloudinaryID
                        : imageDefault
                    "
                    loading="lazy"
                  >
                    <cld-transformation
                      width="100"
                      gravity="south"
                      crop="fill"
                    />
                  </cld-image>
                </div>
                <div class="title-group">
                  <div class="name-group" @click="accessGroup(item)">
                    {{ item.name }}
                  </div>
                  <div class="general">{{ item.general }}</div>
                </div>
                <div class="icon-wrap">
                  <!-- <div class="icon-20 icon-joined"></div> -->
                  <ButtonIcon
                    :text="$t('i18nGroup.OverviewGroup.JoinGroup')"
                    :width="120"
                    color="light-blue"
                    :border_radius="5"
                    v-if="item.userJoined"
                    @click.native="accessGroup(item)"
                  />
                  <ButtonIcon
                    :text="$t('i18nGroup.OverviewGroup.RequestJoinGroup')"
                    :width="120"
                    color="light-blue"
                    :border_radius="5"
                    v-else
                    @click.native="requestJoinGroup(item)"
                  />
                </div>
              </div>
            </div>
            <div
              class="tab-load-more"
              @click="loadMoreGroup"
              v-if="pageIndex < totalPage"
            >
              {{ $t("i18nGroup.OverviewGroup.LoadMore") }}
            </div>
          </div>
        </div>
      </template>
      <template v-slot:right-bar>
        <div class="rightbar-group">
          <div class="sidebar-right">
            <div class="title-rightbar">
              {{ $t("i18nGroup.OverviewGroup.TitleSuggest") }}
            </div>
            <div class="suggest">
              {{ $t("i18nGroup.OverviewGroup.ContentSuggest") }}
            </div>
          </div>
        </div>
      </template>
    </Overview>
  </div>
</template>
<script>
import Overview from "@/views/Overview/Overview.vue";
import ButtonText from "@/components/buttontext/ButtonText.vue";
import ButtonIcon from "@/components/button-icon/ButtonIcon.vue";
import InputIcon from "@/components/input-icon/InputIcon.vue";
import GroupAPI from "@/api/GroupAPI.js";
export default {
  name: "OverviewGroup",
  components: {
    Overview,
    ButtonText,
    ButtonIcon,
    InputIcon,
  },
  data() {
    return {
      listGroup: [],
      pageIndex: 0, //Phân trang dữ liệu
      pageSize: 4, //Số bản ghi query trong 1 lần paging
      totalPage: 0, //Tổng số bản ghi
      searchValue: "",
      imageDefault: "Image Default/groups-default-cover-photo-2x_k8zc6f",
    };
  },
  mounted() {
    this.getPagingData();
  },
  methods: {
    // Tìm kiếm nhóm
    handleSearch(){
      let setPageIndex = 1;
      if(this.searchValue != ''){
        setPageIndex = -1;
      }else{
        this.pageIndex = 1;
      }
      let dataReq = {
        name: this.searchValue,
        pageIndex: setPageIndex,
        pageSize: this.pageSize,
        userID: this.$cookie.get("u_id"),
      };
      GroupAPI.getPaging(dataReq).then((res) => {
        this.totalPage = res.data.data.totalPage;
        //Push thêm data vào listGroup
        this.listGroup = res.data.data.doc;
      });
    },
    /**
     * Phân trang
     */
    getPagingData() {
      if (this.pageIndex > this.totalPage) {
        return;
      }
      this.pageIndex++;
      let dataReq = {
        name: this.searchValue,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        userID: this.$cookie.get("u_id"),
      };
      GroupAPI.getPaging(dataReq).then((res) => {
        this.totalPage = res.data.data.totalPage;
        //Push thêm data vào listGroup
        this.listGroup = [...this.listGroup, ...res.data.data.doc];
      });
    },
    /**
     * Load dữ liệu phân trang group
     */
    loadMoreGroup() {
      this.getPagingData();
    },
    /**
     * Chuyển hướng đến trang tạo group
     */
    showCreateGroup() {
      this.$router.push("/group/create");
    },
    /**
     * Truy cập vào group được chọn
     */
    accessGroup(data) {
      this.$router.push({
        name: "GroupDetail",
        params: { id: data._id },
      });
    },
    /**
     * Click button yêu cầu tham gia nhóm
     */
    requestJoinGroup(data){
        data.userJoined = true;
        console.log(data);
        let dataRequest = {
            groupID: data._id,
            userID: this.$cookie.get("u_id")
        }
        GroupAPI.joinGroup(dataRequest);
    }
  },
};
</script>
<style lang="scss" scoped>
.overview-group .center-group {
  width: var(--content-width);
  font-size: 14px;
  padding-right: 20px;
}
.overview-group .center-group .group {
  background-color: #ffffff;
  border-radius: 8px;
  width: 100%;
  min-height: calc(100vh - 90px);
  padding: 14px;
  display: flex;
  flex-direction: column;
}
.overview-group .center-group .group .tab-group-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overview-group .center-group .group .tab-group-render {
  width: 100%;
  margin-top: 20px;
}
.tab-group-render .item-group {
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  margin-bottom: 25px;
  padding: 10px;
  padding-left: 20px;
  background-color: #dee4ed;
  border-radius: 8px;
}
.tab-group-render .item-group .image-group {
  width: 60px;
  height: 60px;
}
.tab-group-render .item-group .image-group img {
  width: inherit;
  height: inherit;
  object-fit: cover;
  border-radius: 30px;
}
.tab-group-render .item-group .title-group {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  font-size: 15px;
  width: 70%;
}
.tab-group-render .item-group .title-group .name-group {
  font-weight: 450;
  cursor: pointer;
}
.tab-group-render .item-group .title-group .name-group:hover {
  text-decoration: underline;
}
.tab-group-render .item-group .title-group .general {
  color: #353535;
}
.tab-group-render .item-group .icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  position: absolute;
  right: 20px;
}
.tab-load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
}
.overview-group .rightbar-group {
  display: none;
  width: var(--sidebarRight-width);
  border-radius: 8px;
  height: 50vh;
  background-color: #ffffff;
  right: 8px;
  .sidebar-right {
    height: 50vh;
    padding: 14px;
    .title-rightbar {
      font-weight: 450;
      font-size: 18px;
    }
  }
}
.icon-joined {
  background-image: url("../../assets/icon/xYnteFyX4Gg.png");
  background-position: 0px -214px;
  background-size: auto;
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  display: inline-block;
  -webkit-filter: var(--filter-accent);
}
</style>
<style lang="scss">
// Đè CSS

</style>