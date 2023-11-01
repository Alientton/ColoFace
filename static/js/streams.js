const APP_ID = "520eaf2903ea4b109d6068c49900ece9"
const CHANNEL = sessionStorage.getItem('room')
const TOKEN = sessionStorage.getItem('token')
let UID = sessionStorage.getItem('UID')

let NAME = sessionStorage.getItem('name')

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {
    document.getElementById('room-name').innerText = CHANNEL


    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)



    try{
        await client.join(APP_ID, CHANNEL, TOKEN, UID)
    }catch(error){
        console.error(error)
        window.open('/', '_self')
    }

    // await client.join(APP_ID, CHANNEL, TOKEN, UID)

    // get user's audio and video track
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let member = await createMember()

    let player = `<div class="video-container" id="user-container-${UID}">
                <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                <div class="video-player" id="user-${UID}"></div>
                </div>`
    //It takes an HTML element with the id 'video-streams' and 
    // appends the HTML content stored in the player variable to the end of that element.
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    // In localTracks, index 0 is the audio track and index 1 is the video track
    localTracks[1].play(`user-${UID}`)

    // publish the track
    await client.publish([localTracks[0], localTracks[1]])
}

let handleUserJoined = async (user, mediaType) => {
    // add user to the remoteUsers array
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    if(mediaType === 'video'){
        // make sure the user's video player doesn't already exist within our dom
        let player = document.getElementById(`user-contianer-${user.uid}`)
        if(player != null){
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                <div class="username-wrapper"><span class="user-name">My Name</span></div>
                <div class="video-player" id="user-${user.uid}"></div>
                </div>`
        //It takes an HTML element with the id 'video-streams' and 
        // appends the HTML content stored in the player variable to the end of that element.
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`)

    }

    if (mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async(user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async() => {
    for (let i = 0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    window.open('/', '_self')
}

let toogleCamera = async(e) => {
    if (localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

let toogleMic = async(e) =>{
    if (localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

let createMember = async () => {
    let response = await fetch('/create_member/', {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({'name': NAME, 'room_name': CHANNEL, 'UID':UID})
    })

    let member = await response.json()
    return member
}


joinAndDisplayLocalStream()
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click', toogleCamera)
document.getElementById('mic-btn').addEventListener('click', toogleMic)
