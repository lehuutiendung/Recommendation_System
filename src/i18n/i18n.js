import Vue from 'vue'
import VueI18n from 'vue-i18n'
import i18nData from './i18nData'

Vue.use(VueI18n)

export default new VueI18n({
    locale: 'vi',       //Set default local
    messages: i18nData,
    silentFallbackWarn: true,
    fallbackLocale: 'vi'
})