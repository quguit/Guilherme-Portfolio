document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName") || "Usuário";
    document.getElementById("userName").textContent = userName;
  });
  
  function logout() {
    // Simples logout simulation
    alert("Sessão encerrada.");
    window.location.href = "index.html";
  }
  