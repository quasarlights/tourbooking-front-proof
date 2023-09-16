let search= document.getElementById("search")
let category= document.getElementById("category")
let adults= document.getElementById("adults")
let kids= document.getElementById("kids")
let calendar= document.getElementById("calendar")
let submit= document.getElementById("submit")
/*
submit.addEventListener(click, submitFunction());{

    function submitFunction(){       
        return 
    }
}
*/

// Obtén la referencia al elemento select en tu HTML
let categorySelect = document.getElementById("category");

// Realiza la solicitud fetch como lo hiciste antes
/*
fetch("http://localhost:8080/category")
.then((response) => {
    return response.json();
})
.then((data) => {
    let categories = data;

    // Itera sobre el array de objetos 'categories'
    categories.forEach(function(category) {
        // Crea una nueva opción para cada categoría y establece su valor y texto
        let option = document.createElement("option");
        option.value = category.id; // Puedes usar el ID como valor
        option.text = category.name; // Establece el nombre como el texto de la opción
        categorySelect.appendChild(option); // Agrega la opción al select
    });
})
.catch((error) => {
    console.error("Error al obtener las categorías:", error);
});
*/
// script.js

// Obtén una referencia al campo de entrada y al elemento select
const searchInput = document.getElementById("search");
const resultsSelect = document.getElementById("results");

// Agrega un evento 'input' al campo de entrada
searchInput.addEventListener("input", () => {
    // Obtén el valor actual del campo de entrada
    const searchValue = searchInput.value;

    // Realiza la solicitud fetch cuando se ingresa texto en el campo de búsqueda
    fetch(`http://localhost:8080/tours/search/byname?name=${searchValue}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // Limpia las opciones anteriores en el select
            resultsSelect.innerHTML = "";

            // Agrega una opción "Select All" si hay resultados
            if (data.length > 0) {
                const selectAllOption = document.createElement("option");
                selectAllOption.value = "Select All";
                selectAllOption.textContent = "Select All";
                resultsSelect.appendChild(selectAllOption);
            }

            // Agrega cada nombre como una opción en el select
            data.forEach((result) => {
                const resultOption = document.createElement("option");
                resultOption.value = result.id;
                resultOption.textContent =result.id +"/"+ result.name;
                resultsSelect.appendChild(resultOption);
            });
        })
        .catch((error) => {
            console.error("Error al realizar la búsqueda:", error);
        });
});


// Agrega un evento 'change' al select para realizar acciones cuando cambia la selección
resultsSelect.addEventListener("change", () => {
    // Obtén las opciones seleccionadas en el select
    const selectedOptions = Array.from(resultsSelect.selectedOptions).map(option => option.value);

    // Si "Select All" está seleccionado, agrega todas las demás opciones
    if (selectedOptions.includes("Select All")) {
        const allOptions = Array.from(resultsSelect.options).map(option => option.value);
        selectedOptions.splice(selectedOptions.indexOf("Select All"), 1); // Elimina "Select All"
        selectedOptions.push(...allOptions.filter(option => option !== "Select All"));
    }

    // Almacena las opciones seleccionadas en el Local Storage
    localStorage.setItem("ids", JSON.stringify(selectedOptions));

    // Muestra las opciones seleccionadas en el cuerpo del documento
    //showLocalStorageOptions();
});

kids.addEventListener("change", ()=>{
    // Almacena las opciones seleccionadas en el Local Storage
    localStorage.setItem("kidsTickets", kids.value);

});

adults.addEventListener("change", ()=>{
    // Almacena las opciones seleccionadas en el Local Storage
    localStorage.setItem("adultsTickets", adults.value);

});

calendar.addEventListener("change", ()=>{
    // Almacena las opciones seleccionadas en el Local Storage
    localStorage.setItem("date", calendar.value);

});

submit.addEventListener('click', fetchDataFromAPI);
    


function fetchDataFromAPI(event) {
    event.preventDefault(); // Evitar la recarga de la página

    // Obtener los parámetros del Local Storage
    const ids = localStorage.getItem('ids');
    const adultsTickets = localStorage.getItem('adultsTickets');
    const kidsTickets = localStorage.getItem('kidsTickets');
    const date = localStorage.getItem('date');

    // Convertir los valores de ids a un formato adecuado (suponiendo que están en un formato de matriz)
    const idsArray = JSON.parse(ids); // Parsear la cadena JSON a un array

    // Construir la URL del API con los valores correctos
    const apiUrl = `http://localhost:8080/availability/byticketanddate?ids=${idsArray.join(',')}&adultsTickets=${adultsTickets}&kidsTickets=${kidsTickets}&date=${date}`;

    // Realizar la solicitud fetch
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.text(); // Leer la respuesta como texto
        })
        .then(data => {
            try {
                // Intentar analizar la respuesta JSON solo si no está vacía
                if (data.trim() !== '') {
                    const resultDiv = document.getElementById('result');
                    resultDiv.innerHTML = JSON.stringify(JSON.parse(data), null, 2);
                } else {
                    console.error('La respuesta está vacía');
                }
            } catch (error) {
                console.error('Error al analizar la respuesta JSON:', error);
            }
        })
        .catch(error => {
            console.error('Error al obtener datos del API:', error);
        });
}
