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
  // data e hora completas para o backend
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

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // loading rooms
    const roomRes = await axios.get("/api/rooms");
    const roomSelect = document.getElementById("roomSelect");

    roomRes.data.forEach(room => {
      const option = document.createElement("option");
      option.value = room._id;
      option.textContent = `${room.number} - ${room.type}`;
      roomSelect.appendChild(option);
    });

    // loading teachers
    const teacherRes = await axios.get("/api/users?type=teacher");
    const teacherSelect = document.getElementById("teacherSelect");

    teacherRes.data.forEach(teacher => {
      const option = document.createElement("option");
      option.value = teacher._id;
      option.textContent = `${teacher.name} (${teacher.email})`;
      teacherSelect.appendChild(option);
    });

  }catch (err) {
    console.error("Erro ao carregar dados:", err);
  }
});
