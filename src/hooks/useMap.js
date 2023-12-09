import { reactive,toRefs } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export const useMap = () => {
    const mapState = reactive({
        map: null,
        center: [115.22047999343636, 37.9298678494477],
        acc_token: 'pk.eyJ1IjoieW91bmdtYXBwZXI2IiwiYSI6ImNsazU2YnozMzEya3kzaG12eXBvemVqMzQifQ.m2hEbxvzJ42AL0tMfPNk1Q',

    })
    const initMap = () => new Promise(resolve => {
        mapboxgl.accessToken = mapState.acc_token
        mapState.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: mapState.center,
            zoom: 13,
        })
        mapState.map.on('style.load', () => {
            mapState.map.setFog({
                color: 'rgb(186, 210, 235)', 
                'high-color': 'rgb(36, 92, 223)', 
                'horizon-blend': 0.02,
                'space-color': 'rgb(11, 11, 25)', 
                'star-intensity': 0.6 
            })
            resolve(mapState.map)
        })
    })
    const refMap = toRefs(mapState)
    return {...refMap, initMap}
}
