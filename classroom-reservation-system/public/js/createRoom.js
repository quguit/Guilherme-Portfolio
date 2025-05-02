
document.getElementById('createRoomForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const roomData = {
      nome: document.getElementById('roomName').value.trim(),
      tipo: document.getElementById('roomType').value,
      capacidade: document.getElementById('roomCapacity').value,
      descricao: document.getElementById('roomDescription').value.trim()
    };

    console.log("Dados da sala:", roomData);

    // Futuramente, usarei o axios:
    // axios.post('/api/salas', roomData).then(...)

    alert('Sala criada com sucesso (simulado)');
    this.reset();
});    