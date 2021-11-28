import BaseAPI from "@/api/BaseAPI.js";

class PostAPI extends BaseAPI {
    constructor(){
        super();
        this.controller = "posts";
    }
}
export default new PostAPI();