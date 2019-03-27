export default function(player) {
  const { audio } = player

  audio.addEventListener('play', onAudioPlay.bind(player))
  audio.addEventListener('pause', onAudioPause.bind(player))
  audio.addEventListener('abort', onAudioPause.bind(player))
  audio.addEventListener('waiting', onAudioWaiting.bind(player))
  audio.addEventListener('canplay', onAudioCanplay.bind(player))
  audio.addEventListener('progress', onAudioProgress.bind(player))
  audio.addEventListener('durationchange', onAudioDurationChange.bind(player))
  audio.addEventListener('seeking', onAudioSeeking.bind(player))
  audio.addEventListener('seeked', onAudioSeeked.bind(player))
  audio.addEventListener('timeupdate', onAudioTimeUpdate.bind(player))
  audio.addEventListener('volumechange', onAudioVolumeChange.bind(player))
  audio.addEventListener('ended', onAudioEnded.bind(player))
  audio.addEventListener('loadedmetadata', onAudioLoadedMetadata.bind(player))
  audio.addEventListener('error', onAudioError.bind(player))
}

function onAudioPlay() {
  this.isPlaying = true
}
function onAudioPause() {
  this.isPlaying = false
}
function onAudioWaiting() {
  this.isLoading = true
}
function onAudioCanplay() {
  this.isLoading = false
}
function onAudioProgress() {
  if (this.audio.buffered.length) {
    this.playStatLoadedTime = this.audio.buffered.end(
      this.audio.buffered.length - 1
    )
  } else {
    this.playStatLoadedTime = 0
  }
}
function onAudioDurationChange() {
  if (this.audio.duration !== 1) {
    this.playStatDuration = this.audio.duration
  }
}
function onAudioSeeking() {
  this.playStatPlayedTime = this.audio.currentTime
}
function onAudioSeeked() {
  this.playStatPlayedTime = this.audio.currentTime
}
function onAudioTimeUpdate() {
  this.playStatPlayedTime = this.audio.currentTime
  if (this.audio.buffered.length) {
    this.playStatLoadedTime = this.audio.buffered.end(
      this.audio.buffered.length - 1
    )
  } else {
    this.playStatLoadedTime = 0
  }
}
function onAudioVolumeChange() {
  this.audioVolume = this.audio.volume
  this.isAudioMuted = this.audio.muted
}
function onAudioEnded() {
  this.playIndex += 1
}
function onAudioLoadedMetadata() {
  if (this.audio.buffered.length) {
    this.playStatLoadedTime = this.audio.buffered.end(
      this.audio.buffered.length - 1
    )
  } else {
    this.playStatLoadedTime = 0
  }
}
function onAudioError() {
  this.isPlaying = false
  this.isLoading = false
  this.playStatDuration = 0
  this.playStatLoadedTime = 0
  this.playStatPlayedTime = 0
}
