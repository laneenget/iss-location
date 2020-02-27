let url='https://api.wheretheiss.at/v1/satellites/25544'

let issLat = document.querySelector('#iss-lat')
let issLong = document.querySelector('#iss-long')

let issMarker
let update = 10000

let map = L.map('iss-map').setView([0, 0], 1)
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution:'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 7,
    id:'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibGFuZWVuZ2V0IiwiYSI6ImNrNmxpZ2hnbzBmZ3UzbW55bmF3NHpzZ2oifQ.YYa8_BJfRVs1z7y4bORVag'
}).addTo(map)

let issIcon = L.icon({
    iconUrl: 'iss.png',

    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [-10, -76]
})

let max_failed_attempts = 3
iss(max_failed_attempts)

function iss(attempts){
    if ( attempts<=0) {
        console.log('Too many errors, abandoning requests to get ISS position.')
        return
    }

    fetch(url)
        .then( res => res.json() )
        .then( issData => {
            console.log(issData)
            let lat = issData.latitude
            let long = issData.longitude
            issLat.innerHTML = lat
            issLong.innerHTML = long

            let timeElement = document.querySelector('#time')
            setInterval( () => {
                let date = Date()
                timeElement.innerHTML = date
            }, 1000)

            if (!issMarker) {
                issMarker = L.marker([lat, long], {icon: issIcon}).addTo(map)
            } else {
                issMarker.setLatLng([lat, long])
            }
        })
        .catch( err => {
            attempts--
            console.log(err)
        })
        .finally( () => {
            setTimeout(iss, update, attempts)
        })
}