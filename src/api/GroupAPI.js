import BaseAPI from "@/api/BaseAPI.js";
import BaseAPIConfig from '@/api/BaseAPIConfig.js';

class GroupAPI extends BaseAPI {
    constructor(){
        super();
        this.controller = "groups";
    }

    /**
     * Tham gia hội nhóm
     * @returns
     */
     joinGroup(data){
        return BaseAPIConfig.post(`${this.controller}/join-group`, data);
    }

    /**
     * Rời hội nhóm
     * @returns
     */
     outGroup(data){
        return BaseAPIConfig.post(`${this.controller}/out-group`, data);
    }
}
export default new GroupAPI();