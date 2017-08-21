


//页面初始化
document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('startApply').addEventListener('click', applyspeeded);
});



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



// var bgPage = chrome.extension.getBackgroundPage();

function applyspeeded(){
  alert("申请加速")

  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, { type: 'start-apply',greeting: "hello"}, function(response) {
        console.log(response);
        document.getElementById('IP').value = response.address;
        document.getElementById('times').innerHTML = response.times;

    });
  });

  // chrome.runtime.sendMessage({ type: 'start-apply' },function(response){
  //   console.log(response);
  //   document.getElementById('IP').value = response.address;
  //   document.getElementById('times').innerHTML = response.times;
  // });


}






chrome.runtime.onMessage.addListener((message) => {

    switch (message.action) {
        case 'info_received':

          console.log('content 向 popup发送事件')
            break;

        default:
            break;
    }
});
