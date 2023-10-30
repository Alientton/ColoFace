const APP_ID = "520eaf2903ea4b109d6068c49900ece9"
const CHANNEL = "main"
const TOKEN = "007eJxTYPB9cOzJRe1JDd8Dy/c2cX73t9evsqp+XJc987me/31ziRcKDKZGBqmJaUaWBsapiSZJhgaWKWYGZhbJJpaWBgapyamW54/bpTYEMjLcNJvLyMgAgSA+C0NuYmYeAwMAtSUgtA=="
let UID

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {
    UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    // get user's audio and video track
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
                <div class="username-wrapper"><span class="user-name">My Name</span></div>
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

joinAndDisplayLocalStream()
