import Axios from 'axios';
import { ConfigApiEnum } from '../models/enums/ConfigApiEnum';

let api_not_auth = Axios.create({
    //ConfigApiEnum.URL_API: 'http://localhost:3000/api/',
    baseURL: ConfigApiEnum.URL_API,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
})

export default api_not_auth;