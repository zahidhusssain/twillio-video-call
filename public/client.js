document.addEventListener('DOMContentLoaded', () => {
    const Video = Twilio.Video;
    const accessToken = ''; // Replace with your generated access token
    const remoteMediaContainer = document.getElementById('remote-media');
    const localMediaContainer = document.getElementById('local-media');
    const startCallButton = document.getElementById('start-call');
    const joinRoomButton = document.getElementById('join-room');
    let activeRoom;
    let localTracks;

    startCallButton.addEventListener('click', startCall);
    joinRoomButton.addEventListener('click', joinRoom);

    function startCall() {
        Video.connect(accessToken, { video: true, audio: true, name: 'room-name' })
            .then(room => {
                activeRoom = room;
                localTracks = Array.from(room.localParticipant.tracks.values());
                localTracks.forEach(track => {
                    localMediaContainer.appendChild(track.track.attach());
                });

                room.on('participantConnected', participant => {
                    participant.tracks.forEach(track => {
                        remoteMediaContainer.appendChild(track.track.attach());
                    });
                });

                room.on('participantDisconnected', participant => {
                    participant.tracks.forEach(track => {
                        track.track.detach().forEach(element => element.remove());
                    });
                });
            })
            .catch(error => {
                console.error('Unable to connect to Twilio:', error);
            });
    }

    function joinRoom() {
        const roomName = prompt('Enter the room name'); // Replace with your logic to get the room name

        if (roomName) {
            Video.connect(accessToken, { video: true, audio: true, name: roomName })
                .then(room => {
                    activeRoom = room;

                    localTracks = Array.from(room.localParticipant.tracks.values());
                    localTracks.forEach(track => {
                        localMediaContainer.appendChild(track.track.attach());
                    });

                    room.on('participantConnected', participant => {
                        const remoteMediaDiv = document.createElement('div');
                        remoteMediaContainer.appendChild(remoteMediaDiv);

                        participant.tracks.forEach(track => {
                            remoteMediaDiv.appendChild(track.track.attach());
                        });
                    });

                    const videoTrack = localTracks.find(track => track.kind === 'video');
                    if (videoTrack) {
                        localMediaContainer.appendChild(videoTrack.attach());
                    } else {
                        console.error('No video track available');
                    }

                    room.on('participantDisconnected', participant => {
                        participant.tracks.forEach(track => {
                            track.track.detach().forEach(element => element.remove());
                        });
                    });
                })
                .catch(error => {
                    console.error('Unable to connect to Twilio:', error);
                });
        }
    }
});

