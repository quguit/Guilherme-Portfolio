
document.addEventListener("DOMContentLoaded", () => {
    axios.get("/api/bookings")
        .then(res => {
            const tbody = document.getElementById("bookingTableBody");
            tbody.innerHTML = ""; // Clear mock

            res.data.forEach(b => {
                tbody.innerHTML += `
                    <tr>
                        <td>${b.date}</td>
                        <td>${b.startTime} - ${b.endTime}</td>
                        <td>${b.room}</td>
                        <td>${b.user}</td>
                        <td><span class="badge bg-success">${b.status}</span></td>
                        <td><span class="badge bg-warning text-dark">Pedente</span></td>
                        <td><button class="btn btn-sm btn-outline-primary">Confirmar Chave</button></td>
                    </td>
                `;
            });
            })
        .catch(err => console.error("Erro ao carregar reservas:", err));
        });
})