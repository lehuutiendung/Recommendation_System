import BaseAPI from "@/api/BaseAPI.js";

class CommentAPI extends BaseAPI {
    constructor(){
        super();
        this.controller = "comments";
    }
}
export default new CommentAPI();