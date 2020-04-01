$(function() {
    var selfUsername
    var socket = io.connect("http://localhost:3000")

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
        messageHistory.main.forEach(messageData => {
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

    $('#user-list').selectable()

    $('.list-group-item').click(function() {

        if($('.list-group-item.ui-selected'.length)) {
            $('#send-private-msg').show()
        }
        else {
            $('#send-private-msg').hide()
        }
    }).click()

    $( "#user-list" ).bind( "mousedown", function ( e ) {
        e.metaKey = true;
    } ).selectable();
})
