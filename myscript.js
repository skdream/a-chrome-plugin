

const dbName = 'rb-net-upspeed-counttime';
 const save = (value) => {
     const data = JSON.stringify(value);
     try {
         localStorage.setItem(dbName, data);
     } catch (e) {
         console.error('Your browser support localStorage', e.message);
     }
 };

 const get = (key) => {
     try {
         const data = localStorage.getItem(key);
         return JSON.parse(data);
     } catch (e) {
         console.error('Your browser support localStorage', e.message);
     }
     return null;
 };

 const clear = () => {
   localStorage.removeItem(dbName);
 }

 Date.prototype.format = function (format) {
     var o = {
         "M+": this.getMonth() + 1,
         "d+": this.getDate(),
         "h+": this.getHours(),
         "m+": this.getMinutes(),
         "s+": this.getSeconds(),
         "q+": Math.floor((this.getMonth() + 3) / 3),
         "S": this.getMilliseconds(),
         "w+": Date.getWeek(this.getDay())
     };

     if (/(y+)/.test(format)) {
         format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
     }
     for (var k in o) if (new RegExp("(" + k + ")").test(format)) {
         format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
     }
     return format;
 };


Date.getWeek = function (e) {
    this.aWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return this.aWeek[e];
};


var today = new Date().format('yyyy-MM-dd');

var lastDate = get('lastDate') || today;

save({lastDate:today});

if( new Date(lastDate) < new Date(today)){
  clear();
}





chrome.runtime.onMessage.addListener(function(request, sender, sendRequestCallback) { // background返回的回调消息
       if (request.type === 'start-apply') {
           applyspeeded();

           var address = $('#IP').val();

           sendRequestCallback({address:address,times:get('times')||0})
       }
   });



 function refresh(){
   var timenow = new Date();
   var countdown = 60*60;
   var status = get('times') ||0;
   timenow.setSeconds(timenow.getSeconds() + countdown);

   $('#clock1').countdown(timenow, function (event) {
     var timeformat = event.strftime('提速倒计时  %H:%M:%S'); //定义倒计时格式
     console.log(timeformat)

   }).on('finish.countdown', function () {

     if(status<4){
       applyspeeded();
     }
   });

 }


function reload(){

  window.location.reload();
  refresh();

}



function applyspeeded() {
	var address = $('#IP').val();
	var val = /([0-9]{1,3}\.{1}){3}[0-9]{1,3}/;
	var vald = val.exec(address);


	if (address == '') {
		alert("IP地址不能为空！");
		return false
	}
	if (vald == null) {
		alert('IP地址格式不对');
		return false;
	}
	if (vald != '') {
		if (vald[0] != address) {
			alert('IP地址格式不对');
			return false;
		}
	}

	$.ajax({
		url: /speedapply/,
		type: 'POST',
		dataType: 'json',
		data: {
			'IP_address': address
		},
		success: function (data) {
			if (data['status'] == 5) {
				//alert("ip不是办公网段！");
			} else if (data['status'] == 0) {
				//alert("第一次提速成功！");
        save({times:1});

			} else if (data['status'] == 6) {
				//alert("第一次提速失败，请联系管理员！");
         applyspeeded();
			} else if (data['status'] == 1) {
				//alert("第二次提速成功！");
        save({times:2});

			} else if (data['status'] == 7) {
				//alert("第二次提速失败，请联系管理员！");
         applyspeeded();
			} else if (data['status'] == 2) {
			//	alert("第三次提速成功！");
        save({times:3});

			} else if (data['status'] == 8) {
			//	alert("第三次提速失败，请联系管理员！");
       applyspeeded();
			} else if (data['status'] == 3) {
				//alert("第四次提速成功！");
        save({times:4});

			} else if (data['status'] == 9) {
			//	alert("第四次提速失败，请联系管理员！");
       applyspeeded();
			}

        chrome.runtime.sendMessage({ action: 'info_received' });





      reload()
		}
	});

}
