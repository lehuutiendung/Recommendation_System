import Axios from 'axios';
import { ConfigApiEnum } from '../models/enums/ConfigApiEnum';

let api_recommend = Axios.create({
    baseURL: ConfigApiEnum.URL_API_RECOMMEND,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
})

export default api_recommend;