import BaseAPI from "@/api/BaseAPI.js";
import BaseAPIConfig from '@/api/BaseAPIConfig.js';

class PostAPI extends BaseAPI {
    constructor(){
        super();
        this.controller = "posts";
    }
    /**
     * Hàm gọi phương thức post, lấy dữ liệu phân trang trong group
     * @created 21/12/2021
     * @returns
     */
     getPagingInGroup(data){
        return BaseAPIConfig.post(`${this.controller}/paging/ingroup`, data);
    }

    /**
     * Hàm gọi phương thức post, lấy dữ liệu phân trang trên trang cá nhân
     * @returns
     */
     getPagingInWall(data){
        return BaseAPIConfig.post(`${this.controller}/paging/inwall`, data);
    }

    /**
     * Lấy bài viết mới nhất trên trang newsfeed
     * @returns
     */
     getTopInNewsfeed(data){
        return BaseAPIConfig.post(`${this.controller}/top-post`, data);
    }
}
export default new PostAPI();