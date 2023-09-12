const reservationInput = document.getElementById("reservation");

const selectedTourId = 60;

// Si solo quieres consultar el mes actual:
const startDate = new Date();
startDate.setDate(1); // Primer día del mes

const endDate = new Date();
endDate.setMonth(endDate.getMonth() + 1);
endDate.setDate(0); // Último día del mes

async function fetchAvailability(tourId, date) {
    try {
        const response = await fetch(
            `/availability/${tourId}?date=${date.toISOString().slice(0, 10)}`);
        const availability = await response.json();

        if (availability.availableSlots <= 0) {
            // Desactiva el día en el input si es el día seleccionado
            if (reservationInput.value === date.toISOString().slice(0, 10)) {
                reservationInput.value = ""; // Resetea el valor
            }
            // Aquí podrías agregar lógica para desactivar fechas específicas, 
            // pero esto es más complicado y podría requerir una biblioteca de calendario diferente
        }
    } catch (error) {
        console.error("Error fetching availability:", error);
    }
}

// Itera por cada día del mes y consulta la disponibilidad
let day = new Date(startDate);
while (day <= endDate) {
    fetchAvailability(selectedTourId, day);
    day.setDate(day.getDate() + 1);
}