window.onload = function(){

    /* 
      *轮播图高宽自适应，动态获取自适应后的高度，
      *用这个高度渲染轮播图的容器，否则高度不匹配会影响下面的相邻元素 
    */
    var carouselImage = document.querySelector('.carousel-item img');
    var carouselImageWrapper = document.querySelector('.carousel-area');
    var rightHeight = window.getComputedStyle(carouselImage,null).getPropertyValue('height');
    carouselImageWrapper.style.height = rightHeight;

};

/*
  *方便操作Cookie的三个工具函数
*/

// 新添加一个Cookie
var addCookieItem = function(name,value,expire){ // expire的单位为天
    var today = new Date();
    today.setDate(today.getDate() + expire);
    document.cookie = name + "=" + value + "; expires=" + today.toGMTString();
};
//通过Cookie的名获取相应的值
var getCookieItem = function(name){
    var matchItem = document.cookie.match(new RegExp(name + '=(\\w+)'));
    if(matchItem){
        return matchItem[1];
    }
};
//更改某个Cookie的值
var setCookieItem = function(name,newValue,expire){
    addCookieItem(name,newValue,expire);
};

console.log(getCookieItem('loginSuc'));

/*
  * 顶部“不再提示” 
*/
var noMorePrompt_module = (function(){
    var prompt_bar = document.querySelector('.prompt-bar');
    var no_more_btn = document.querySelector('.no-more-prompt');
    var reg_cookie_noMore = /no_more_prompt/;
    if(reg_cookie_noMore.test(document.cookie)){
        prompt_bar.style.display = "none";
    }
    no_more_btn.onclick = function(){  
        addCookieItem('no_more_prompt','1',365);     
        prompt_bar.style.marginTop = "-36px";
    };
})();

/*
  * 关注与登录模块
*/
var follow_login_module = (function(){
    var submit_btn = document.querySelector('#submit-btn');
    var follow_btn = document.querySelector('.follow-btn');
    var login_area = document.querySelector('.login-area');
    var cancel_follow_btn = document.querySelector('.cancel-follow-btn-area');
    var num_of_fans_area = document.querySelector('.num-of-fans');
    var num_of_fans = parseInt(num_of_fans_area.innerHTML);
    var reg_cookie_loginSuc = /loginSuc/;

    //关注成功API
    var successFollow = function(){
        var reg_cookie_followSuc = /followSuc/;
        follow_btn.style.display = "none";
        cancel_follow_btn.style.display = "inline-block";
        num_of_fans ++;
        num_of_fans_area.innerHTML = num_of_fans;
        addCookieItem('followSuc','1',365);
    };
    follow_btn.onclick = function(){
        //判断是否已经登录
        if(reg_cookie_loginSuc.test(document.cookie)){
           successFollow(); 
        }
        else {
            login_area.style.display = "block";
        }
    };
    cancel_follow_btn.onclick = function(){
        this.style.display = "none";
        follow_btn.style.display = "inline-block";
        num_of_fans --;
        num_of_fans_area.innerHTML = num_of_fans;
        setCookieItem('followSuc','0',365);
    };
    submit_btn.onclick = function(){
        addCookieItem('loginSuc','1',1); // 将有效期设置为1天
        login_area.style.display = "none";
        successFollow();
    };
})();

/*
  * 轮播图模块
*/
var carousel_module = (function(){
    var carousel_images = document.querySelectorAll('.carousel-item img');
    var carousel_area = document.querySelector('.carousel-area');
    var carousel_indicator_area = document.querySelector('.carousel-indicators');
    var carousel_indicators = carousel_indicator_area.querySelectorAll('li');
    var len = carousel_indicators.length; 
    var initial_class_of_indicator = carousel_indicators[0].className; 
    var carousel_state = true; //记录轮播图是否处于自动播放的状态

    //初始化当前处于active状态的item与indicator,这里指定为第一个
    carousel_indicators[0].className = initial_class_of_indicator + " active";
    carousel_images[0].style.opacity = '1';
 
    //获取当前处于active状态的索引
    var getCurrentIndex = function(){
        var currentIndex,i;
        for(i=0; i<len; i++){
            if(/active/.test(carousel_indicators[i].className)){
                currentIndex = i;
                break;
            }
        }
        return currentIndex;
    }; 

    var carousel = function(targetIndex,currentIndex){
        //改变指示圆点的样式
        carousel_indicators[currentIndex].className = initial_class_of_indicator;
        carousel_indicators[targetIndex].className = initial_class_of_indicator + " active";
        //改变对应图片的样式，改变透明度，达到淡入淡出的效果
        carousel_images[currentIndex].style.opacity = '0';
        carousel_images[targetIndex].style.opacity = '1';
    };

    var autoCarousel = function(){
        var currentIndex = getCurrentIndex(),
            targetIndex;
        if(currentIndex == len-1){
            targetIndex = 0;
        }
        else{
            targetIndex = currentIndex + 1;
        }
        carousel(targetIndex,currentIndex);
    };

    var beginAutoCarousel = setInterval(autoCarousel,500); //每隔500ms自动切换

    //用户手动切换，点击小圆点切换到对应的图片
    carousel_indicator_area.addEventListener('click',function(e){
        if(e.target.tagName == 'LI'){
            var targetIndex = parseInt(e.target.getAttribute('data-slide-to'));
            var currentIndex = getCurrentIndex();
            carousel(targetIndex,currentIndex);
        }
    },false);

    carousel_area.onmouseover = function(){
        if(carousel_state){
            clearInterval(beginAutoCarousel);
            carousel_state = false;   
        }
    };

    carousel_area.onmouseout = function(){
        if(!carousel_state){
            beginAutoCarousel = setInterval(autoCarousel,500);
            carousel_state = true;
        }
    };
   
})();









