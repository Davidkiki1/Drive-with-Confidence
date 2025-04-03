document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.getElementById("bookingForm");
    const carList = document.createElement("div");
    carList.id = "carList";
    document.body.appendChild(carList);

    let cars = [];

    // Load cars data from JSON Server
    function loadCars() {
        fetch("http://localhost:3000/cars")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load cars data. Please check your connection or file path.');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    cars = data;
                    displayCars();
                } else {
                    throw new Error('Cars data is not in the expected format (should be an array).');
                }
            })
            .catch(error => {
                console.error("Error loading JSON:", error);
                carList.innerHTML = "<p>Error loading available cars. Please try again later.</p>";
            });
    }

    // Display cars data
    function displayCars() {
        carList.innerHTML = "<h2>Available Cars</h2>";
        if (cars.length === 0) {
            carList.innerHTML += "<p>No cars available at the moment.</p>";
            return;
        }

        cars.forEach(car => {
            const carItem = document.createElement("div");
            carItem.classList.add("car-item");

            const carImage = document.createElement("img");
            carImage.src = car.image;
            carImage.alt = `${car.make} ${car.model}`;

            const carDetails = document.createElement("p");
            carDetails.innerHTML = `<strong>${car.make} ${car.model} (${car.year_made})</strong>`;

            const carStats = document.createElement("p");
            carStats.innerText = `Color: ${car.color} | Kilometers: ${car.kilometers_covered}`;

            const carHistory = document.createElement("p");
            carHistory.innerText = `Repairs: ${car.number_of_repairs} | Owners: ${car.number_of_owners}`;

            carItem.appendChild(carImage);
            carItem.appendChild(carDetails);
            carItem.appendChild(carStats);
            carItem.appendChild(carHistory);
            carList.appendChild(carItem);
        });
    }

    // Handle form submission to add a new car
    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(bookingForm);
        const newCar = {
            make: formData.get("carMake"),
            model: formData.get("carModel"),
            year_made: formData.get("carYear"),
            kilometers_covered: formData.get("carKilometers"),
            color: formData.get("carColor"),
            number_of_repairs: formData.get("numberOfRepairs"),
            number_of_owners: formData.get("numberOfOwners"),
            image: ""
        };

        const imageFile = formData.get("carImage");
        if (!imageFile) {
            alert("Please upload an image.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            newCar.image = e.target.result;

            // Send new car data to JSON Server
            fetch("http://localhost:3000/cars", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCar)
            })
            .then(response => response.json())
            .then(data => {
                cars.push(data);  // Update the local array with the new car from the server
                displayCars();  // Refresh the car list
                bookingForm.reset();
                alert("Car added successfully!");
            })
            .catch(error => {
                console.error("Error adding car:", error);
                alert("Failed to add car.");
            });
        };
        reader.onerror = function () {
            alert("Error reading the image file.");
        };
        reader.readAsDataURL(imageFile);
    });

    // Load the car data on page load
    loadCars();
});