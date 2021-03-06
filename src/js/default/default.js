/**
 * @Desc 项目默认页面
 * @Date 2018-09-18 08:38:17
 * @Author qitian
 */
'use strict';
$(function(){
    let activeLi = sessionStorage.getItem('nav-page');
    if(activeLi){
        let activeList = activeLi.split('-');
        if(activeList.length > 1){
            setTimeout(function(){
                $('.sider-nav').find('li[name="'+activeList[0]+'"]').find('.dropdown-submenu').css('display','block');
             })
        }
        let $li = $('.sider-nav').find('li[name="'+activeLi+'"]');
        loadPage(activeLi);
        $li.addClass('active');
    }else{
        loadPage('index');
    }
})