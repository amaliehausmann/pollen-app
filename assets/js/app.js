const settings = document.getElementById('settings');
const map = document.getElementById('map');
const home = document.getElementById('home');
const headerSection = document.getElementById('header');
const ViewSection = document.getElementById('viewSection');
const pollenTranslations = {
    "alder": "Elm",
    "birch": "Birk",
    "grass": "Græs",
    "mugwort": "Bynke",
    "olive": "Oliven",
    "ragweed": "Ambrosia"
};

let pollenContainer;
let formattedKeys;
let city;
let currentAmounts;
const pollenImages = ['alder.jpg', 'birch.jpg', 'grass.jpg', 'mugwort.jpg', 'olive.jpg', 'ragweed.jpg'];

// Function to clear all sections
function clearSection() {
    while(headerSection.firstChild){
        headerSection.removeChild(headerSection.firstChild);
    }
    while(ViewSection.firstChild){
        ViewSection.removeChild(ViewSection.firstChild);
    }
}

// Create city view
function createCityView(city) {
    let cityName = document.createElement('h1');
    cityName.className = 'cityName';

    let HeaderIcon = document.createElement('img');
    HeaderIcon.src = 'assets/icons/Vector 10.svg'; 
    HeaderIcon.className = 'headerIcon';

    cityName.innerHTML = city;

    headerSection.appendChild(cityName);
    headerSection.appendChild(HeaderIcon);
}

function ReceivePollenData(data) {
    let pollenType = data.hourly;

    currentAmounts = [];

    currentAmounts.push(data.current.alder_pollen);
    currentAmounts.push(data.current.birch_pollen);
    currentAmounts.push(data.current.grass_pollen);
    currentAmounts.push(data.current.mugwort_pollen);
    currentAmounts.push(data.current.olive_pollen);
    currentAmounts.push(data.current.ragweed_pollen);

    console.log(currentAmounts);


    let pollenKeys = Object.keys(pollenType).filter(key => key.endsWith('_pollen'));
    formattedKeys = pollenKeys.map(key => key.replace('_pollen', ''));
}

// Create settings
function CreateSettings(formattedKeys) {
    if (!formattedKeys) {
        console.error("formattedKeys is undefined. Cannot create settings.");
        return;
    }

    clearSection();

    let headerSettings = document.createElement('h1');
    headerSettings.className = 'headerSettings';
    headerSettings.innerHTML = 'Settings';
    headerSection.appendChild(headerSettings);

    let settingsSection = document.createElement('section');
    settingsSection.className = 'settingsSection';

    let myAllergies = document.createElement('h2');
    myAllergies.className = 'myAllergies';
    myAllergies.innerHTML = 'Mine Allergier';

    settingsSection.appendChild(myAllergies);
    ViewSection.appendChild(settingsSection);

    formattedKeys.forEach(key => {
        let translatedPollen = pollenTranslations[key] || key;

        let toggleContainer = document.createElement('section');
        toggleContainer.className = 'toggleContainer';

        let pollenTypeText = document.createElement('h3');
        pollenTypeText.className = 'Pollen';
        pollenTypeText.innerHTML = translatedPollen;
        toggleContainer.appendChild(pollenTypeText);

        let toggleBox = document.createElement('div');
        toggleBox.className = localStorage.getItem(key) === 'on' ? 'on' : 'off';
        toggleContainer.appendChild(toggleBox);

        let toggle = document.createElement('div');
        toggle.className = localStorage.getItem(key) === 'on' ? 'right' : 'left';
        toggleBox.appendChild(toggle);

        toggleBox.addEventListener('click', function() {
            if (toggleBox.classList.contains('on')) {
                toggleBox.classList.remove('on');
                toggleBox.classList.add('off');
                toggle.classList.remove('right');
                toggle.classList.add('left');
                localStorage.setItem(key, 'off');
            } else if (toggleBox.classList.contains('off')) {
                toggleBox.classList.remove('off');
                toggleBox.classList.add('on');
                toggle.classList.remove('left');
                toggle.classList.add('right');
                localStorage.setItem(key, 'on');
            }
        });

        settingsSection.appendChild(toggleContainer);
    });
}

// Create Map
function CreateMap() {
    clearSection();

    let mapIcon = document.createElement('h1');
    mapIcon.className = 'headerMap';
    mapIcon.innerHTML = 'Kort';
    headerSection.appendChild(mapIcon);
}

// Create Landing
function CreateLanding() {
    clearSection();
    createCityView(city);

    const colorThresholds = {
        blue: 10,
        orange: 100
    };

    formattedKeys.forEach((key, index) => {
        if (localStorage.getItem(key) === 'on') {
            let pollenType = pollenTranslations[key] || key;
            let pollenAmount = currentAmounts[formattedKeys.indexOf(key)]; // Get the current amount corresponding to the key
            let pollenImage = pollenImages[index]; // Get the corresponding image for the pollen type

            // Create elements for pollen type, amount, and image

            let pollenTypeElement = document.createElement('h3');
            pollenTypeElement.className = 'pollenLanding';
            pollenTypeElement.innerHTML = pollenType;

            let pollenAmountElement = document.createElement('h3');
            pollenAmountElement.className = 'PollenAmount';
            pollenAmountElement.innerHTML = `${pollenAmount}`;

            let PollenUnit = document.createElement('h5');
            PollenUnit.className = 'PollenUnit';
            PollenUnit.innerHTML = 'p/m<sup>3</sup>';

            let PollenIndicator = document.createElement('div');
            PollenIndicator.className = 'PollenIndicator';

            let pollenImageElement = document.createElement('img');
            pollenImageElement.className = 'PollenImage';
            pollenImageElement.src = './assets/pollen_Billeder/' + pollenImage;
            pollenImageElement.alt = `${pollenType} Pollen`;

            // Create Containers
            pollenContainer = document.createElement('div');
            pollenContainer.className = 'pollenContainer';

            let ImageContainer = document.createElement('section');
            ImageContainer.className = 'ImageContainer';

            let InfoContainer = document.createElement('section');
            InfoContainer.className = 'InfoContainer';

            let PollenAmountContainer = document.createElement('section');
            PollenAmountContainer.className = 'PollenAmountContainer';

            // Determine color based on pollen amount
             let color;
             if (pollenAmount < colorThresholds.blue) {
            color = '#50B8AE';
             } else if (pollenAmount >= colorThresholds.blue && pollenAmount < colorThresholds.orange) {
            color = '#F1C879';
            } else {
            color = '#EC9AAA';
            }

            // Set the background color of the PollenIndicator
            PollenIndicator.style.backgroundColor = color;


            // Append elements to the containers
            pollenContainer.appendChild(ImageContainer);
            pollenContainer.appendChild(InfoContainer);

            ImageContainer.appendChild(pollenImageElement);

            InfoContainer.appendChild(pollenTypeElement);
            InfoContainer.appendChild(PollenAmountContainer);
            InfoContainer.appendChild(PollenIndicator);

            PollenAmountContainer.appendChild(pollenAmountElement);
            PollenAmountContainer.appendChild(PollenUnit);

            ViewSection.appendChild(pollenContainer);
        }
        pollenContainer.addEventListener('click', CreatePollenView);
    });
}


function CreatePollenView(){
    clearSection();
    createCityView(city);
}


// Function to initialize the page
function initializePage() {
    // Get current location
    navigator.geolocation.getCurrentPosition(function(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(reverseGeocodeUrl)
        .then(response => response.json())
        .then(data => {
            city = data.address.city || data.address.town || data.address.village || data.address.hamlet || data.address.suburb || data.address.locality || data.address.county;
            console.log('City:', city);
            createCityView(city);

            let apiUrl = 'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + latitude + '&longitude=' + longitude + '&current=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=Europe%2FBerlin&forecast_days=1';

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('Air quality data:', data);
                    ReceivePollenData(data);
                    CreateLanding();
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
}

// Event listeners
settings.addEventListener('click', function() {
    CreateSettings(formattedKeys);
});

map.addEventListener('click', CreateMap);
home.addEventListener('click', CreateLanding);

// Initial call to initialize the page
initializePage();

