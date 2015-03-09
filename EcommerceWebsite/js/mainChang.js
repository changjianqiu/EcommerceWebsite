window.onload = function(){
	mv.app.toTip();
	mv.app.toPhotoChange();
	mv.app.toSort();
	mv.app.toScroll();
};

var mv = {};//命名空间用于规划管理js
mv.tools = {};//对命名空间进行分层 不同的分层对应不同的功能
mv.ui = {};//组件 可以进行复用
mv.app = {};//应用

mv.tools.getByClass = function(oParent, sClass){
	var oEle = oParent.getElementsByTagName('*');
	var arr = [];
	for( var i = 0; i < oEle.length; i++){
		if(oEle[i].className == sClass){
			arr.push(oEle[i]);
		}
	}
	return arr;
}

//任意值的运动框架
mv.tools.startMove = function(obj, attr, iTarget){
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var current = 0;
		if(attr == 'opacity'){
			current = Math.round(parseFloat(mv.tools.getStyle(obj, attr))*100);//兼容chrome
		}else{
			current = parseInt(mv.tools.getStyle(obj, attr));
		}
		var speed = (iTarget - current)/6;
		speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
		if(current == iTarget){
			clearInterval(obj.timer);
		}else{
			if(attr == 'opacity'){
				obj.style.filter = 'alpha(opacity:'+(current+speed)+')';
				obj.style[attr] = (current+speed)/100;
			}
			obj.style[attr] = current + speed + 'px';
		}
	},30);
}

mv.tools.getStyle = function(obj, name){
	if(obj.currentStyle){
		return obj.currentStyle[name];
	}else{
		return getComputedStyle(obj, false)[name];
	}
}


mv.ui.textChange = function(obj, str){
	obj.onfocus = function(){
		if(this.value == str){
			this.value = '';
		}
	};
	obj.onblur = function(){
		if(this.value == ''){
			this.value = str;
		}
	};
}


//实现文本输入框的默认文字获得焦点消失，失去焦点显现
mv.app.toTip = function(){
	var oText1 = document.getElementById('text1');
	var oText2 = document.getElementById('text2');

	mv.ui.textChange(oText1, 'Search website');
	mv.ui.textChange(oText2, 'Search website');
};

//实现ad部分的图片轮播效果
mv.app.toPhotoChange = function(){
	var oAd = document.getElementById('ad');
	var aPrev = mv.tools.getByClass(oAd,'prev')[0];
	var aNext = mv.tools.getByClass(oAd,'next')[0];
	var aPrevBg = mv.tools.getByClass(oAd,'prev_bg')[0];
	var aNextBg = mv.tools.getByClass(oAd,'next_bg')[0];
	var aTextTitle = ['PRODUCT TITLE','AAAAA','BBBBB'];
	var aTextInfo = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras suscipit lacus dapibus ante mattis in adipiscing nibh placerat. Cras bibendum porta diam, non dignissim sapien malesuada vitae.','Within three months he lost more than 10 kg and exercise has played an important part in his daily routine ever since.','The figures revealed that the number of professionals who were considered overweight and had thyroid disease or osteoporosis, had increased threefold over the past five years.'];

	aPrev.onmouseover = aPrevBg.onmouseover = function(){
		mv.tools.startMove(aPrev, 'opacity', 100);
	};
	aPrev.onmouseout = aPrevBg.onmouseout = function(){
		mv.tools.startMove(aPrev, 'opacity', 0);
	};

	aNext.onmouseover = aNextBg.onmouseover = function(){
		mv.tools.startMove(aNext, 'opacity', 100);
	};
	aNext.onmouseout = aNextBg.onmouseout = function(){
		mv.tools.startMove(aNext, 'opacity', 0);
	};

	var aLi = oAd.getElementsByTagName('li');
	var aH2 = oAd.getElementsByTagName('h2')[0];
	var aP = oAd.getElementsByTagName('p')[0];
	var now = 0;
	aPrev.onclick = function(){
		now--;
		if(now == -1){
			now = aLi.length - 1;
		}
		tab();
	};
	aNext.onclick = function(){
		now++;
		if(now == aLi.length){
			now = 0;
		}
		tab();
	};

	function tab(){
		for( var i = 0; i < aLi.length; i++){
			mv.tools.startMove(aLi[i],'opacity', 0);
		}
		mv.tools.startMove(aLi[now],'opacity', 100);

		aH2.innerHTML = aTextTitle[now];
		aP.innerHTML = aTextInfo[now];
	}

	//实现图片的自动轮播
	var timer = setInterval(aNext.onclick,3000);
	oAd.onmouseover = function(){
		clearInterval(timer);
	}
	oAd.onmouseout = function(){
		timer = setInterval(aNext.onclick,3000);
	}
}

//实现content中sort的仿下拉列表的功能
mv.app.toSort = function(){
	var oSort = document.getElementById('sort');
	var aDd = oSort.getElementsByTagName('dd');
	var aUl = oSort.getElementsByTagName('ul');
	var aH2 = oSort.getElementsByTagName('h2');

	for( var i = 0; i < aDd.length; i++){
		aDd[i].index = i;
		aDd[i].onclick = function(event){
			var evt = event||window.event;
			var _this = this.index;

			for( var i = 0; i < aUl.length; i++){
				aUl[i].style.display = 'none';
			}
			aUl[this.index].style.display = 'block';
			document.onclick = function(){//由于事件冒泡的原因，导致点击文档任意位置时ul的block不出现也隐藏
				aUl[_this].style.display = 'none';
			};
			if(evt.cancelBubble){//阻止事件冒泡
				evt.cancelBubble = true;//ie
			}else{
				evt.stopPropagation();//w3c
			}
		};
	}

	for( var i = 0; i < aUl.length; i++){
		aUl[i].index = i;
		(function(ul){//使用闭包技术实现
			var aLi = ul.getElementsByTagName('li');//获取每个ul对应的li元素
			for( var i = 0; i < aLi.length; i++){
				aLi[i].onmouseover = function(){
					this.className = 'active';
				};
				aLi[i].onmouseout = function(){
					this.className = '';
				};
				aLi[i].onclick = function(event){
					var evt = event||window.event;
					aH2[ul.index].innerHTML = this.innerHTML;
					ul.style.display = 'none';//this.parentNode表示的是当前li对应的父元素ul,由于事件冒泡的原因会导致看不到效果
					if(evt.cancelBubble){//阻止事件冒泡
						evt.cancelBubble = true;//ie
					}else{
						evt.stopPropagation();//w3c
					}
				};
			}
		})(aUl[i]);//使用闭包来实现li的效果
	}

}

mv.app.toScroll = function(){
	var oScrollList = document.getElementById('scroll_list');
	var aPrev = mv.tools.getByClass(oScrollList, 'prev')[0];
	var aNext = mv.tools.getByClass(oScrollList, 'next')[0];
	var aUl = mv.tools.getByClass(oScrollList,'list_wrap')[0].getElementsByTagName('ul')[0];
	var aLi = aUl.getElementsByTagName('li');
	var current = 0;

	aUl.innerHTML += aUl.innerHTML;
	aUl.style.width = aLi[0].offsetWidth * aLi.length + 'px';

	aNext.onclick = function(){
		current++;
		if(current > aLi.length/2){
			current = 0;
		}
		mv.tools.startMove(aUl, 'left', -current*aLi[0].offsetWidth);
	};

	aPrev.onclick = function(){
		current--;
		if(current < 0){
			current = aLi.length/2;
		}
		mv.tools.startMove(aUl, 'left', -current*aLi[0].offsetWidth);
	};

	var timer = setInterval(aNext.onclick, 2000);
	mv.tools.getByClass(oScrollList,'list_wrap')[0].onmouseover = function(){
		clearInterval(timer);
	};
	mv.tools.getByClass(oScrollList,'list_wrap')[0].onmouseout = function(){
		timer = setInterval(aNext.onclick, 2000);
	};
}
