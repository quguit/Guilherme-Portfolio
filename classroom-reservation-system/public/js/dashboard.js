document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName") || "Usuário";
    document.getElementById("userName").textContent = userName;
  });
  
  function logout() {
    //  logout 
    alert("Sessão encerrada.");
    window.location.href = "index.html";
  }
  function renderDashboard(userType) {
    const dashboard = document.getElementById("dashboardCards");
    dashboard.innerHTML = "";

    dashboard.innerHTML += getCardHTML("Minhas Reservas", "Visualize e gerencie suas reservas.", "#");

    if (userType === "professor" || userType === "servidor") {
      dashboard.innerHTML += getCardHTML("Autorização de Uso", "Confirme ou autorize chaves.", "#");
    }

    if (userType === "servidor") {
      dashboard.innerHTML += getCardHTML("Gerenciar Recursos", "Controle os ambientes do sistema.", "#");
    }
  }

  function getCardHTML(title, text, link) {
    return `
      <div class="col-md-4">
        <div class="card shadow-sm h-100 border-success">
          <div class="card-body">
            <h5 class="card-title text-success">${title}</h5>
            <p class="card-text">${text}</p>
            <a href="${link}" class="btn btn-success">Acessar</a>
          </div>
        </div>
      </div>`;
  }

  //  tipo de usuário para diferentes visões:
  renderDashboard("professor"); // "aluno", "professor" ou "servidor"