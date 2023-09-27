const socket = io('http://localhost:5000')

const form = document.getElementById('form')
const msginp = document.getElementById('input-msg')
const msgcontainer = document.querySelector(".container")

let append = (name,msg,position)=>{
    const msgelement = document.createElement('div')
    if (name==''){
        msgelement.innerText = msg;
    }
    else{
        const srn = document.createElement('div')
        const massage = document.createElement('div')
        srn.innerText = name
        srn.classList.add('name')
        massage.innerText = msg 
        msgelement.append(name)
        msgelement.append(massage)
    }
    msgelement.classList.add('massage')
    msgelement.classList.add(position)
    msgcontainer.append(msgelement)
    msgcontainer.scrollTop = msgcontainer.scrollHeight - msgcontainer.clientHeight;
}

socket.emit('new-usr-joined');

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const massage = msginp.value 
    append("you",massage,'right')
    socket.emit('send',massage)
    msginp.value = ''
})
// const name = prompt("enter your name");


socket.on('user-joined',name=>{
    append('','userjoind '+name,'center')
})
socket.on('receive',data=>{
    append(data.name, data.massage,'left')
})