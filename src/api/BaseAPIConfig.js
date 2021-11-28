import Axios from 'axios';
import { ConfigApiEnum } from '../models/enums/ConfigApiEnum';
import Vue from "vue"

let api = Axios.create({
    //ConfigApiEnum.URL_API: 'http://localhost:3000/api/',
    baseURL: ConfigApiEnum.URL_API,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${Vue.cookie.get('jwtToken')}`
    }
})

export default api;