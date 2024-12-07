const apiKey = 'ffb99355af85e18eb52c71cd4e416c7f';
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

// Referências aos elementos HTML
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const resultsContainer = document.querySelector('#results-container');

// Função para buscar filmes
async function searchMovies(query) {
  try {
    const response = await fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`);
    if (!response.ok) {
      throw new Error('Erro ao buscar filmes');
    }
    const data = await response.json();
    displayResults(data.results);
  } catch (error) {
    console.error(error);
    resultsContainer.innerHTML = '<p>Ocorreu um erro ao buscar filmes. Tente novamente.</p>';
  }
}

// Função para exibir os resultados
function displayResults(movies) {
  resultsContainer.innerHTML = ''; // Limpa os resultados anteriores

  if (movies.length === 0) {
    resultsContainer.innerHTML = '<p>Nenhum filme encontrado.</p>';
    return;
  }

  movies.forEach((movie) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('col-md-4', 'mb-3');

    const poster = movie.poster_path
      ? `<img src="${imageBaseUrl}${movie.poster_path}" class="img-fluid rounded" alt="${movie.title}">`
      : '<p>Sem imagem disponível</p>';

    movieCard.innerHTML = `
      <div class="card h-100">
        ${poster}
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">${movie.overview || 'Sem descrição disponível.'}</p>
        </div>
      </div>
    `;

    resultsContainer.appendChild(movieCard);
  });
}

// Evento para realizar a pesquisa ao clicar no botão
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
  }
});

// Evento para realizar a pesquisa ao pressionar "Enter"
searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) {
      searchMovies(query);
    }
  }
});
