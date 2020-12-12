const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

socket.on('message', (message) => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})


// Join room
socket.emit('joinRoom', {
    username,
    room,
})

// Get rooms and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsersName(users);
});

// Message submit   
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message text to server
    socket.emit('chatMessage', msg);
    // clear input 
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    
    div.innerHTML = `	
    <div class="message">
        <p class="meta"> ${message.username} <span> ${message.time} </span></p>
        <p class="text"> ${message.text} </p>
    </div>`;

    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsersName(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}





