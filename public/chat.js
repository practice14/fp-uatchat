window.onload = function() {
        
    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    //var name = document.getElementById("name");
    //var joinButton = document.getElementById("join");
    //var loggedInUser = document.getElementById("loggedinusername");

    //alert('chat');
    
    

    var senderName = getQueryStringValue("sender");
    var receiverName = getQueryStringValue("receiver");
    
    socket.emit('chatInitiated' , {sender: senderName , receiver: receiverName }); 

       
function getQueryStringValue (key) {
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}


    
socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            
            var html = '';
            for(var i=0; i<messages.length; i++) {
                
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });

    
 
        
 
   sendButton.onclick = function() {

        
        //if(name.value == "") {
          //  alert("Please type a name!");
        //} else {
            var text = field.value;
            socket.emit('send', { message: text, sender:senderName, receiver: receiverName });
            field.value = "";
       // }
    };


   /* joinButton.onclick = function() {
        
        if(loggedInUser.value == ""){
          alert("Please type your name!");
        } else {            
            socket.emit('join' , {username: loggedInUser.value });
        }


    };*/


}
