let cars = [];
const carLinks = [
    'https://gwcppaiakdnqpbwzabta.supabase.co/storage/v1/object/public/cars-image/x7.jpg"',
    'https://gwcppaiakdnqpbwzabta.supabase.co/storage/v1/object/public/cars-image/x8.jpg"',
    'https://gwcppaiakdnqpbwzabta.supabase.co/storage/v1/object/public/cars-image/x9.jpg"',
];

const getCars = async () => {
    try {
        const storedCars = localStorage.getItem('cars');
        if (storedCars) {
            cars = JSON.parse(storedCars);
        } else {
            const response = await fetch('./cars.json');
            const data = await response.json();
            cars = data;
            localStorage.setItem('cars', JSON.stringify(cars));
        }
        return cars;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const renderCars = () => {
    const carGrid = document.querySelector('.car-grid');
    if (!carGrid) return;

    for (const car of cars) {
        const carCard = document.createElement('div');
        carCard.classList.add('car-card');

        carCard.innerHTML = `
            <img src="${car.image}" alt="${car.name}" />
            <h3>${car.name}</h3>
            <p>${car.description}</p>
            <p>Price: ${car.price}$</p>
        `;

        carGrid.appendChild(carCard);
    }
};

const addCar = () => {
    const addCarForm = document.getElementById('add-car-form');
    if (addCarForm) {
        addCarForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('car-name').value;
            const description =
                document.getElementById('car-description').value;
            const image = document.getElementById('car-image').value;
            const price = parseFloat(
                document.getElementById('car-price').value
            );

            const newCar = {
                id: (cars.length + 1).toString(),
                name,
                description,
                image,
                price,
            };

            cars.push(newCar);
            localStorage.setItem('cars', JSON.stringify(cars));
            addCarForm.reset();
            renderCars();
            alert('New car added successfully!');
            location.href = '/javascript-homework/index.html';
        });
    }
};

const populateCarImageDropdown = () => {
    const carImageDropdown = document.getElementById('car-image');
    if (!carImageDropdown) return;

    let number = 1;
    for (const link of carLinks) {
        const option = document.createElement('option');
        option.value = link;
        option.textContent = `Image ${number++}`;
        carImageDropdown.appendChild(option);
    }
};

const previewCarImage = () => {
    const carImageDropdown = document.getElementById('car-image');
    const previewImage = document.querySelector('.preview-car');

    if (carImageDropdown && previewImage) {
        carImageDropdown.addEventListener('change', () => {
            const selectedImage = carImageDropdown.value;
            previewImage.classList.add('preview-car-img');
            previewImage.innerHTML = `
            <img src="${selectedImage}"/>
            `;
        });
    }
};

const addButton = document.querySelector('.add-button');
if (addButton) {
    addButton.addEventListener('click', () => {
        location.href = '/javascript-homework/form.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    getCars().then(() => {
        renderCars();
    });
    addCar();
    populateCarImageDropdown();
    previewCarImage();
});
