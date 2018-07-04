<template>
    <div class="resister-main">

        <div class="header" :class="{android: isAndroid}">
            <img :src="pageInfo.inviteInfo.user_img">
            <p class="name center">{{pageInfo.inviteInfo.nick_name}}</p>
            <p class="center">{{pageInfo.solgan}}</p>
        </div>

        <div class="intro" :class="{android: isAndroid}">
            <p class="block"></p>
            <h3 class="center">{{pageInfo.invitedDesc[0]}}</h3>
            <div class="desc-info">
                <p class="desc-item" v-for="(item, index) in pageInfo.invitedDesc" v-show="index != 0">{{item}}</p>
            </div>
        </div>

        <div class="account-area" :class="{android: isAndroid}">
            <h4 class="center">{{"common_register" | translate}}</h4>
            <div class="form">
                <div class="form-label" v-show="!registerSuccess">
                    <input type="text" v-model="registerCount" :placeholder="accountPlaword">
                </div>
                <div class="form-label" v-show="!registerSuccess">
                    <input type="password" v-model="registerPassword" :placeholder="passwordPlaword">
                </div>
                <p class="login-account center" v-show="registerSuccess">{{registerCount}}</p>
            </div>
            <div v-show="!registerSuccess">
                <p class="tip"></p>
                <button class="blue-btn" :disabled="!registerCount || !registerPassword" @click="createUser">{{"common_register" | translate}}</button>
            </div>
        </div>

        <div class="install-area" v-show="registerSuccess">
            <div class="app">
                <h2>To Keep Makeup Looking Fresh Take A Powder</h2>
                <img src="../assets/img/stars@2x.png">
                <p>Promotional Advertising Specialty You Ve Waited Long Enough</p>
            </div>
            <button @click="goToInstall">{{pageInfo.appInfo.installButton}}</button>
        </div>

    </div>
</template>

<script>

    import { DY } from '../lib/lib';
    import { Toast, Indicator } from 'mint-ui';

    const GLOBAL_QUERY = DY.getUrlQueryObj();


    export default {
        name: "register",
        data (){
            return {
                isAndroid: DY.isAndroid,
                registerCount: '',
                registerPassword: '',
                registerSuccess: false,
                accountPlaword: '',
                passwordPlaword: '',
                pageInfo: {
                    inviteInfo: {},
                    appInfo: {},
                    invitedDesc: []
                }
            }
        },
        methods: {
            createUser (){
                let vm = this,
                    params = {
                        email: vm.registerCount,
                        password: vm.registerPassword,
                        lang: GLOBAL_QUERY.lang || 2,
                        platform: DY.isAndroid ? 1 : 2,
                        type: DY.isAndroid ? 1 : 2,
                        version: GLOBAL_QUERY.version || "6.2.70",
                        key: GLOBAL_QUERY.key,
                        h2oH5: 'dailyyoga'
                    };

                vm.$http.$post('user/register', params).then(res => {
                    if(res.data.error_code == 0){
                        vm.registerSuccess = true;
                        sa.track('click_general_h2o', {
                            click_id: 65
                        });
                    }else{
                        Toast(res.data.error_desc);
                    }
                })
            },

            goToInstall(){
                window.location.href = this.pageInfo.appInfo[DY.isAndroid ? 'androidDownloadLink' : 'iosDownloadLink'];
            }
        },
        created (){
            let vm = this,
                params = {
                    key: GLOBAL_QUERY.key,
                    platform: DY.isAndroid ? 1 : 2,
                    lang: GLOBAL_QUERY.lang || 2,
                    version: GLOBAL_QUERY.version || "6.2.70"
                };

            Indicator.open();

            vm.$http.$get('Invitefriends/inviteIndex', params).then(res => {
                Indicator.close();
                if(res.data.error_code == 0){
                    vm.pageInfo = res.data.result;
                }else{
                    Toast(res.data.error_desc);
                }
            })
        },
        mounted (){
            this.accountPlaword = this.$options.filters.translate('common_email');
            this.passwordPlaword = this.$options.filters.translate('common_password');
        	document.documentElement.addEventListener('touchstart', function (event) {
			  if (event.touches.length > 1) {
			    event.preventDefault();
			  }
			}, false);
            sa.track('pageview_general_h2o', {
                page_id: 43
            })
        }
    }


</script>

<style scoped>

    div.header{
        position: relative;
        width: 90%;
        max-width: 343px;
        height: 151px;
        margin: 0 auto;
        margin-top: 54px;
        background-image: url("../assets/img/background@2x.png");
        background-size: cover;
    }
    div.header img{
        position: absolute;
        top: -30px;
        left: 50%;
        margin-left: -30px;
        box-sizing: border-box;
        width: 60px;
        height: 60px;
        border: 4px solid #fff;
        border-radius: 30px;
    }
    div.header p{
        font-size: 14px;
        color: #FFFFFF;
        font-family:  AvenirNext-Regular;
        margin: 0 22px;
        line-height: 20px;
    }
    div.header p.name{
        padding-top: 40px;
        font-family: AvenirNext-DemiBold;
        margin-bottom: 24px;
    }
    div.header.android p{
        font-family: Roboto-Regular;
    }
    div.header.android p.name{
        font-family: Roboto-Bold;
    }

    div.intro{
        padding: 0 35px;
        margin-top: 42px;
    }
    div.intro p.block{
        width: 30px;
        height: 6px;
        background: #8599F3;
        margin: 0 auto;
    }
    div.intro h3{
        font-family: AvenirNext-DemiBold;
        font-size: 12px;
        color: #666666;
        margin: 17px 0 22px 0;
    }
    p.desc-item{
        width: 100%;
        box-sizing: border-box;
        font-family: Avenir-Book;
        font-size: 12px;
        color: #999999;
        line-height: 16px;
        margin-bottom: 16px;
        padding-left: 30px;
        background: url("../assets/img/point@3x.png") no-repeat 3px center;
        background-size: 12px 12px;
        word-break: break-word;
        word-wrap: break-word;
        overflow: hidden;
    }
    div.intro.android h3{
        font-family: Roboto-Bold;
    }
    div.intro.android p.desc-item{
        font-family: Roboto-Regular;
    }

    div.account-area{
        margin-top: 42px;
        font-family: AvenirNext-DemiBold;
        font-size: 14px;
        color: #8599F3;
        padding: 0 24px 160px 24px;
    }
    div.account-area p.or{
        margin: 24px 0;
        font-family: Avenir-Book;
        font-size: 14px;
        color: rgba(0,0,0,0.38);
    }
    div.account-area button{
        width: 100%;
        height: 44px;
        border-radius: 22px;
        font-family: Avenir-Book;
        font-size: 16px;
        color: #FFFFFF;
        background: #8599F3;
    }
    div.account-area button.blue-btn:disabled{
        background: #C8C8C8;
        border: none;
    }
    div.form-label{
        padding-top: 16px;
    }
    div.form-label input{
        display: block;
        width: 100%;
        border: none;
        outline: none;
        border-bottom: 2px solid #8599F3;
        height: 24px;
        line-height: 24px;
        font-family: Avenir-Book;
        font-size: 14px;
        color: #666666;
        border-radius: 0px;
    }
    p.tip{
        font-family: Avenir-Book;
        font-size: 12px;
        color: #F55F51;
        height: 26px;
        line-height: 26px;
    }
    div.account-area button.facebook-btn{
        color: #526BC0;
        border: 1px solid #526BC0;
        background: url("../assets/img/facebook@2x.png") no-repeat 25px center;
        background-size: 25px 25px;
    }
    div.account-area button.facebook-btn.google{
        margin-top: 16px;
        background-image: url("../assets/img/google@2x.png");
    }

    div.account-area.android{
        font-family: Roboto-Bold;
    }
    div.account-area.android button.blue-btn{
        font-family: Roboto-Regular;
    }
    div.account-area.android div.form-label input{
        font-family: Roboto-Regular;
    }
    div.account-area.android p.or{
        font-family: Roboto-Regular;
    }
    div.account-area.android button{
        border-radius: 0px;
    }

    div.install-area{
        position: fixed;
        background: #fafafa;
        bottom: 0;
        width: 100%;
        z-index: 10;
    }
    div.install-area .app{
        height: 104px;
        padding-left: 78px;
        background: url("../assets/img/logo@2x.png") no-repeat 16px 16px;
        background-size: 48px 48px;
    }
    div.install-area .app h2{
        padding: 16px 16px 0 0;
        font-family: AvenirNext-DemiBold;
        font-size: 16px;
        line-height: 18px;
        color: #333333;
    }
    div.install-area .app img{
        width: 60px;
        height: 8px;
    }
    div.install-area .app p{
        margin-top: 5px;
        font-family: Avenir-Book;
        font-size: 10px;
        color: #999999;
        line-height: 14px;
        padding-right: 16px;
    }
    div.install-area button{
        width: 100%;
        height: 44px;
        background: #8599F3;
        color: #fff;
        font-family: Avenir-Book;
        font-size: 14px;
    }

    p.login-account{
        font-family: Avenir-Book;
        font-size: 18px;
        color: #666666;
        height: 24px;
        line-height: 24px;
        margin: 40px 0 70px 0;
    }
</style>
