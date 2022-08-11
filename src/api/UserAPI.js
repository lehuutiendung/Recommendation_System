import BaseAPI from "@/api/BaseAPI.js";
import BaseAPIConfig from '@/api/BaseAPIConfig.js';
class UserAPI extends BaseAPI{
    constructor(){
        super();
        this.controller = "Users";
    }
    /**
     * Hàm gọi phương thức post, lọc bạn bè/lọc top bạn bè của người dùng
     * @created 29/12/2021
     * @returns
     */
    filterTopFriend(data){
        return BaseAPIConfig.post(`${this.controller}/filter-friend`, data);
    }

    /**
     * Hàm gọi phương thức post, thực hiện query ảnh lirbrary (Tab hình ảnh - người dùng)
     * @param {} data 
     */
    getImageLibrary(data){
        return BaseAPIConfig.post(`${this.controller}/image-library`, data);
    }

    /**
     * Hàm query các thông báo yêu cầu kết bạn người dùng chưa xem
     * @param {*} data: userID
     * @returns 
     */
    getNotificationNotSeen(data){
        return BaseAPIConfig.post(`${this.controller}/notification-not-seen`, data);
    }

    /**
     * Hàm lưu thông báo, yêu cầu
     * @param {*} data 
     * @returns 
     */
    saveRequestNoti(data){
        return BaseAPIConfig.post(`${this.controller}/save-request-noti`, data);
    }

    /**
     * Hàm thực hiện đồng ý yêu cầu kết bạn
     * @param {*} data 
     * @returns 
     */
    acceptFriend(id,data){
        return BaseAPIConfig.post(`${this.controller}/request-acceptfriend/${id}`, data);
    }
    /**
     * Hàm tìm kiếm, query người dùng
     * @param {*} data 
     * @returns 
     */
    filterUser(data){
        return BaseAPIConfig.post(`${this.controller}/filter-user`, data);
    }
    /**
     * Cập nhật avatar
     * @param {*} id 
     * @param {*} data 
     */
    changeAvatar(id,data){
        return BaseAPIConfig.put(`${this.controller}/avatar/${id}`, data); 
    }
    /**
     * Cập nhật avatar
     * @param {*} id 
     * @param {*} data 
     */
     changeBackground(id,data){
        return BaseAPIConfig.put(`${this.controller}/background/${id}`, data); 
    }
    /**
     * Lấy trạng thái online/offline tất cả bạn bè của người dùng
     * @param {*} data 
     * @returns 
     */
    getStatusOfFriends(data){
        return BaseAPIConfig.post(`${this.controller}/get-status-friends`, data);
    }
    /**
     * Hủy kết bạn
     */
    deleteFriend(data){
        return BaseAPIConfig.post(`${this.controller}/delete-friend`, data);
    }
    /**
     * Cập nhật trạng thái đã xem của thông báo
     * @param {*} data 
     * @returns 
     */
    updateStatusNoti(data){
        return BaseAPIConfig.post(`${this.controller}/update-status-notification`, data);
    }

    /**
     * Thiết lập - thay đổi mật khẩu
     * @param {*} data 
     * @returns 
     */
    changePasswordSetting(data){
        return BaseAPIConfig.post(`${this.controller}/change-password-setting`, data);
    }
    
}
export default new UserAPI();