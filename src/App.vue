<template>
    <div id="app">
        <div class="map">
            <MapInit/>
        </div>
    </div>
    
</template>
    
<script setup>
import { ref, reactive } from 'vue'
import MapInit from './components/MapInit.vue';

</script>
    
<style scoped>
    #app {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>