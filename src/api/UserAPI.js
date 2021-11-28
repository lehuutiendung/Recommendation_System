import BaseAPI from "@/api/BaseAPI.js";

class UserAPI extends BaseAPI{
    constructor(){
        super();
        this.controller = "Users";
    }
}
export default new UserAPI();