mapboxgl.accessToken = map_token ;
cordinatesdata=JSON.parse(coordinates)

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center:cordinatesdata, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 13 // starting zoom
});

const marker = new mapboxgl.Marker({color: 'red'})
    .setLngLat(cordinatesdata)
    .addTo(map);