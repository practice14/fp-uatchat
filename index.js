var express = require("express");
var app = express();
var port = 3700;

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){

    //var sender_id = req.params["sender"];
    //console.log(sender_id);   

    res.render("onlinepage");
});

app.get("/window",function(req,res){
   console.log('inside chat');
   res.render("page");
});

app.get("/window/chat.js",function(req,res,next){
    req.url = req.url.replace('/window','');
    console.log(req.url);
    next();
});


app.get("/join/:userid",function(req,res){
    res.type('text/plain');
    var user_id = req.params['userid'];
    var session_id = generateUUID();
    people_session[user_id] = session_id;
   
    console.log("id" + user_id);
    res.send('fp chat ' + session_id);
});




    


function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


app.use(express.static(__dirname + '/public'));

var sender_receiver_socket = {};
var socket_sender_receiver = {};
var sender_receiver_messages = {};

var people = {};
var connectsocket_user = {};
var user_connectsocket = {};

var people_messages = {};


var io = require('socket.io').listen(app.listen(port));
//var socket_server = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);
console.log("hello");

io.sockets.on('connection', function (socket) {
    //console.log('connected');
    //console.log(socket.handshake);
    //console.log(socket.handshake.query.a);
    socket.emit('message', { message: 'welcome to the chat' });
    //console.log('Helloooo');
    
    socket.on('send', function (data) { 
        console.log('inside send ' + data.sender+data.receiver);
        //console.log(people[data.username] + " - "+socket.id);
        //console.log('tESSST '+ people[data.username]);
        if(user_connectsocket[data.receiver] === null){
            console.log('receiver might have logged out');
        }
        
        if( data.sender != data.receiver && (user_connectsocket[data.receiver] != undefined || sender_receiver_socket[data.receiver+":"+data.sender]!=undefined)){
         
         var whisperMsg = data.message;
         console.log(data.message);
         socket.emit("message", {username: "You" , message : whisperMsg});
        // socket_server.sockets.socket(people[data.username]).emit("whisper", data.username, whisperMsg);
        console.log(data);
       
        
      if(sender_receiver_socket[data.receiver+":"+data.sender]===undefined){

        io.sockets.connected[user_connectsocket[data.receiver]].emit('receive',{sender: data.sender, message: 'You are getting a chat request.Click on receive to accept', receive:'true'});
        
         

         var key= data.sender+":"+data.receiver;
      if(data.sender > data.receiver){
          key = data.receiver+":"+data.sender;
      }
         if(sender_receiver_messages[key] === undefined){
            console.log('undefined condition');

            var arrMessages = [];
            arrMessages[0]= whisperMsg;
            sender_receiver_messages[key]=arrMessages;
         }
         else{
         var arrMessages = sender_receiver_messages[key];
         arrMessages[arrMessages.length] = whisperMsg;
         sender_receiver_messages[key] = arrMessages;
         }
        }
        else
        {
	  sender_receiver_socket[data.receiver+":"+data.sender].emit("message",{username:  data.sender , message : whisperMsg});

        }
         

        //io.sockets.connected[people[data.username]].emit('message',{username: sockets_people[socket.id], message: whisperMsg});
        }
    });

   function alphabetical(a,b){
    var A = a.toLowerCase();
    var B = b.toLowerCase();
    if (A < B){
        return -1;
    }else if (A > B){
       return  1;
    }else{
       return 0;
    }

   }
 

   socket.on("chatInitiated" , function(data){
       /*console.log(data.sender);
       user_connectsocket[data.sender] = socket.id;
       connectsocket_user[socket.id] = data.sender;
       console.log("chat_initiated_id " + data.sender);*/

      console.log("hello from here "+data.sender + "  "+data.receiver);
       sender_receiver_socket[data.sender+":"+data.receiver]= socket;
       socket_sender_receiver[socket] = data.sender+":"+data.receiver;
       //emit messages for this user
      var key= data.sender+":"+data.receiver;
      if(data.sender > data.receiver){
          key = data.receiver+":"+data.sender;
      } 
      
      
      var messages = sender_receiver_messages[key];
      if(messages!= undefined){
          for(i = 0;i < messages.length;i++)
          {
             socket.emit("message",{username:  data.receiver , message : messages[i]});
          }
     }
      
   });

   socket.on("ReceiveAccepted" , function(data){
       console.log(data.sender + "  "+data.receiver);
       sender_receiver_socket[data.sender+":"+data.receiver]= socket.id;
       socket_sender_receiver[socket.id] = data.sender+":"+data.receiver;
       //emit messages for this user
      var key = data.sender+":"+data.receiver;
      if(data.sender > data.receiver){
          key = data.receive+":"+data.sender;
      }
      var messages = sender_receiver_messages[key];
      for(i = 0;i < messages.length;i++)
      {
          socket.emit("message",{username:  data.receiver , message : messages[i]});
      }     

   });


    socket.on('join', function(data){    
      
        user_connectsocket[data.username] = socket.id;
        connectsocket_user[socket.id] = data.username;
        console.log("id" + user_connectsocket[data.username]);
    });
});
