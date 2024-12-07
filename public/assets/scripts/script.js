const apiKey = 'ffb99355af85e18eb52c71cd4e416c7f';
const baseUrl = 'https://api.themoviedb.org/3';
const sessionId = '4b36df2195b41485189ccdf36991c9fa2c7b44ca';
const accountId = '21599743';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const API_URL = "https://ghibliapi.vercel.app/films";
const JSON_URL = "http://localhost:3000/perfil-usuario";
const FAVORITE_URL = `https://api.themoviedb.org/3/account/${accountId}/favorite/movies?api_key=${apiKey}&session_id=${sessionId}&language=pt-BR`;


// Função para buscar e exibir as informações do JSON
async function carregarDados() {
  try {
    // Busca os dados do JSON Server
    const resposta = await fetch(JSON_URL);
    if (!resposta.ok) throw new Error("Erro ao carregar os dados do servidor!");

    // Converte a resposta em JSON
    const dados = await resposta.json();
    const usuario = dados[0]; // Assume que há apenas um usuário

    // Atualiza a biografia
    document.getElementById("biografia").textContent =
      usuario.biograria || "Biografia não disponível.";

    // Atualiza as informações do aluno
    document.getElementById("infoAluno").innerHTML = `
      <strong>Aluno:</strong> ${usuario["nome-usuario"]}<br>
      <strong>Curso:</strong> ${usuario["curso-usuario"]}<br>
      <strong>Turno:</strong> ${usuario.turno || "Não informado"}<br>
      <strong>E-mail:</strong> ${usuario["e-mail"] || "Não informado"}<br>
      <strong>Facebook:</strong> ${usuario.facebook || "Não informado"}<br>
      <strong>Twitter:</strong> ${usuario.twitter || "Não informado"}<br>
      <strong>Instagram:</strong> ${usuario.instagram || "Não informado"}<br>
    `;
  } catch (erro) {
    console.error("Erro ao buscar os dados:", erro);
  }
}

// Chama a função para carregar os dados assim que a página for carregada
window.onload = carregarDados;



// Executa a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarDados);
async function loadCarousel() {
  try {
    const response = await fetch(API_URL);
    const films = await response.json();

    // Selecionar elementos do carrossel
    const carouselItems = document.getElementById("carouselItems");
    const carouselIndicators = document.getElementById("carouselIndicators");

    // Limpar conteúdo existente
    carouselItems.innerHTML = "";
    carouselIndicators.innerHTML = "";

    // Adicionar os filmes ao carrossel
    films.slice(0, 5).forEach((film, index) => {
      // Criar item do carrossel
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");
      if (index === 0) carouselItem.classList.add("active"); // Ativar o primeiro

      carouselItem.innerHTML = `
        <img src="${film.image}" alt="${film.title}" class="d-block">
        <div class="carousel-caption">
          <h5>${film.title}</h5>
          <p>${film.description.substring(0, 100)}...</p>
        </div>
      `;
      carouselItems.appendChild(carouselItem);

      // Criar indicador do carrossel
      const indicator = document.createElement("button");
      indicator.type = "button";
      indicator.dataset.bsTarget = "#carouselDemo";
      indicator.dataset.bsSlideTo = index;
      if (index === 0) indicator.classList.add("active");
      carouselIndicators.appendChild(indicator);
    });
  } catch (error) {
    console.error("Erro ao carregar filmes:", error);
  }
}

// Carregar o carrossel ao inicializar a página
loadCarousel();


// Função para buscar filmes do Estúdio Ghibli
async function fetchGhibliMovies() {
  try {
    // Fazendo a requisição para buscar filmes do Estúdio Ghibli (ID: 10342)
    const response = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&language=pt-BR&with_companies=10342`);
    const data = await response.json();
    populateCards(data.results);
  } catch (error) {
    console.error('Erro ao buscar os filmes do Estúdio Ghibli:', error);
  }
}

function populateCards(movies) {
  const cards = document.querySelectorAll('.movie-card');

  movies.slice(0, cards.length).forEach((movie, index) => {
    const { id, title, overview, release_date, poster_path } = movie;

    const card = cards[index];
    const img = card.querySelector('.movie-img');
    const movieTitle = card.querySelector('.movie-title');
    const movieOverview = card.querySelector('.movie-overview');
    const movieReleaseDate = card.querySelector('.movie-release-date');

    img.src = poster_path ? `${imageBaseUrl}${poster_path}` : 'assets/Imagens/placeholder.png';
    img.alt = title;
    movieTitle.textContent = title;
    movieOverview.textContent = overview || 'Sinopse não disponível.';
    movieReleaseDate.textContent = release_date
      ? `Ano de lançamento: ${new Date(release_date).getFullYear()}`
      : 'Ano de lançamento: Não informado.';

    // Adiciona evento de clique ao card para redirecionar
    card.addEventListener('click', () => {
      window.location.href = `detalhes.html?id=${id}`;
    });
  });
}


/*FILMES FAVORITOS*/ 

async function carregarFilmesFavoritos() {
  try {
    const resposta = await fetch(FAVORITE_URL);
    if (!resposta.ok) throw new Error("Erro ao buscar filmes favoritos!");

    const dados = await resposta.json();
    const filmes = dados.results;

    // Verifica se há filmes favoritos
    if (!filmes || filmes.length === 0) {
      document.getElementById("cards-container").innerHTML = `
        <div class="col-12 text-center">
          <p>Nenhum filme favorito encontrado.</p>
        </div>
      `;
      return;
    }

    // Adiciona os filmes ao HTML
    const container = document.getElementById("cards-container");
    container.innerHTML = ""; // Limpa o container antes de adicionar os filmes

    filmes.forEach((filme) => {
      const cardCol = document.createElement("div");
      cardCol.className = "col-12 col-sm-6 col-md-4 col-lg-3";

      cardCol.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${imageBaseUrl}/${filme.poster_path}" class="card-img-top" alt="${filme.title}">
          <div class="card-body">
            <h5 class="card-title">${filme.title}</h5>
            <p class="card-text">${filme.overview ? filme.overview.slice(0, 100) + "..." : "Sinopse não disponível."}</p>
          </div>
          <div class="card-footer text-center">
            <span class="badge bg-primary">Nota: ${filme.vote_average || "N/A"}</span>
            <span class="badge bg-secondary">${new Date(filme.release_date).getFullYear() || "Ano não informado"}</span>
          </div>
        </div>
      `;

      container.appendChild(cardCol);
    });
  } catch (erro) {
    console.error("Erro ao carregar os filmes favoritos:", erro);
  }
}

// Inicializa o carregamento dos filmes ao carregar a página
document.addEventListener("DOMContentLoaded", carregarFilmesFavoritos);
/*FILMES FAVORITOS*/ 

// Executa a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarDados);

// Inicializa o carregamento dos filmes ao carregar a página
document.addEventListener('DOMContentLoaded', fetchGhibliMovies);


//ca330d9216f625d98e5aee5a51f683d0d30eab42

//session id 4b36df2195b41485189ccdf36991c9fa2c7b44ca

//id account 21599743