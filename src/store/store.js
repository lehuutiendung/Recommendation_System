import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Global
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

const store = new Vuex.Store({
    getters,
    mutations,
    state,
    actions,
});

export default store;