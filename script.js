document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userType = document.getElementById('userType').value;

    if (userType === 'seller') {
        document.querySelector('.seller-section').style.display = 'block';
        document.querySelector('.buyer-section').style.display = 'none';
    } else {
        document.querySelector('.buyer-section').style.display = 'block';
        document.querySelector('.seller-section').style.display = 'none';
        loadProperties();
    }
});

document.getElementById('postPropertyForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const propertyList = document.getElementById('sellerPropertiesList');
    const propertyTitle = document.getElementById('propertyTitle').value;
    const price = document.getElementById('price').value;
    const area = document.getElementById('area').value;
    const bedrooms = document.getElementById('bedrooms').value;
    const bathrooms = document.getElementById('bathrooms').value;
    const nearbyFacilities = document.getElementById('nearbyFacilities').value;

    const propertyItem = document.createElement('div');
    propertyItem.className = 'property-item';
    propertyItem.innerHTML = `
        <h3>${propertyTitle}</h3>
        <p>Price: ${price}</p>
        <p>Area: ${area} sq ft</p>
        <p>Bedrooms: ${bedrooms}</p>
        <p>Bathrooms: ${bathrooms}</p>
        <p>Nearby: ${nearbyFacilities}</p>
        <button onclick="editProperty(this)">Edit</button>
        <button onclick="deleteProperty(this)">Delete</button>
        <button onclick="showSellerDetails('${propertyTitle}')">I'm Interested</button>
        <button onclick="likeProperty(this)">Like</button>
        <span class="like-count">0</span>
    `;

    propertyList.appendChild(propertyItem);

    alert('Property Posted');

    document.getElementById('postPropertyForm').reset();
});

document.getElementById('applyFilters').addEventListener('click', function() {
    const maxPrice = document.getElementById('filterPrice').value;
    const minBedrooms = document.getElementById('filterBedrooms').value;
    const propertyList = document.getElementById('propertyList');
    propertyList.innerHTML = '';

    const properties = [
        { title: 'Luxury Villa', price: 500000, area: 3500, bedrooms: 4, bathrooms: 3, nearby: 'Hospital, School' },
        { title: 'Modern Apartment', price: 200000, area: 1200, bedrooms: 2, bathrooms: 2, nearby: 'Mall, Park' }
    ];

    properties.forEach(property => {
        if ((maxPrice && property.price > maxPrice) || (minBedrooms && property.bedrooms < minBedrooms)) {
            return;
        }

        const propertyItem = document.createElement('div');
        propertyItem.className = 'property-item';
        propertyItem.innerHTML = `
            <h3>${property.title}</h3>
            <p>Price: ${property.price}</p>
            <p>Area: ${property.area} sq ft</p>
            <p>Bedrooms: ${property.bedrooms}</p>
            <p>Bathrooms: ${property.bathrooms}</p>
            <p>Nearby: ${property.nearby}</p>
            <button onclick="showSellerDetails('${property.title}')">I'm Interested</button>
            <button onclick="likeProperty(this)">Like</button>
            <span class="like-count">0</span>
        `;

        propertyList.appendChild(propertyItem);
    });

    alert('Filters Applied');
});

function likeProperty(button) {
    const likeCount = button.nextElementSibling;
    let count = parseInt(likeCount.innerText);
    count++;
    likeCount.innerText = count;
}

function editProperty(button) {
    const propertyItem = button.parentElement;
    const title = propertyItem.querySelector('h3').innerText;
    const price = propertyItem.querySelectorAll('p')[0].innerText.split(': ')[1];
    const area = propertyItem.querySelectorAll('p')[1].innerText.split(': ')[1];
    const bedrooms = propertyItem.querySelectorAll('p')[2].innerText.split(': ')[1];
    const bathrooms = propertyItem.querySelectorAll('p')[3].innerText.split(': ')[1];
    const nearby = propertyItem.querySelectorAll('p')[4].innerText.split(': ')[1];

    document.getElementById('propertyTitle').value = title;
    document.getElementById('price').value = price;
    document.getElementById('area').value = area;
    document.getElementById('bedrooms').value = bedrooms;
    document.getElementById('bathrooms').value = bathrooms;
    document.getElementById('nearbyFacilities').value = nearby;

    propertyItem.remove();
}

function deleteProperty(button) {
    button.parentElement.remove();
}

// Function to send email to seller with buyer's details
function sendEmailToSeller(buyerName, buyerEmail, propertyTitle) {
    console.log(`Email sent to seller: Buyer's details\nName: ${buyerName}\nEmail: ${buyerEmail}\nInterested in property: ${propertyTitle}`);
    // Replace console.log with your actual email sending logic
}

function showSellerDetails(propertyTitle) {
    const buyerName = prompt("Enter your name:");
    const buyerEmail = prompt("Enter your email:");

   
    sendEmailToSeller(buyerName, buyerEmail, propertyTitle);
    // In a real application, you would fetch and display seller details here
}

function loadProperties() {
    const propertyList = document.getElementById('propertyList');
    propertyList.innerHTML = '';

    const properties = [
        { title: 'Luxury Villa', price: 500000, area: 3500, bedrooms: 4, bathrooms: 3, nearby: 'Hospital, School' },
        { title: 'Modern Apartment', price: 200000, area: 1200, bedrooms: 2, bathrooms: 2, nearby: 'Mall, Park' }
    ];

    properties.forEach(property => {
        const propertyItem = document.createElement('div');
        propertyItem.className = 'property-item';
        propertyItem.innerHTML = `
            <h3>${property.title}</h3>
            <p>Price: ${property.price}</p>
            <p>Area: ${property.area} sq ft</p>
            <p>Bedrooms: ${property.bedrooms}</p>
            <p>Bathrooms: ${property.bathrooms}</p>
            <p>Nearby: ${property.nearby}</p>
            <button onclick="showSellerDetails('${property.title}')">I'm Interested</button>
            <button onclick="likeProperty(this)">Like</button>
            <span class="like-count">0</span>
        `;

        propertyList.appendChild(propertyItem);
    });
}
