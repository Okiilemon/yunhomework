var EDU = (function(){
    //----------   Begin Module Scope Variables  ------------
        
    var len_of_coursePages; //课程列表总页数
    var current_course_type;
    var current_page_index;

    //----------   End Module Scope Variables  --------------

    //----------   Begin DOM Method  ------------------------

    var prompt_bar = document.querySelector('.prompt-bar');
    var no_more_btn = document.querySelector('.no-more-prompt');  
    var submit_btn = document.querySelector('#submit-btn');
    var follow_btn = document.querySelector('.follow-btn');
    var login_area = document.querySelector('.login-area');
    var cancel_follow_btn = document.querySelector('.cancel-follow-btn-area');
    var num_of_fans_area = document.querySelector('.num-of-fans');   
    var usernameInput = document.querySelector('#account');
    var pwdInput = document.querySelector('#pwd');
    var carouselImage = document.querySelector('.carousel-item img');
    var carouselImageWrapper = document.querySelector('.carousel-area');
    var carousel_images = document.querySelectorAll('.carousel-item img');
    var carousel_area = document.querySelector('.carousel-area');
    var carousel_indicator_area = document.querySelector('.carousel-indicators');
    var carousel_indicators = carousel_indicator_area.querySelectorAll('li');  
    var tab_product = document.querySelector('.product-design');
    var tab_program = document.querySelector('.programming-language');  

               

    //----------   End DOM Method  --------------------------

    //----------   Begin Utilty Method (工具函数) -------------

    function addClass(ele,toBeAddedClass){ //新添加的类以一个字符串的方式给出 'aa bb cc'
        var toBeAddClassInArr = [];
        toBeAddClassInArr = toBeAddedClass.split(' ');
        var originalClass = ele.className;
        var lenOfNewClass = toBeAddClassInArr.length;
        var classItems = [];
        if(lenOfNewClass < 0) return;
        for(var i=0; i<lenOfNewClass; i++){ //过滤输入，以防class之间多余的空格
            if(toBeAddClassInArr[i].length){
                classItems.push(toBeAddClassInArr[i]);
            }
        }
        if(!originalClass.length){ //判断是否本来就有class属性，如果没有
            newClass = classItems.join(' ');
            ele.setAttribute('class',newClass);
            return;
        }
        else { //如果原本是有class属性的
            var reg = [];
            var newClassInArr = [];
            var realLen = classItems.length;
            for(var j=0; j<len; j++){
                reg[j] = new RegExp('\\s' + classItems[j] + '\\s'); //前后加空格是为了完全匹配，避免包含的情况
                //判断待添加的类是否本来就存在,如果不存在就放进数组中
                if(!reg[j].test(' ' + originalClass + ' ')) { //这里前后加空格是为了避免这个词出现在两个端点的情况
                    newClassInArr.push(classItems[j]);
                }
            }
            if(newClassInArr) {
                newClass = newClassInArr.join(' ');
                ele.className += ' ' + newClass;
            }
            return;
        }
    }

    function removeClass(ele){
        var originalClass = ele.className;
        if(!originalClass.length)
            return;
        else {
            var lenOfClassItems = arguments.length - 1;
            if(lenOfClassItems < 0) return;
            var classItems = [];
            var reg = [];
            originalClass = ' ' + originalClass + ' ';
            for(var i=1; i<=lenOfClassItems; i++){
                reg[i] = new RegExp('\\s' + arguments[i] + '\\s');
                originalClass = originalClass.replace(reg[i],'');
            }
            ele.className = originalClass;
            return;
        }
    }

    /* 
      *轮播图高宽自适应，动态获取自适应后的高度，
      *用这个高度渲染轮播图的容器，否则高度不匹配会影响下面的相邻元素 
    */

    var carouselImageAutoFit = function(){
        var rightHeight = window.getComputedStyle(carouselImage,null).getPropertyValue('height');
        carouselImageWrapper.style.height = rightHeight;
    };

    //获取当前处于active状态的item
    var getCurrentIndex = function(items){
        var currentIndex,
            i,
            len = items.length;
        for(i=0; i<len; i++){
            if(/active/.test(items[i].className)){
                currentIndex = i;
                break;
            }
        }
        return currentIndex;
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

    /*
      * 封装Ajax方法
      * 参数说明：
      * 第一个参数url即是请求的地址
      * 第二个参数是一个对象，
      * 其中可以包括的参数为：
            type: post或者get，默认值是GET
            data: 发送的数据，为一个键值对象或者为一个用&连接的赋值字符串
            onsuccess: 成功时的调用函数
            onfail: 失败时的调用函数
    */
    var ajax = function(url,options){
        var xhr = new XMLHttpRequest();
        var method,queryString='',requestURL = url;//requestURL是供GET方法时使用
        var keyValuePairs = [];
        var i,lenOfKeyvaluepairs;

        requestURL += (requestURL.indexOf('?') == -1 ? '?' : '&');
        method = options.type ? options.type : 'get';

        //处理传入的参数，编码并拼接
        if(options.data){
            if(typeof options.data == 'string'){
                queryString = options.data;
                requestURL += queryString;
            }
            else {
                for(var p in options.data){
                    if(options.data.hasOwnProperty(p)){
                        var key = encodeURIComponent(p);
                        var value = encodeURIComponent(options.data[p]);
                        keyValuePairs.push(key + '=' + value);
                    }
                }
                lenOfKeyvaluepairs = keyValuePairs.length;
                queryString = keyValuePairs.join('&');
                requestURL += queryString;       
            }        
        }

        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if((xhr.status >= 200 && xhr.status <300) || xhr.status == 304){
                    options.onsuccess(xhr);
                }  
                else{
                    if(options.onfail){
                        options.onfail();
                    }
                    else{
                        alert('Sorry,your request is unsuccessful:' + xhr.statusText);
                    }
                }
            }
        };
        if(method == 'get'){
            xhr.open(method,requestURL,true);
            xhr.send(null);
        }
        else{
            xhr.open(method,url,true);
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            xhr.send(queryString);
        }
    };

    /*
      * Ajax动态加载课程卡片方法
    */

    var getCourseLists = function(pageNo,psize,type){

        var ajaxOnsuccess = function(xhr){
            var courseLists = [];
            var lenOfCourseItems;
            var course_display_area = document.querySelector('.course-display-area ul');
            courseLists = JSON.parse(xhr.responseText);
            lenOfCourseItems = 20;
            var i;
            var segment = '';
            for(i=0; i<lenOfCourseItems; i++){
                segment += 
                '<li class="course-item"><img src=' + courseLists.list[i]['bigPhotoUrl'] + ' alt="">'
              + '<div class="components"><p class="course-intro">' + courseLists.list[i]['name'] + '</p>'
              + '<p class="course-tag">' + courseLists.list[i]['categoryName'] + '</p>'
              + '<div class="enroll-people-num-area"><span class="enroll-people-num">' + courseLists.list[i]['learnerCount'] + '</span></div>'
              + '<p class="course-price">¥ ' + courseLists.list[i]['price'] +'</p></li>';

            }
            course_display_area.innerHTML = segment;
            return courseLists.totalPage;
        };

        var url = 'http://study.163.com/webDev/couresByCategory.htm';
        var options = {
            data: {
                pageNo: pageNo,
                psize: psize,
                type: type
            },
            onsuccess: ajaxOnsuccess
        };
        len_of_coursePages = ajax(url,options);
        return len_of_coursePages; //页面载入时要根据这个总页数来生成相应个数的分页导航按钮
    };

    var control_last_Next_btn_display  = function(){
        var pageItems = document.querySelectorAll('.page-nav-btn li');
        var last_page_btn = document.querySelector('.last-page'); 
        var next_page_btn = document.querySelector('.next-page');
        var currentPageIndex = getCurrentIndex(pageItems);
        if(currentPageIndex+1 == 1){
            last_page_btn.style.display = 'none';
        } 
        else if(currentPageIndex+1 == len_of_coursePages){
            next_page_btn.style.display = 'none';
        }
        else {
            last_page_btn.style.display = "inline-block";
            next_page_btn.style.display = "inline-block";
        }

    };

    /*
      * 分页导航生成器，根据总页数生成相应数量的分页按钮
    */

    var createPageNavigator = function(totalPage,currentPageIndex){
        var page_nav_btn = document.querySelector('.page-nav-btn');
     
        var i,
            len = totalPage,
            page_nav_btn_items = '';
        for(i=0; i<len; i++){
            var pageIndexValue = i+1;
            page_nav_btn_items += '<li>' + pageIndexValue + '</li>';
        }
        page_nav_btn.innerHTML = page_nav_btn_items;
        page_nav_btn.querySelectorAll('li')[currentPageIndex-1].className = 'active';
        control_last_Next_btn_display();
    }

    //----------   End Utilty Method  ---------------------

   //----------   Begin Event Handlers  -------------------

    //首先调用轮播图自适应函数
    carouselImageAutoFit();

    //在浏览器窗口大小变化时调用轮播图自适应函数
    window.addEventListener('resize',carouselImageAutoFit,false);

    /* 根据视觉稿，每行最多显示8页，这里是为了防止总页数小于8的情况
     * getCourseLists这个函数会动态加载课程卡片，并且返回总页数
     * 所以在这里默认加载第1页，数量为20，类型为“产品设计”的课程
     */
    var totalPage = getCourseLists(1,20,10) < 8 ? getCourseLists(1,20,10) : 8; 
    createPageNavigator(totalPage,1);
    /*
      * 顶部“不再提示” 
    */
    var noMorePrompt_module = (function(){
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
        var num_of_fans = parseInt(num_of_fans_area.innerHTML);
        var reg_cookie_loginSuc = /loginSuc/;

        //关注API
        var successFollow = function(){
            var url = 'http://study.163.com/webDev/attention.htm';
            var ajaxOnsuccess = function(xhr){
                if(xhr.responseText == '1'){
                    var reg_cookie_followSuc = /followSuc/;
                    follow_btn.style.display = "none";
                    cancel_follow_btn.style.display = "inline-block";
                    num_of_fans ++;
                    num_of_fans_area.innerHTML = num_of_fans;
                    addCookieItem('followSuc','1',365);
                    alert('关注成功');
                }
                else {
                    alert('关注失败');
                }
            };
            var options = {
                onsuccess: ajaxOnsuccess
            };
            ajax(url,options);

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
        //登录验证
        submit_btn.onclick = function(){
            var username,pwd;
            var url,options,ajaxOnsuccess;
            username = usernameInput.value.trim();
            pwd = pwdInput.value.trim();
            if(!username || !pwd) {
                alert('请完整填写！');
            }
            else {
                ajaxOnsuccess = function(xhr){
                    if(xhr.responseText == '1'){
                        addCookieItem('loginSuc','1',1); // 将有效期设置为1天
                        login_area.style.display = "none";
                        successFollow();
                        alert("登录成功");
                    }
                    else {
                        alert('用户名与密码不匹配，请重新输入');
                    }
                };
                url = 'http://study.163.com/webDev/login.htm';
                options = {
                    data: {
                        userName: md5(username),
                        password: md5(pwd)
                    },
                    onsuccess: ajaxOnsuccess
                };
                ajax(url, options);
            }
        };
    })();

    /*
      * 轮播图模块
    */
    var carousel_module = (function(){
        var len = carousel_indicators.length; 
        var initial_class_of_indicator = carousel_indicators[0].className; 
        var carousel_state = true; //记录轮播图是否处于自动播放的状态

        //初始化当前处于active状态的item与indicator,这里指定为第一个
        carousel_indicators[0].className = initial_class_of_indicator + " active";
        carousel_images[0].style.opacity = '1';
     
        var carousel = function(targetIndex,currentIndex){
            //改变指示圆点的样式
            carousel_indicators[currentIndex].className = initial_class_of_indicator;
            carousel_indicators[targetIndex].className = initial_class_of_indicator + " active";
            //改变对应图片的样式，改变透明度，达到淡入淡出的效果
            carousel_images[currentIndex].style.opacity = '0';
            carousel_images[targetIndex].style.opacity = '1';
        };

        var autoCarousel = function(){
            var currentIndex = getCurrentIndex(carousel_indicators),
                targetIndex;
            if(currentIndex == len-1){
                targetIndex = 0;
            }
            else{
                targetIndex = currentIndex + 1;
            }
            carousel(targetIndex,currentIndex);
        };

        var beginAutoCarousel = setInterval(autoCarousel,5000); //每隔500ms自动切换

        //用户手动切换，点击小圆点切换到对应的图片
        carousel_indicator_area.addEventListener('click',function(e){
            if(e.target.tagName == 'LI'){
                var targetIndex = parseInt(e.target.getAttribute('data-slide-to'));
                var currentIndex = getCurrentIndex();
                carousel(targetIndex,currentIndex);
            }
        },false);

        carousel_area.onmouseenter = function(){
            if(carousel_state){
                clearInterval(beginAutoCarousel);
                carousel_state = false;   
            }
        };

        carousel_area.onmouseleave = function(){
            if(!carousel_state){
                beginAutoCarousel = setInterval(autoCarousel,5000);
                carousel_state = true;
            }
        };
       
    })();

    /*
      * 视频播放模块
    */

    var viedoPlay = (function(){
        var video_thumbnail = document.querySelector('.video-thumbnail');
        var video_container = document.querySelector('.video-area');
        var video_close_btn = document.querySelector('.video-close-btn');
        video_thumbnail.onclick = function(){
            video_container.style.display = "block";
        };
        video_close_btn.onclick = function(){
            video_container.style.display = "none";
        };
    })();



    /*
      * Ajax动态加载最热排行模块
    */

    var getHotRankingLists = (function(){

        var ajaxOnsuccess = function(xhr){
            var hotRankingLists = [];
            var lenOfRankingItems;
            var hot_ranking_area = document.querySelector('.hot-ranking-list');

            hotRankingLists = JSON.parse(xhr.responseText);
            lenOfRankingItems = 10;
            var i;
            var segment = '';
            for(i=lenOfRankingItems-1; i>=0; i--){
                segment += 
                '<li class="hot-ranking-item"><div class="img-wrapper"><img src=' + hotRankingLists[i]['smallPhotoUrl'] + ' alt=""></div>'
              + '<h4>' + hotRankingLists[i]['name'] + '</h4>'
              + '<div class="enroll-people-num-area"><span class="enroll-people-num">' + hotRankingLists[i]['learnerCount'] + '</span></div></li>';
            }
            hot_ranking_area.innerHTML = segment;
        };

        var url = 'http://study.163.com/webDev/hotcouresByCategory.htm';
        var options = {
            onsuccess: ajaxOnsuccess
        };
        ajax(url, options);

    })();

    /*
      * 分页导航切换模块
    */

    var pageNavigatorSwitch = (function(){
        var page_nav_btn = document.querySelector('.page-nav-btn');
        page_nav_btn.addEventListener('click',function(e){
            var page_nav_btn_items = page_nav_btn.querySelectorAll('li');
            var currentIndex = getCurrentIndex(page_nav_btn_items);
            var targetIndex;

            if(e.target.tagName.toLowerCase() == 'li'){
                targetIndex = parseInt(e.target.innerHTML) - 1;
                page_nav_btn_items[targetIndex].className = 'active';
                page_nav_btn_items[currentIndex].className = '';
                control_last_Next_btn_display();
                getCourseLists(targetIndex+1,20,10);
            }
        },false);
    })();

    /*
     * tab切换
    */
    var tabSwitch = (function(){
        var currentIndexOfPages,currentIndexOfTab;

        tab_product.onclick = function(){
            getCourseLists(1,20,10);
        };
        tab_program.onclick = function(){
            getCourseLists(1,20,20);
        };
    })();
    
  //----------   End Event Handlers  --------------------


})();











