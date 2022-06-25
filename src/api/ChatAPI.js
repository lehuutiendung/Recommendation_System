import BaseAPIConfigNotAuth from '@/api/BaseAPIConfigNotAuth.js';

class ChatAPI{
    constructor(){
        this.controller = "Chats";
    }
    /**
     * Lưu hình ảnh lên cloudinary
     * @returns list cloudinaryID
     */
    saveImgToCloud(data){
        return BaseAPIConfigNotAuth.post(`${this.controller}/save-img-cloud`, data);
    }
    
    /**
     * Lấy dữ liệu tin nhắn
     * @param {*} data 
     * @returns 
     */
    pagingMessage(data){
        return BaseAPIConfigNotAuth.post(`${this.controller}/paging-message`, data);
    }
}
export default new ChatAPI();