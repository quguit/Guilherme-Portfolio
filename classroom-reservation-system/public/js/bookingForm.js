

document.getElementById("bookingRequestForm").addEventListener("submit", function(e) {
    e.preventDefault(); 
    
    const bookingData = {
        room: document.getElementById("room").value,
        date: document.getElementByid("date").value,
        startTime: document.getElementById("startTime").value,
        endTime: document.getElementById("endTime").value,
        reason: document.getElementById("reason").value.trim(),

        //simulates logged-in user
        user:JSON.parse(localStorage.getItem("userData"))?.email || "email@exemplo.com" 
    };

    axios.post("/api/bookings", bookingData)
    .then(res => {
      alert("Reserva solicitada com sucesso!");
      document.getElementById("bookingRequestForm").reset();
    })
    .catch(err => {
      const message = err.response?.data?.error || err.message || "Erro desconhecido.";
      alert("Erro ao criar reserva: " + message);
    });
});