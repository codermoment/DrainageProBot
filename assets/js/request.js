let messageForm = document.getElementById('chat');

let userToken = localStorage.getItem('userToken');
if (!userToken) {
    userToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('userToken', userToken);
}

messageForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var sendButton = document.getElementById("sendButton");
    sendButton.disabled = true;

    var input = document.querySelector('.chatbox__footer input').value.trim(); // Trim whitespace from the input

    if (input === "") {
        sendButton.disabled = false;
        return; // Stop further execution if the input is empty
    }

    document.querySelector('.chatbox__footer input').value = '';
    document.querySelector('.chatbox__footer input').value = '';
    let messageItems = document.querySelectorAll('.messages__item');
    let messageList = [];

    messageItems.forEach(function (item) {
        messageList.push(item.innerText);
    });
    messageList.reverse();
    // remove first item
    messageList.splice(0, 1);

    let inputMessage = document.createElement('div');
    inputMessage.className = 'messages__item messages__item--operator';
    // Add the response to the innerHTML of the new div
    inputMessage.innerHTML = input;
    // Append the new message to the chatbox__messages div
    document.querySelector('.chatbox__messages').prepend(inputMessage);

    // add animation
    var animation = document.createElement("div");
    animation.id = "typing";
    animation.innerHTML = `
    <div class="messages__item messages__item--typing">
        <span class="messages__dot"></span>
        <span class="messages__dot"></span>
        <span class="messages__dot"></span>
    </div>`;
    document.querySelector('.chatbox__messages').prepend(animation);

    // Your data to send
    let data = {
        "token": userToken,
        "input": input,
        "history": messageList,
    };

    $.ajax({
        url: 'https://drainage-pro-bot.netlify.app/.netlify/functions/api',
        type: 'POST',
        data: JSON.stringify(data),
        success: function (response) {
            // Create a new div with class messages__item and messages__item--visitor
            let newMessage = document.createElement('div');
            newMessage.className = 'messages__item messages__item--visitor';

            // Add the response to the innerHTML of the new div
            console.log("response:", response);
            newMessage.innerHTML = JSON.parse(response);
            document.querySelector('.chatbox__messages').removeChild(document.querySelector('#typing'))
            // Append the new message to the chatbox__messages div
            document.querySelector('.chatbox__messages').prepend(newMessage);
        },
        error: function (xhr, status, error) {
            console.log("Error:", xhr.status);
            let newMessage = document.createElement('div');
            newMessage.className = 'messages__item messages__item--visitor';

            // Add the response to the innerHTML of the new div
            newMessage.innerHTML = 'Sorry! Our chatbot is currently down. Please check back later, or reach out to us from our contact page.';
            document.querySelector('.chatbox__messages').removeChild(document.querySelector('#typing'))
            // Append the new message to the chatbox__messages div
            document.querySelector('.chatbox__messages').prepend(newMessage);
        }
    });
    sendButton.disabled = false;
});
