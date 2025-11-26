let cars = [];
const carLinks = [
    'https://gwcppaiakdnqpbwzabta.supabase.co/storage/v1/object/public/cars-image/x1.jpg',
    'https://gwcppaiakdnqpbwzabta.supabase.co/storage/v1/object/public/cars-image/m33.jpg',
    'https://gwcppaiakdnqpbwzabta.supabase.co/storage/v1/object/public/cars-image/m3.jpg',
    'https://gwcppaiakdnqpbwzabta.supabase.co/storage/v1/object/public/cars-image/m55.jpg',
    'https://gwcppaiakdnqpbwzabta.supabase.co/storage/v1/object/public/cars-image/m5.jpeg',
    'https://gwcppaiakdnqpbwzabta.supabase.co/storage/v1/object/public/cars-image/x6.jpg',
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

    carGrid.innerHTML = '';

    for (const car of cars) {
        const carCard = document.createElement('div');
        carCard.classList.add('car-card');

        carCard.innerHTML = `
        <div class="buttons">
            <button class="edit-button" id="edit${car.id}">Edit</button>
            <button class="delete-button" id="delete${car.id}">Delete</button>
        </div>
        <img src="${car.image}" alt="${car.name}" />
        <h3>${car.name}</h3>
        <p>${car.description}</p>
        <p>Price: ${car.price}$</p>
        `;

        carGrid.appendChild(carCard);

        const carToEdit = document.getElementById(`edit${car.id}`);
        carToEdit.addEventListener('click', () => editCar(car.id));

        const carToDelete = document.getElementById(`delete${car.id}`);
        carToDelete.addEventListener('click', () => deleteCar(car.id));
    }
};

const addCar = () => {
    const addCarForm = document.getElementById('add-car-form');
    if (!addCarForm) return;

    addCarForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('car-name').value;
        const description = document.getElementById('car-description').value;
        const image = document.getElementById('car-image').value;
        const price = parseFloat(document.getElementById('car-price').value);

        const editCarId = localStorage.getItem('editCarId');

        if (editCarId) {
            const carToEdit = cars.find((car) => car.id === editCarId);
            carToEdit.name = name;
            carToEdit.description = description;
            carToEdit.image = image;
            carToEdit.price = price;
            localStorage.removeItem('editCarId');
        } else {
            const newCar = {
                id: (cars.length + 1).toString(),
                name,
                description,
                image,
                price,
            };
            cars.push(newCar);
        }
        localStorage.setItem('cars', JSON.stringify(cars));
        localStorage.removeItem('editCarId');
        alert(editCarId ? 'Car edited successfully!' : 'New car added successfully!');
        location.href = '/javascript-homework/index.html';
    });
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

    const editCarId = localStorage.getItem('editCarId');
    if (editCarId) {
        const carToEdit = cars.find((car) => car.id === editCarId);
        if (carToEdit) {
            const nameInput = document.getElementById('car-name');
            const descriptionInput = document.getElementById('car-description');
            const imageInput = document.getElementById('car-image');
            const priceInput = document.getElementById('car-price');

            if (nameInput && descriptionInput && imageInput && priceInput) {
                nameInput.value = carToEdit.name;
                descriptionInput.value = carToEdit.description;
                imageInput.value = carToEdit.image;
                priceInput.value = carToEdit.price;
            }
        } else {
            alert(`Car with ${editCarId} not found`);
        }
    }
});

function editCar(id) {
    localStorage.setItem('editCarId', id);
    location.href = '/javascript-homework/form.html';
}

function deleteCar(id) {
    cars = cars.filter((car) => car.id !== id.toString());
    localStorage.setItem('cars', JSON.stringify(cars));
    renderCars();

    alert('Car deleted successfully!');
}
