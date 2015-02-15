window.onload = function() {

    var messages = [];
    var socket = io.connect('http://localhost:3700');
    var receiveButton = document.getElementById("receive");
    var content = document.getElementById("content");    
    var sender = getQueryStringValue("username");
    socket.emit('join' , {username: getQueryStringValue("username") });
    var receiver = "";




function getQueryStringValue (key) {
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}


receiveButton.onclick = function() {
        //if(name.value == "") {
          //  alert("Please type a name!");
        //} else {
            
            window.open("http://localhost:3700/window/?sender="+sender+"&receiver="+receiver);


       // }
    };



/*socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);

            var html = '';
            for(var i=0; i<messages.length; i++) {

                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
            if(data.receive == 'true'){
                 receiveButton.style.display = 'inline';                
            }
        } else {
            console.log("There is a problem:", data);
        }
    });*/

socket.on('receive',function(data){
        
        if(data.message) {
	    var html = '<b>' + 'Server ' + ':</b>' + data.message +'<br />';
            content.innerHTML= html;
            receiver = data.sender;
            receiveButton.style.display = 'inline';
        }
});


}


