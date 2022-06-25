import BaseAPIConfigNotAuth from '@/api/BaseAPIConfigNotAuth.js';
class EmailAPI{
    constructor(){
        this.controller = "emails";
    }
    //Gửi email yêu cầu lấy lại mật khẩu
    sendEmailForgetPass(data){
        return BaseAPIConfigNotAuth.post(`${this.controller}/forget-password`, data);
    }

    //Check tồn tại mã yêu cầu lấy lại mật khẩu
    checkExistForgetPass(data){
        return BaseAPIConfigNotAuth.post(`${this.controller}/forget-password-code`, data);
    }

    //Cập nhật mật khẩu người dùng
    updatePassword(data){
        return BaseAPIConfigNotAuth.post(`${this.controller}/update-password`, data);
    }
    
}
export default new EmailAPI();