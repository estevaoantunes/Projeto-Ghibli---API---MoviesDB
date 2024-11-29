const apiKey = 'ffb99355af85e18eb52c71cd4e416c7f';
const baseUrl = 'https://api.themoviedb.org/3';
const sessionId = '4b36df2195b41485189ccdf36991c9fa2c7b44ca';
const accountId = '21599743';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const API_URL = "https://ghibliapi.vercel.app/films";
const JSON_URL = "http://localhost:3000/perfil-usuario";
const FAVORITE_URL = `http://localhost:3000/filmes-favoritos`;


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

// Função para preencher os cards com os filmes do Estúdio Ghibli
function populateCards(movies) {
  const cards = document.querySelectorAll('.movie-card');

  // Preenche cada card com os dados do filme
  movies.slice(0, cards.length).forEach((movie, index) => {
    const { title, overview, release_date, poster_path } = movie;

    const card = cards[index];
    const img = card.querySelector('.movie-img');
    const movieTitle = card.querySelector('.movie-title');
    const movieOverview = card.querySelector('.movie-overview');
    const movieReleaseDate = card.querySelector('.movie-release-date');

    // Preenche os elementos do card
    img.src = poster_path ? `${imageBaseUrl}${poster_path}` : 'assets/Imagens/placeholder.png';
    img.alt = title;
    movieTitle.textContent = title;
    movieOverview.textContent = overview || 'Sinopse não disponível.';
    movieReleaseDate.textContent = release_date
      ? `Ano de lançamento: ${new Date(release_date).getFullYear()}`
      : 'Ano de lançamento: Não informado.';
  });
}


// Executa a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarDados);

const SESSION_ID = '4b36df2195b41485189ccdf36991c9fa2c7b44ca'; 
const ACCOUNT_ID = '21599743'; 

async function getFavorites() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/account/${ACCOUNT_ID}/favorite/tv?api_key=${API_KEY}&session_id=${SESSION_ID}`
    );
    const data = await response.json();

    const seriesContainer = document.querySelector("#minhas-series");
    seriesContainer.innerHTML = ""; 

    data.results.forEach((series) => {
     
      const card = document.createElement("div");
      card.className = "card col-md-3 col-sm-6 mb-4";
      card.style.border = "none";

      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${series.poster_path}" alt="${series.name}" class="card-img-top img-thumbnail">
        <h4 class="card-header text-center">${series.name}</h4>
        <div class="card-body">
          <p class="card-text text-center">${series.overview}</p>
        </div>
      `;
      seriesContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
  }
}


async function carregarFilmesFavoritos() {
  try {
    // Busca os dados do JSON local
    const resposta = await fetch(JSON_URL);
    if (!resposta.ok) throw new Error("Erro ao carregar filmes favoritos!");

    const filmes = await resposta.json();

    // Verifica se há filmes favoritos
    if (!filmes || filmes.length === 0) {
      document.getElementById("movie-container").innerHTML = `
        <div class="col-12 text-center">
          <p>Nenhum filme favorito encontrado.</p>
        </div>
      `;
      return;
    }

    // Adiciona os filmes ao HTML
    const container = document.getElementById("movie-container");
    container.innerHTML = ""; // Limpa o container antes de adicionar os filmes

    filmes.forEach((filme) => {
      const cardCol = document.createElement("div");
      cardCol.className = "card col-md-3 col-sm-6 mb-4 movie-card";
      cardCol.style.border = "none";

      cardCol.innerHTML = `
        <img src="${filme.poster_path}" alt="${filme.title}" class="card-img-top img-thumbnail movie-img">
        <h4 class="card-header text-center movie-title">${filme.title}</h4>
        <div class="card-body">
          <p class="card-text text-center movie-overview">${filme.overview ? filme.overview.slice(0, 100) + "..." : "Sinopse não disponível."}</p>
          <p class="text-center movie-release-date">${filme.release_date ? `Ano de lançamento: ${new Date(filme.release_date).getFullYear()}` : "Ano de lançamento: Não informado."}</p>
        </div>
      `;

      container.appendChild(cardCol);
    });
  } catch (erro) {
    console.error("Erro ao carregar filmes favoritos:", erro);
  }
}


// Inicializa o carregamento dos filmes ao carregar a página
document.addEventListener('DOMContentLoaded', fetchGhibliMovies);
document.addEventListener("DOMContentLoaded", getFavorites);



//ca330d9216f625d98e5aee5a51f683d0d30eab42

//session id 4b36df2195b41485189ccdf36991c9fa2c7b44ca

//id account 21599743