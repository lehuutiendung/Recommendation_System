import BaseAPI from "@/api/BaseAPI.js";

class GroupAPI extends BaseAPI {
    constructor(){
        super();
        this.controller = "groups";
    }
}
export default new GroupAPI();