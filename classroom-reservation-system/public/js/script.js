function showLogin() {
    document.getElementById('loginSection').classList.remove('d-none');
    document.getElementById('registerSection').classList.add('d-none');
    document.getElementById('blogin').className = 'btn btn-success btn-lg btn-block me-3 ';
    document.getElementById('bregister').className = 'btn btn-outline-light me-4';

  }
  
  function showRegister() {
    document.getElementById('registerSection').classList.remove('d-none');
    document.getElementById('loginSection').classList.add('d-none');
    document.getElementById('bregister').className = 'btn btn-success btn-lg btn-block shadow-sm me-4';
    document.getElementById('blogin').className = 'btn btn-outline-light btn-lg btn-block shadow-sm me-3';
  }
  
  function updateIdentificationField() {
    const userType = document.getElementById('userType').value;
    const field = document.getElementById('identificationField');
    const label = document.getElementById('identificationLabel');
    const input = document.getElementById('identificationInput');
  
    if (userType === 'aluno') {
      label.textContent = 'Matrícula';
      input.placeholder = 'Digite sua matrícula';
    } else if (userType === 'professor') {
      label.textContent = 'CIAP';
      input.placeholder = 'Digite seu CIAP';
    } else if (userType === 'servidor') {
      label.textContent = 'Código Servidor';
      input.placeholder = 'Digite seu código';
    }
  
    field.style.display = 'block';
  }
