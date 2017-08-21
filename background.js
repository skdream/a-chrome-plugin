chrome.runtime.onMessage.addListener(function(request, sender, sendRequest) { // background返回的回调消息
       if (request.type === 'start-counttime-cb') {
           countdown(request);
       } else if (request.type === 'remove-countdown-cb') {
          // deleteTag();
       }
   });


var countdown =0 ;

function countdown(){

}
