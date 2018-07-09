<template>
    <div class="detail-main" v-cloak style="margin-top: 8px;">
        <div v-show="list.length > 0">
            <mt-loadmore :auto-fill="false" :bottom-distance="30" ref="loadmore" @bottom-status-change="handleBottomChange"
                         :bottom-method="loadList" :bottom-all-loaded="allLoaded">
                <div v-for="item in list" class="detail-info flex">
                    <div class="detail-left flex" style="overflow: hidden;">
                        <img class="img" :src="item.user_img">
                        <div class="user-item">
                            <h5>{{item.user_name}}</h5>
                            <p style="box-sizing: border-box; padding-right: 10px;height: 20px;line-height: 20px;">
                                <span>{{(item.detail_status == 1 ? 'common_experience_success' : 'common_experience_fail') | translate }}</span>
                                <b>{{item.detail_reward ? item.detail_reward : ''}}</b>
                            </p>
                        </div>
                    </div>
                    <div class="detail-right" style="font-size: 14px;min-width: 80px;font-family: Avenir-Light;">{{item.time}}</div>
                </div>
                <div slot="top" class="mint-loadmore-top">
                    <span v-show="bottomStatus !== 'loading'"></span>
                    <span v-show="bottomStatus === 'loading'">...</span>
                </div>
            </mt-loadmore>
        </div>

        <div v-show="list.length == 0 || !list" class="no-result">
            <div class="flex" style="justify-content: center;">
                <img src="../assets/img/Group@3x.png">
            </div>
            <h4>{{"common_noData" | translate}}</h4>
        </div>

    </div>



</template>

<script>
    import {Loadmore, Toast, Indicator} from 'mint-ui';
    import {DY} from '../lib/lib';

    const globalQuery = DY.getUrlQueryObj();

    export default {
        name: "detail",
        data() {
            return {
                list: [],
                allLoaded: false,
                bottomStatus: '',
                page: 1
            }
        },
        methods: {
            loadList() {

                Indicator.open();
                let vm = this,
                    params = {
                        sid: globalQuery.sid,
                        platform: globalQuery.plantform,
                        lang: globalQuery.lang,
                        version: globalQuery.version,
                        size: 20,
                        page: vm.page
                    };

                vm.$http.$get('invitefriends/records', params).then(res => {
                    Indicator.close();
                    if(res.data.error_code == 0){
                        vm.list = vm.list.concat(res.data.result);
                        if (res.data.result.length < 20) {
                            vm.allLoaded = true;
                        }
                        vm.page++;
                        vm.$refs.loadmore.onBottomLoaded();
                    }else{
                        Toast(res.data.error_desc);
                    }
                });
            },
            handleBottomChange (status){
               this.bottomStatus = status;
            }
        },
        created (){
            this.loadList();
        }
    }
</script>

<style scoped>

    div.detail-info {
        background: #fff;
        border-bottom: 1px solid #f1f1f1;
        height: 66px;
        padding: 0 16px;
        box-sizing: border-box;
        justify-content: space-between;
    }
    div.user-item{
        max-width: 80%;
    }
    div.detail-left .img {
        width: 44px;
        height: 44px;
        border-radius: 30px;
        margin-right: 8px;
        box-sizing: border-box;
    }
    div.user-item p{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
    }
    div.user-item h5 {
        font-family: Avenir-Book;
        font-size: 16px;
        box-sizing: border-box;
        color: #333333;
        height: 22px;
        line-height: 22px;
        margin-bottom: 6px;
    }

    div.user-item p span {
        font-family: Avenir-Light;
        font-size: 12px;
        color: #333333;
        box-sizing: border-box;
    }

    div.user-item p b {
        font-family: Avenir-Light;
        font-size: 12px;
        color: #999999;
        padding: 0 20px 0 6px;
        box-sizing: border-box;
    }

    div.no-result{
        padding-top: 44px;
    }
    div.no-result img{
        width: 150px;
        height: 150px;
        margin-bottom: 8px;
    }
    div.no-result h4{
        font-family: Avenir-Book;
        font-size: 16px;
        color: #999999;
        text-align: center;
    }
</style>
