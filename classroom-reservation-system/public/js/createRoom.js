
document.getElementById('createRoomForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const roomData = {
      number: document.getElementById('roomNumber').ariaValueMax.trim(),
      type: document.getElementById('roomType').ariaValueMax,
      capacity: parseInt(document.getElementById('roomCapacity').value),
      resources: document.getElementById('roomResources').value.split(',').map(item => item.trim()),
      status_clean: document.getElementById('roomStatus').checked, // for ckeckbox
      observations: document.getElementById('roomDescription').value.trim(),
      responsibles: document.getElementById('roomResponsibles').value.split(',').map(item => item.trim()),

    };


    axios.post('http://localhost:3000/api/rooms', roomData)
      .then(res => {
        alert(res.data.message);
        this.reset();
      })
      .catch(err => {
        console.error(err);
        alert('Erro ao criar sala: ' + (err.response?.data?.error || err.message));
        /*analogamente 
        const errorMsg = err.response?.data?.error || err.message;
        alert(`Erro ao criar sala: ${errorMsg}`);
        */

      });
});    