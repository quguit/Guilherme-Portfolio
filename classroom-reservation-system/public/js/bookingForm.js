document.getElementById("bookingRequestForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("userData"));
  if (!user) return alert("Usuário não autenticado.");

  const room_id = document.getElementById("roomSelect").value;
  const purpose = document.getElementById("reason").value.trim();
  const requested_teacher = document.getElementById("teacherSelect")?.value || null;
  
  const date = document.getElementById("date").value;
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;

  const start_time = new Date(`${date}T${start}`);
  const end_time = new Date(`${date}T${end}`);

  const payload = {
    room_id,
    start_time: start_time.toISOString(),
    end_time: end_time.toISOString(),
    purpose,
    requested_teacher: requested_teacher || undefined
  };

  try {
    const res = await axios.post("/api/bookings", payload, {
      headers: {
        Authorization: `Bearer ${user.token}` // ou `user.accessToken`, se estiver assim
      }
    });

    alert(res.data.message || "Reserva enviada!");
    document.getElementById("bookingRequestForm").reset();
  } catch (err) {
    const msg = err.response?.data?.error || "Erro ao enviar reserva.";
    alert(msg);
  }
});
document.addEventListener("DOMContentLoaded", () => {
  axios.get("/api/rooms")
    .then(res => {
      const select = document.getElementById("roomSelect");
      res.data.forEach(room => {
        const option = document.createElement("option");
        option.value = room._id;
        option.textContent = `${room.number} - ${room.type}`;
        select.appendChild(option);
      });
    })
    .catch(err => console.error("Erro ao carregar salas:", err));
});
