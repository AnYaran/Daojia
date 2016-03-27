/**
 * Created by Yaran Ann on 2015/7/14 0014.
 */

function loaded() {
    // 页面加载完 移除loading
    $('#loading').remove();
}

var myScroll_0;
function initIScroll(){
    // 初始化iScroll
    myScroll_0 = new IScroll('#wrapper',{
         probeType: 2,
         mouseWheel: true,
         tap: true,
         preventDefault: false,
         preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ }
     });

    myScroll_0.on('scroll',function(){
        $("#wrapper").trigger('scroll');//iscroller和loadlazy.js图片缓冲完毕后不能及时刷新，加上这个模拟浏览器被滑动，那么图片就可以刷新了
        myScroll_0.refresh();
    });

 //   document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
}
window.addEventListener('load', function() {initIScroll();$.gohn._goTopShow();}, false);
(function($){
    /*
    * 验证正则
    * */
    $.utils = {
        _regPhone: function(value) {
            return /^13[0-9]{9}$|^15[0-9]{9}$|^18[0-9]{9}$/.test(value);
        },
        _isEmail: function(value) {
            return /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/.test(value);
        },
        _minlength: function( value, param ) {
            var length = value.length;
            return length >= param;
        },
        _maxlength: function( value, param ) {
            var length = value.length;
            return length <= param;
        },
        _regNumber: function(value) {
            return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
        }
    }
}(jQuery));
(function($){
    $.gohn = {
        /*
        * 二级菜单
        * */
        _submenu: function(){
            $('.bar-tab .has-submenu > a').on('click',function(e){
                e.stopPropagation();
                e.preventDefault();
                var $this = $(this);
                if ($this.parent().hasClass('open')) {
                    $this.parent().removeClass('open');
                } else {
                    $this.parent().addClass('open').siblings('.tab-item').removeClass('open');
                }
            });
            $('body,html').on('click',function(){
                $('.bar-tab .has-submenu').removeClass('open');
            });
        },
        /*
         * 提示信息
         * */
        _showTip: function(tipTxt){
            var div = document.createElement('div');
            div.innerHTML = '<div class="error-tip">'+tipTxt+'</div>';
            var tipNode = div.firstChild;
            $("body").after(tipNode);
            setTimeout(function(){
                $(tipNode).remove();
            }, 1500);
        },
        _showTip1: function(tipTxt){
            var div = document.createElement('div');
            div.innerHTML = '<div class="error-tip">'+tipTxt+'</div>';
            var tipNode = div.firstChild;
            $("body").after(tipNode);
        },
        /*
        * 表单提交结果
        * */
        _showPrompt: function(state,msg){
            var div = document.createElement('div');
            div.innerHTML = '<div class="prompt prompt-'+state+'">'+msg+'</div>';
            var tipNode = div.firstChild;
            $("#myForm").append(tipNode);
        },
        /*
        * 回到顶部
        * */
        _goTopShow: function(){
            var $goTop = $('#gotop');
            var win_scroll = myScroll_0 || scroller1.myScroll;
            win_scroll.on('scroll',function(){
                if ( win_scroll.y < -300 ) {
                    $goTop.fadeIn();
                    $goTop.on('click',function(e){
                        e.preventDefault();
                        win_scroll.scrollTo(0, 0);
                        $goTop.fadeOut();
                    });
                } else {
                    $goTop.fadeOut();
                }
            });
        },
        /*
        * 筛选
        * */
        _filterBar: function(){
            $('#J_fiterBar li.droplist-trigger').on('click',function(){
               var _this = $(this)
                   ,_droplistId = _this.data('target');
                $(_droplistId).siblings('.droplist').removeClass('droplist-expand');
                $(_droplistId).toggleClass('droplist-expand');
                $(_droplistId).find('li').on('click',function(){
                    var _that = $(this);
                    _this.find('span').html(_that.html());
                    _this.addClass('active');
                    $('.droplist').removeClass('droplist-expand');
                    $('#J_droplistMask').hide();
                });
                if ($(_droplistId).hasClass('droplist-expand')) {
                    $('#J_droplistMask').show();
                } else {
                    $('#J_droplistMask').hide();
                }
            });
            $('#J_droplistMask').on('click',function(){
                $('.droplist').removeClass('droplist-expand');
                $(this).hide();
            });
        },
        /*
        * 加入收藏
        * */
        _addFavorites: function(obj,proId){
            if ($(obj).hasClass('active')) return false;
            // ajax 收藏
            $.ajax({
                method: "POST",
                url: "../assets/ajax/data-favorites.json",
                data: {proId:proId},
                dataType: "json"
            }).done(function(data){
                $(obj).addClass('active');
                $(obj).find('span').html('已收藏');
                $.gohn._showTip('收藏成功');
            }).fail(function(data){
                $.gohn._showTip('收藏失败');
            });
        }
    }
}(jQuery));

$(function(){
    $.gohn._submenu();
});

/*
 * 提示框
 * state:fail,success,loading,network
 * */
function showToast(state,txt){
    $('.toast').remove();
    $('body').append('<div class="toast"><div class="toast-text"><span class="toast-icon-'+state+'"></span>'+txt+'</div></div>');
    setTimeout(function(){
        $('.toast').fadeOut(function(){
            $(this).remove();
        });
    },1000);
}

var AYR = {};
AYR.Util = {
    isMobile: function(v) {
        return /^[0]?[1][0-9]{10}$/.test(v);
    },
    isYYYYMMDD: function(v) {
        return /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(v);
    }
};

var HS = HS || {};
;(function($){
    HS.Favorites = {
        _toggle: function(e,proId){
            var _this = e.currentTarget;
            if ($(_this).hasClass('active')){
                HS.Favorites._cancel(e,proId);
            } else {
                HS.Favorites._add(e,proId);
            }}
        ,
        _add: function(e,proId){ //加入收藏
            var _this = e.currentTarget;
            $.ajax({
                method: "POST",
                url: "../assets/ajax/data-favorites.json",
                data: {proId:proId},
                dataType: "json"
            }).done(function(data){
                $(_this).addClass('active');
                $(_this).html('已收藏');
                showToast('success','收藏成功');
            }).fail(function(data){
                showToast('fail','收藏失败');
            });
        },
        _cancel: function(e,proId){ // 取消收藏
            var _this = e.currentTarget;
            $.ajax({
                method: "POST",
                url: "../assets/ajax/data-favorites.json",
                data: {proId:proId},
                dataType: "json"
            }).done(function(data){
                $(_this).removeClass('active');
                $(_this).html('+收藏');
                showToast('success','取消收藏');
            }).fail(function(data){
                showToast('fail','取消失败');
            });
        }
    };
}(jQuery));
