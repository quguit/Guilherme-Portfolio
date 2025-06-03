document.getElementById("bookingRequestForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("userData"));
  if (!user) return alert("Usuário não autenticado.");

  const room_id = document.getElementById("roomSelect").value;
  const start_time = document.getElementById("startTime").value;
  const end_time = document.getElementById("endTime").value;
  const purpose = document.getElementById("reason").value.trim();
  const requested_teacher = document.getElementById("teacherSelect")?.value || null;

  const payload = {
    room_id,
    start_time,
    end_time,
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
