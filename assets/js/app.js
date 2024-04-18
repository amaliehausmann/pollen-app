// Globals
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
    "ragweed": "Ambrosie"
};

let pollenContainer;
let formattedKeys;
let city;
let currentAmounts;
let hourlyAmounts;
let pollenType;
let pollenAmount;
let pollenImage;

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

    hourlyAmounts = [];
    
    hourlyAmounts.push(data.hourly.alder_pollen);
    hourlyAmounts.push(data.hourly.birch_pollen);
    hourlyAmounts.push(data.hourly.grass_pollen);
    hourlyAmounts.push(data.hourly.mugwort_pollen);
    hourlyAmounts.push(data.hourly.olive_pollen);
    hourlyAmounts.push(data.hourly.ragweed_pollen);


    console.log(hourlyAmounts)

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
            let pollenAmount = currentAmounts[index]; // Use the index directly
            let pollenImage = pollenImages[index];

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
            let pollenContainer = document.createElement('div');
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
            
            // Attach event listener to pollenContainer
            pollenContainer.addEventListener('click', function() {
                CreatePollenView(pollenType, pollenAmount, pollenImage, hourlyAmounts, index);
            });
        }
    });
}

function getCurrentHour() {
    return new Date().getHours();
}

function CreatePollenView(selectedPollenType, pollenViewAmount, pollenViewImage, hourlyAmounts, index) {
    clearSection();
    createCityView(city);

    console.log("Selected Pollen Type:", selectedPollenType);

    const currentHour = getCurrentHour();

    const pollenAmountsForNextFiveHours = [];
    for (let i = currentHour; i < currentHour + 5; i++) {
        const hourIndex = i % 24; // Ensure it loops around to 0-23
        const hour = `${(i % 24).toString().padStart(2, '0')}.00`; // Format hour as "HH.00"
        const pollenAmountForHour = hourlyAmounts[index][hourIndex];
        pollenAmountsForNextFiveHours.push({ hour, amount: pollenAmountForHour });
    }

    // Create elements to display the selected pollen type, image, and amount
    let pollenTypeElement = document.createElement('h3');
    pollenTypeElement.innerHTML = selectedPollenType;
    pollenTypeElement.className = 'SelectedPollenType';

    let pollenImageElement = document.createElement('img');
    pollenImageElement.src = './assets/pollen_Billeder/' + pollenViewImage;
    pollenImageElement.alt = `${selectedPollenType} Pollen`;
    pollenImageElement.className = 'pollenViewImage';

    let pollenAmountElement = document.createElement('h3');
    pollenAmountElement.innerHTML = `${pollenViewAmount}`;
    pollenAmountElement.className = 'pollenViewAmount';

    let pollenViewAmountUnit = document.createElement('h5');
    pollenViewAmountUnit.className = 'pollenViewAmountUnit';
    pollenViewAmountUnit.innerHTML = 'p/m<sup>3</sup>';

    let pollenviewindicator = document.createElement('div');
    pollenviewindicator.className = 'pollenViewIndicator';

    // create containers
    let pollenTopViewContainer = document.createElement('div');
    pollenTopViewContainer.className = 'topContainer';

    let pollenViewContainer = document.createElement('div');
    pollenViewContainer.className = 'pollenViewContainer';

    let pollenViewImageContainer = document.createElement('section');
    pollenViewImageContainer.className = 'viewImageContainer';

    let pollenViewInfoContainer = document.createElement('section');
    pollenViewInfoContainer.className = 'viewInfoContainer';

    let pollenViewAmountContainer = document.createElement('section');
    pollenViewAmountContainer.className = 'pollenViewAmountContainer';

    let pollenHourlyContainer = document.createElement('section');
    pollenHourlyContainer.className = 'PollenHourlyContainer';

    // Append elements to the view section
    pollenTopViewContainer.appendChild(pollenViewImageContainer);
    pollenTopViewContainer.appendChild(pollenViewInfoContainer);
    pollenViewContainer.appendChild(pollenTopViewContainer);
    pollenViewContainer.appendChild(pollenHourlyContainer);

    pollenViewImageContainer.appendChild(pollenImageElement);

    pollenViewInfoContainer.appendChild(pollenTypeElement);
    pollenViewInfoContainer.appendChild(pollenViewAmountContainer);
    pollenViewInfoContainer.appendChild(pollenviewindicator);

    pollenViewAmountContainer.appendChild(pollenAmountElement);
    pollenViewAmountContainer.appendChild(pollenViewAmountUnit);

    // Append hour and amount containers for each hour
    pollenAmountsForNextFiveHours.forEach(hourlyData => {
        const hourElement = document.createElement('p');
        hourElement.innerHTML = hourlyData.hour;
        hourElement.className = 'hourElement';

        const amountElement = document.createElement('p');
        amountElement.innerHTML = `${hourlyData.amount}`;
        amountElement.className = 'amountElement';
        
        // Set background color and width based on pollen amount
        if (hourlyData.amount < 10) {
            amountElement.style.backgroundColor = '#50B8AE';
            amountElement.style.width = '10vw';
        } else if (hourlyData.amount >= 10 && hourlyData.amount < 100) {
            amountElement.style.backgroundColor = '#F1C879';
            amountElement.style.width = '18vw';
        } else {
            amountElement.style.backgroundColor = '#EC9AAA';
            amountElement.style.width = '28vw';
        }

        const hourContainer = document.createElement('div');
        hourContainer.className = 'hourContainer';
        hourContainer.appendChild(hourElement);

        const amountContainer = document.createElement('div');
        amountContainer.className = 'amountContainer';
        amountContainer.appendChild(amountElement);

        const hourlyContainer = document.createElement('div');
        hourlyContainer.className = 'hourlyContainer';
        hourlyContainer.appendChild(hourContainer);
        hourlyContainer.appendChild(amountContainer);

        pollenHourlyContainer.appendChild(hourlyContainer);
    });

        // Set color of pollen view indicator based on pollen amount
        if (pollenViewAmount < 10) {
            pollenviewindicator.style.backgroundColor = '#50B8AE';
        } else if (pollenViewAmount >= 10 && pollenViewAmount < 100) {
            pollenviewindicator.style.backgroundColor = '#F1C879';
        } else {
            pollenviewindicator.style.backgroundColor = '#EC9AAA';
        }
    

    ViewSection.appendChild(pollenViewContainer);

    // event listener to go back to landing page when the view container is clicked
    pollenViewContainer.addEventListener('click', function() {
        CreateLanding();
    });
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

