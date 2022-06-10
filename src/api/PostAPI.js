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

    /**
     * Tương tác với bài viết (like, love, haha, wow, sad, angry)
     * @param {*} data {
                        "postID": "628862c2157d7d9be11cc5dd",
                        "owner": "62886210157d7d9be11cc5c3",
                        "reactType": 3, (1-LIKE, 2-LOVE, 3-HAHA, 4-WOW, 5-SAD, 6-ANGRY) 
                        "state": 3 (1 - INSERT, 2 - UPDATE, 3- DELETE)
                       }
     */
    interactivePost(data){
        return BaseAPIConfig.post(`${this.controller}/post-react`, data)
    }
}
export default new PostAPI();