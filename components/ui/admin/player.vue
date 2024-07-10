<template>
    <div class="player">
        
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    file:{
        type: String,
        required: true,
        default: 'https://anansesemfie.com/1630456838250-Digital-stuff/Chapter-2.mp3'
    }
})
const player = document.createElement('audio')
player.src = props.file
const { playAudio, pauseAudio, stopAudio, setVolume, muteAudio, unmuteAudio, } = usePlayer()
</script>


<style scoped>
.player {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 1083px;
    height: 83px;
    margin-top: 20px;
    flex-shrink: 0;
    border-radius: 16px;
    background: #6E4C29;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}
</style>