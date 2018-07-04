import Vue from 'vue'
import App from './App'
import router from './router'

import $http from './lib/$http';
import mintUi from 'mint-ui';
import autoTranslate from 'auto-translate-h2o';
import sa from 'sa-sdk-javascript';
import word from './lib/word';

Vue.config.productionTip = false;
Vue.prototype.$http = $http;

import './style/reset.css'
import './style/common.css'
import 'mint-ui/lib/style.css'

Vue.use(mintUi);
Vue.use(autoTranslate, word);
//  dev.dailyyoga.com:8106/sa?project=h2o_default
sa.init({
    server_url: 'dev.dailyyoga.com:8106/sa?project=h2o_default',
});

new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
});
