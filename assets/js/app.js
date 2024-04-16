const settings = document.getElementById('settings');
const headerSection = document.getElementById('header');
const ViewSection = document.getElementById('viewSection');

// Get current location
navigator.geolocation.getCurrentPosition(function(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    fetch(reverseGeocodeUrl)
    .then(response => response.json())
    .then(data => {
        // Extract city name from the response
        const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || data.address.suburb || data.address.locality || data.address.county;

        createCityView(city);

// Pollen API 
let apiUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + latitude + '&longitude=' + longitude + '&hourly=pm10,pm2_5,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen';

            // Pollen API Fetch
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    // Process air quality data
                    console.log('City:', city);
                    console.log('Air quality data:', data);
                })
                .catch(error => {
                    console.error('Error fetching air quality data:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching reverse geocoding data:', error);
        });
}, function(error) {
    console.error('Error getting user location:', error);
});

// Create city view
function createCityView (city) {
 let cityName = document.createElement('h1');
 cityName.className = 'cityName';

 let HeaderIcon = document.createElement('img');
 HeaderIcon.src = 'assets/icons/Vector 10.svg'; 
 HeaderIcon.className = 'headerIcon'

 cityName.innerHTML = city;

headerSection.appendChild(cityName);
headerSection.appendChild(HeaderIcon);
};

// Function to clear all sections
function clearSection() {
while(headerSection.firstChild){
    headerSection.removeChild(headerSection.firstChild);
}
while(ViewSection.firstChild){
    ViewSection.removeChild(ViewSection.firstChild);
}
}
settings.addEventListener('click', CreateSettings)

// Create settings
function CreateSettings(){
clearSection();

let headerSettings = document.createElement('h1')
headerSettings.className = 'headerSettings';
headerSettings.innerHTML = 'Settings';
headerSection.appendChild(headerSettings);


}
 


