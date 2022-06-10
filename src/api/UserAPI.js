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
    getNotificationAddFriend(data){
        return BaseAPIConfig.post(`${this.controller}/notification-add-friend`, data);
    }

    /**
     * Hàm lưu yêu cầu kết bạn
     * @param {*} data 
     * @returns 
     */
    createdRequestAddFriend(data){
        return BaseAPIConfig.post(`${this.controller}/request-addfriend`, data);
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
}
export default new UserAPI();