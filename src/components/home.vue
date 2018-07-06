<template>
    <div class="main">
        <h2 class="center">{{pageInfo.solgan}}</h2>
        <div class="icon-area" :class="{'free': !pageInfo.is_vip}"></div>
        <p class="center reward">{{pageInfo.giftDesc}}</p>
        <article class="center" v-html="pageInfo.ruleDesc"></article>
        <p class="coin-info center" v-html="pageInfo.lastGiftDesc"></p>
        <button class="blue-btn invite" :class="{'android': !isIos}" @click="inviteUser">{{"common_invite" | translate}}</button>
        <ul class="desc">
            <li>{{pageInfo.inviteDesc}}</li>
        </ul>
        <div class="line"></div>
        <footer>
            <div class="flex user-area" style="-webkit-overflow-scrolling: touch;">
                <div class="friend" v-for="item in pageInfo.invite_list" ng-show="pageInfo.invite_list.length != 0">
                    <img class="img" :src="item.user_img" @click="jumpUserArea(item)">
                    <button class="center" @click="noticeUser(item)" :class="{'android': !isIos}"
                            :disabled="item.show_remind == 0">{{item.remind_button}}
                    </button>
                </div>
                <div class="friend-empty" style="color: #999;line-height: 16px;">
                    {{'common_friend_list_empty' | translate}}
                </div>
            </div>
        </footer>
        <div class="flex go-pro-area" v-if="!pageInfo.is_vip">
            <a class="go-pro center" @click="goToProUrl">{{"common_GoPro" | translate}}</a>
            <i class="go-pro" @click="goProToast"></i>
        </div>

        <section class="last">
            <p class="center" style="box-sizing: border-box;padding: 0 30px;">{{"common_complete_desc" | translate}}</p>
        </section>
    </div>
</template>

<script>
    import {DY} from '../lib/lib.js';
    import sa from 'sa-sdk-javascript';
    import {Toast, Indicator} from 'mint-ui';

    const globalQuery = DY.getUrlQueryObj();

    export default {
        name: 'home',
        data() {
            return {
                isIos: DY.isiDevice,
                pageInfo: {}
            }
        },
        methods: {
            //  点击链接跳转到页面
            goToProUrl() {
                DY.sendNative(this.pageInfo.goProJson);
            },

            //  goPro 按钮点击
            goProToast() {
                Toast(this.$options.filters.translate("common_Pro_member"), 50000);
            },

            //  邀请按钮
            inviteUser() {
                let vm = this;
                sa.track('click_general_h2o', {
                    page_name: "41",
                    click_id: 63,
                    click_source_id_h2o: "",
                    click_source_url: ""
                });
                DY.sendNative(vm.pageInfo.shareJson);
            },

            //  进入用户个人空间
            jumpUserArea(user) {
                DY.sendNative(user.userJson)
            },

            //  提醒用户
            noticeUser(user) {
                Indicator.open();
                let vm = this,
                    params = {
                        sid: globalQuery.sid,
                        taid: user.uid
                    };
                vm.$http.$post('invitefriends/remind', params).then(res => {
                    Indicator.close();
                    if (res.data.error_code == 0) {
                        user.show_remind = 0;
                        sa.track('click_general_h2o', {
                            page_name: "41",
                            click_id: 64,
                            click_source_id_h2o: "",
                            click_source_url: ""
                        });
                    } else {
                        Toast(res.data.error_desc);
                    }
                })
            }
        },
        created() {
            let vm = this,
                params = {
                    sid: globalQuery.sid,
                    platform: globalQuery.platform,
                    lang: globalQuery.lang,
                    version: globalQuery.version,
                };
            vm.$http.$get('invitefriends/index', params).then(res => {
                if (res.data.error_code == 0) {
                    vm.pageInfo = res.data.result;
                    DY.setTitle(vm.pageInfo.title);
                } else {
                    Toast(res.data.error_desc);
                }
            })
        },
        mounted(){
            sa.track('pageview_general_h2o', {
                page_id: 41,
                pageinfo: ""
            })
        },
        beforeCreate(){
        	DY.setTitle(this.$options.filters.translate("common_title_invite"));
        }
    }
</script>

<style scoped>

    div.main {
        padding: 0 0.64rem;
        box-sizing: border-box;
    }

    h2 {
        font-family: Roboto-Bold;
        font-size: 24px;
        color: #333333;
        line-height: 33px;
        margin-top: 1rem;
    }

    .icon-area {
        width: 100%;
        height: 80px;
        margin-top: 1rem;
        background: url("../assets/img/vip.png") no-repeat center center;
        background-size: 80px 80px;
    }

    .icon-area.free {
        background-image: url("../assets/img/coin.png");
    }

    p.reward {
        margin-top: 0.32rem;
        font-family: Roboto-Regular;
        font-size: 16px;
        color: #666666;
        line-height: 0.8rem;
        height: 0.8rem;
        margin-bottom: 16px;
    }

    article {
        font-family: Avenir-Book;
        font-size: 14px;
        color: #999999;
        line-height: 20px;
    }

    p.coin-info {
        font-family: Roboto-Bold;
        font-size: 14px;
        color: #999999;
        margin-top: 16px;
        height: 19px;
        line-height: 19px;
    }

    p.coin-info b {
        color: #8599F3;
    }

    button.invite {
        font-family: AvenirNext-Regular;
        width: 300px;
        height: 40px;
        display: block;
        margin: 0 auto;
        font-size: 18px;
        margin-top: 24px;
    }

    button.invite.android {
        border-radius: 2px;
    }

    ul.desc {
        margin-top: 16px;
    }

    ul.desc li {
        line-height: 16px;
        margin-bottom: 16px;
        padding-left: 30px;
        background: url("../assets/img/point@3x.png") no-repeat left center;
        background-size: 15px 15px;
        font-family: Roboto-Light;
        font-size: 12px;
        color: #999999;
    }

    div.line {
        width: 100%;
        margin-top: 32px;
        border-bottom: 2px solid #f1f1f1;
    }

    footer {
        margin-top: 30px;
    }

    footer h2 {
        font-size: 14px;
        margin-bottom: 25px;
        color: #666;
    }

    div.friend {
        display: inline-block;
        width: 65px;
        margin-right: 24px;
    }

    div.friend .img {
        width: 45px;
        height: 45px;
        border-radius: 30px;
        margin: 0 auto;
        margin-bottom: 9px;
    }

    div.friend button {
        font-family: Roboto-Bold;
        font-size: 8px;
        color: #8599F3;
        padding: 2px 10px;
        border-radius: 30px;
        border: 1px solid #8599F3;
    }

    div.friend button.android {
        border-radius: 2px;
    }

    div.friend button:disabled {
        color: #C8C8C8;
        border-color: #C8C8C8;
    }

    section.last {
        margin-top: 30px;
        padding-bottom: 40px;
        line-height: 16px;
        font-family: Avenir-Book;
        font-size: 12px;
        color: #999999;
    }



    .user-area {
        width: fit-content;
        max-width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
        overflow-x: scroll;
        text-align: center;
        padding-bottom: 20px;
        overflow-y: hidden;
    }

    .user-area::-webkit-scrollbar {
        background-color:transparent;
        display: none;
    }

    div.go-pro-area {
        justify-content: center;
        align-items: center;
        margin-top: 40px;
    }

    a.go-pro {
        display: block;
        font-family: AvenirNext-Regular;
        font-size: 18px;
        padding: 0 15px;
        box-sizing: border-box;
        color: #8599F3;
        line-height: 25px;
    }

    i.go-pro {
        display: block;
        width: 25px;
        height: 25px;
        background: url("../assets/img/gifticon.png") no-repeat center center;
        background-size: cover;
    }



    @media screen and (min-width: 750px) {
        a.go-pro {
            background-position: 70% center;
        }
    }

</style>
