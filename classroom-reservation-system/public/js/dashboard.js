// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Load user's name from localStorage
  const userName = localStorage.getItem("userName") || "Usuário";
  document.getElementById("userName").textContent = userName;

  // Load default content (home page or dashboard cards)
  const userType = localStorage.getItem("userType");
  renderDashboard(userType); 

  // Add sidebar link click events
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      // Handle active link styling
      document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      // Get which section was clicked
      const section = link.dataset.section;

      // Load respective content based on section
      switch (section) {
        case "home":
          document.getElementById("dashboardCards").style.display = "flex"; // mostra cards
          document.getElementById("contentArea").innerHTML = ""; // Limpa conteúdo externo
          renderDashboard("professor"); // Re-render home cards
          break;
        case "bookings":
          document.getElementById("dashboardCards").style.display = "none"; // Esconde cards
          loadContent("../pages/bookingList.html");
          break;
        case "createRoom":
          document.getElementById("dashboardCards").style.display = "none";
          loadContent("../pages/createRoom.html");
          break;
        case "profile":
          document.getElementById("dashboardCards").style.display = "none";
          loadContent("../pages/profile.html");
          break;
      }
      
    });
  });
});

// Logs the user out and redirects to login page
function logout() {
  alert("Sessão encerrada.");
  window.location.href = "index.html";
}

// Dynamically load external HTML content into the main content area
function loadContent(pagePath) {
  fetch(pagePath)
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar página.");
      return response.text();
    })
    .then(html => {
      document.getElementById("contentArea").innerHTML = html;

      // Força execução de script específico se necessário
      if (pagePath.includes("bookingForm")) {
        loadScript("../js/bookingForm.js");
      } else if (pagePath.includes("bookingList")) {
        loadScript("../js/bookingList.js");
      }
      // profile já carrega com <script> embutido no HTML, então não precisa
    })
    .catch(err => {
      document.getElementById("contentArea").innerHTML = `<p class="text-danger">${err.message}</p>`;
    });
}

// Render cards for the main dashboard based on user type
function renderDashboard(userType) {
  const dashboard = document.getElementById("contentArea"); // All views go here
  dashboard.innerHTML = ""; // Clear any existing content

  // Basic user card
  dashboard.innerHTML += getCardHTML("Minhas Reservas", "Visualize e gerencie suas reservas.", "#");

  // Extra features for teacher or servant
  if (userType === "professor" || userType === "servidor") {
    dashboard.innerHTML += getCardHTML("Autorização de Uso", "Confirme ou autorize chaves.", "#");
  }

  // Admin resources for servant
  if (userType === "servidor") {
    dashboard.innerHTML += getCardHTML("Gerenciar Recursos", "Controle os ambientes do sistema.", "#");
  }
}

// Template for generating a dashboard card
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

function loadScript(path) {
  const script = document.createElement("script");
  script.src = path;
  document.body.appendChild(script);
}