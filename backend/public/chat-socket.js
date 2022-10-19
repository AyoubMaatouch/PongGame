var socket = io('http://10.11.10.3:3001/dm');
const message = document.getElementById("message");
const messages = document.getElementById("messages");

 
const newMessage = () => 
{
	console.log('msg value ', message.value)
	socket.emit('msgToServer', {data: message.value});
}


socket.on('msgToClient',({data}) => {
	console.log(data);
})