$(function() {
    var selfUsername
    var socket = io.connect("http://localhost:3000")
    var currentRoomName = 'main' //Default room is main

    $('#room-title').text(currentRoomName)

    $('#send-message').click(function() {
        var messageContent = $('#message-text').val()

        console.log(`New message has been published: ${messageContent}`)

        socket.emit('publish-message', { messageContent })

        $('#message-text').val('')
    })

    socket.on('publish-message', messageData => {
        console.log(messageData)
        
        $('#chat-window').append(`${messageData.username}: ${messageData.messageContent}<br>`)
    })

    socket.emit('fetch-message-history')

    socket.on('message-history', messageHistory => {
        $('#chat-window').empty()

        messageHistory.forEach(messageData => {
            $('#chat-window').append(`${messageData.username}: ${messageData.messageContent}<br>`)
        })
    })

    socket.on('self-username', usernameData => {
        console.log(usernameData)

        selfUsername = usernameData.username
    })

    // socket.on('new-user', userData => {
    //     console.log(userData)
    //     console.log(selfUsername)
    //     console.log(123)
    //     if(userData.username !== selfUsername) {
    //         console.log(123)
    //         $('#user-list').append('<li class="list-group-item">' + userData.username + '</li>')
    //     }
    // })

    socket.emit('fetch-current-users')

    socket.on('current-usernames', usersData => {
        $('#user-list').empty()

        usersData.usernames.forEach(val => {
            if(val !== selfUsername) {
                $('#user-list').append('<li class="list-group-item">' + val + '</li>')
            }
        })
    })

    window.addEventListener("beforeunload", function(e){
        socket.emit('leaving')
    }, false)

    // $('#user-list').selectable()
    
    $('#user-list').on('click', 'li.list-group-item', function() {
        if($('.list-group-item.ui-selected').length) {
            $('#send-private-msg').show()
        }
        else {
            $('#send-private-msg').hide()
        }
    })

    $("#user-list").bind("mousedown", function(e) {
        e.metaKey = true;
    }).selectable()

    $('#send-private-msg').click(function() {
        var selectedUsers = []

        $('li.ui-selected').each(function(e) {
            selectedUsers.push($(this).text())
            $(this).removeClass('ui-selected')
        })

        socket.emit('create-private-room', { users: selectedUsers })

        $('#send-private-msg').hide()
    })

    socket.on('new-message-room', roomName => {
        $('#private-rooms-list').append('<li class="list-group-item removable-room" id="' + roomName + '">' + roomName + '</li>')
    })

    $('#private-rooms-list').on('click', 'li.list-group-item', function() {
        var roomName = currentRoomName = $(this).text()
        socket.emit('join-room', { roomName })

        $('#room-title').text(roomName)
        $('#leave-room-button').show()
    })

    $('#leave-room-button').click(function() {
        socket.emit('join-room', { roomName: 'main' })

        $('#room-title').text('main')

        $('#'+currentRoomName).remove()

        $(this).hide()
    })
})
