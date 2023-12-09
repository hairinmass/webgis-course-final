<template>
    <div id="map"></div>
    <div id="location-modal" class="modal" v-if="data.modelDisplay">
        <div class="modal-content">
            <span id="close-modal" class="x" @click="closeModel">×</span>
            <form id="location-form" class="handler">
                <span>name</span> 
                <input type="text" id="name" class="textplace" v-model="data.name">
                <span>LngLat</span>
                <input type="text" id="lngLat" class="textplace" v-model="data.LngLat">
                <span>location</span>
                <input type="text" id="address" class="textplace" v-model="data.location">
                <span>description</span>
                <textarea id="description" class="textdesplace" v-model="data.description"></textarea>
                <button type="submit" class="sbt" id="asub" @click="updateOne">保存</button>
                <button type="button" class="dbt" id="dbtn" @click="deleteOne">删除</button>
            </form>
        </div>
    </div>
</template>
    
<script setup>
import { onMounted, reactive } from 'vue'
import { useMap } from '@/hooks/useMap'
import { useMarkers } from '@/hooks/useMarkers'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

    const data = reactive({
        modelDisplay: false,
        name: '',
        LngLat: '',
        location: '',
        description: '',
    })

    const closeModel = () => {
        data.modelDisplay = false
    }

    const updateOne = () => {
        fetch(`http://localhost:3000/updateCW/${data.LngLat}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                address: data.location,
                description: data.description,
            })
        })
    }

    const deleteOne = async () => {
        await fetch(`http://localhost:3000/deleteCW/${data.name}`, {
            method: 'DELETE',
        })
        data.modelDisplay = false
        const markerToDel = markers.find(marker => {
            return Math.abs(Number(marker.getLngLat().lng) - Number(data.LngLat[0])) < 1e-9
        })
        
        console.log(markerToDel)
        if(markerToDel) {
            markerToDel.remove()
            markers = markers.filter(marker => marker !== markerToDel)
        }
    }

    const { initMap } = useMap()
    const { getData } = useMarkers()

    let markers = []

    onMounted(async () => {
        const map = await initMap()
        const resData = await getData('http://localhost:3000/citywalk?')
        
        resData.forEach(item => {
            const marker = new mapboxgl.Marker()
                .setLngLat(item.coords)
                .addTo(map)

            markers.push(marker)
            console.log(markers)

            marker.getElement().addEventListener('click', () => {
                data.modelDisplay = true
                data.name = item.name
                data.LngLat = item.coords
                data.location = item.address
                data.description = item.description
            })
        })
    })
 
</script>
    
<style scoped>
    #map {
        width: 80vw;
        height: 85vh;
        margin: auto;
        border: 1px solid white;
        box-shadow: 1vw 1vw 3vw rgb(113, 113, 113);
        border-radius: 20px;
        background-size: cover;

    }
    * {
        margin: 0;
        padding: 0;
    }
    .modal {
        /* display: none; */
        position: fixed;
        z-index: 999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
    }
    .modal-content {
        background-color: #fefefe;
        margin: 10% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 30%;
        height: 55%;
        border-radius: 20px;
    }
    .handler {
        display: flex;
        flex-direction: column;
    }
    .x:hover {
        cursor: help;
    }
    .x {
        color: black;
    }
    .textplace {
        margin-top: 10px;
        margin-bottom: 10px;
        height: 30px;
        font-family: 'Ma Shan Zheng', cursive;
        font-size: 20px;
    }
    .textdesplace {
        margin-top: 10px;
        margin-bottom: 10px;
        height: 60px;
        font-family: 'Ma Shan Zheng', cursive;
        font-size: 20px;
    }
    .sbt {
        width: 40%;
        margin-top: 10px;
        margin-left: auto;
        margin-right: auto;
        font-family: 'Ma Shan Zheng', cursive;
        font-size: 20px;
        background-color: #00853e;
        border-bottom: 1px solid #eee;
        border-radius: 10px;
        color: #fff;
    }
    .sbt:hover {
        background-color: #056331;
        cursor: pointer;
    }
    .handler span {
        font-family: 'Courgette', cursive;
        color: black;
    }
    .dbt {
        width: 40%;
        height: 10%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 10px;
        font-family: 'Ma Shan Zheng', cursive;
        font-size: 20px;
        background-color: rgb(190, 23, 45);
        border-bottom: 1px solid #eee;
        border-radius: 10px;
        color: #fff;
    }
    .dbt:hover {
        background-color: rgb(128, 7, 23);
        cursor: pointer;
    }
</style>