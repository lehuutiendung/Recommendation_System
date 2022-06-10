import RecommendAPIConfig from '@/api/RecommendAPIConfig.js';

class RecommendAPI {
    constructor(){ }
    /**
     * 
     * @returns
     */
     getRecommendPost(userID){
        return RecommendAPIConfig.post(`recommends/recommend-post`, userID);
    }

}
export default new RecommendAPI();