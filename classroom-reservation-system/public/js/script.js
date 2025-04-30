function showLogin() {
  const navbar = document.getElementById('navbar');
  navbar.classList.add('bg-dark');
  navbar.classList.remove('bg-success');
    document.getElementById('loginSection').classList.remove('d-none');
    document.getElementById('registerSection').classList.add('d-none');
    document.getElementById('blogin').className = 'btn btn-success btn-block me-3 ';
    document.getElementById('bregister').className = 'btn btn-outline-light me-5';

  }
  
function showRegister() {
  const navbar = document.getElementById('navbar');
  navbar.classList.remove('bg-dark');
  navbar.classList.add('bg-success');
    document.getElementById('registerSection').classList.remove('d-none');
    document.getElementById('loginSection').classList.add('d-none');
    document.getElementById('bregister').className = 'btn btn-outline-dark btn-block me-5';
    document.getElementById('blogin').className = 'btn btn-outline-light me-3';
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
