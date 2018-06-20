let json = {
    error_code: 0,
    error_desc: '',
    data: {
        is_vip: true,               //  true 为 pro 用户      false 为 免费用户
        user_coin_last: 23,         //  当月还可获得的瑜币数
        invite_list: [{
            user_img: 'http://thirdwx.qlogo.cn/mmopen/vi_32/K4nAxc5KlpXlYodkXuO5ibp2GptPTAFe09T3k8SsVWhFYDKMWmJnhdT6Vde6aghOYvMic9ejeqJSbXmmVfym1OmA/132',           //  用户头像
            uid: 91392934,          //  用户uid
            has_invite: false       //  用户是否被邀请过
        }, {
            user_img: 'http://thirdqq.qlogo.cn/qqapp/100321251/864B942F19F908198E795BEA96646623/100',
            uid: 91392935,
            has_invite: false
        }, {
            user_img: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIuUYcwKWUuib5GnCWc7MIMZbehjM67hrgXgaiaNylEy71e3CL4PQwMcSGpggATXibho3iaou9yibALkvA/132',
            uid: 91392936,
            has_invite: true
        }, {
            user_img: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIuUYcwKWUuib5GnCWc7MIMZbehjM67hrgXgaiaNylEy71e3CL4PQwMcSGpggATXibho3iaou9yibALkvA/132',
            uid: 91392935,
            has_invite: false
        }, {
            user_img: 'http://thirdqq.qlogo.cn/qqapp/100321251/864B942F19F908198E795BEA96646623/100',
            uid: 91392935,
            has_invite: true
        }, {
            user_img: 'http://thirdqq.qlogo.cn/qqapp/100321251/864B942F19F908198E795BEA96646623/100',
            uid: 91392935,
            has_invite: false
        }, {
            user_img: 'http://thirdqq.qlogo.cn/qqapp/100321251/864B942F19F908198E795BEA96646623/100',
            uid: 91392935,
            has_invite: true
        }]
    }
};

export default json;
