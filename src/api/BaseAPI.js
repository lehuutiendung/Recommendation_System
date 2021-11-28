import BaseAPIConfig from '@/api/BaseAPIConfig.js';

export default class BaseAPI {
    constructor(){ }
    /**
     * Tên controller
     */
    controller = "";

    /**
     * Hàm gọi phương thức post, lấy tất cả dữ liệu
     * @created 25/11/2021
     * @returns 
     */
    getAll(){
        return BaseAPIConfig.post(`${this.controller}/all`);
    }

    /**
     * Hàm gọi phương thức get, lấy dữ liệu theo ID
     * @created 25/11/2021
     */
    getByID(id){
        return BaseAPIConfig.get(`${this.controller}/${id}`);
    }

    /**
     * Hàm gọi phương thức delete, xóa dữ liệu theo ID
     * @created 25/11/2021
     * @param {} id 
     * @returns 
     */
    deleteByID(id){
        return BaseAPIConfig.delete(`${this.controller}/${id}`);
    }

    /**
     * Hàm gọi phương thức post, lưu dữ liệu
     * @param {} data 
     * @returns 
     */
    save(data){
        return BaseAPIConfig.post(`${this.controller}`, data);
    }
}