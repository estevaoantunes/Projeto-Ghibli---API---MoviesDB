// Função para obter o ID do filme da URL
function getMovieIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Função para buscar detalhes do filme
async function fetchMovieDetails() {
    const movieId = getMovieIdFromUrl();
    if (!movieId) {
        document.getElementById('detalhes-filme').innerHTML = '<p>Erro: ID do filme não encontrado.</p>';
        return;
    }

    const apiKey = 'ffb99355af85e18eb52c71cd4e416c7f';
    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Atualizar o HTML com os detalhes do filme
        document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        document.getElementById('movie-title').innerText = data.title;
        document.getElementById('movie-overview').innerText = data.overview || 'Sinopse não disponível.';
        document.getElementById('release-date').innerText = data.release_date || 'Data não informada';
        document.getElementById('movie-rating').innerText = data.vote_average || 'Sem avaliação';

    } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
        document.getElementById('detalhes-filme').innerHTML = '<p>Erro ao carregar detalhes do filme.</p>';
    }
}

// Função para buscar elenco
async function fetchMovieCast() {
    const movieId = getMovieIdFromUrl();
    const apiKey = 'ffb99355af85e18eb52c71cd4e416c7f';
    const castUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=pt-BR`;

    try {
        const response = await fetch(castUrl);
        const data = await response.json();

        const castContainer = document.getElementById('cast-container');
        castContainer.innerHTML = ''; // Limpa o container antes de adicionar novos dados

        data.cast.slice(0, 6).forEach(actor => {
            const col = document.createElement('div');
            col.className = 'col-md-2 text-center';
            col.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" 
                     class="img-fluid rounded-circle shadow-sm mb-2" 
                     alt="${actor.name}">
                <p>${actor.name}</p>
            `;
            castContainer.appendChild(col);
        });
    } catch (error) {
        console.error('Erro ao buscar elenco:', error);
    }
}

// Função para salvar nos favoritos
function saveToFavorites() {
    const movieId = getMovieIdFromUrl();
    const title = document.getElementById('movie-title').innerText;
    const favorites = JSON.parse(localStorage.getItem('favoritos')) || [];

    if (!favorites.some(f => f.id === movieId)) {
        favorites.push({ id: movieId, title });
        localStorage.setItem('favoritos', JSON.stringify(favorites));
        alert(`${title} foi adicionado aos favoritos!`);
    } else {
        alert(`${title} já está nos favoritos.`);
    }
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    fetchMovieDetails();
    fetchMovieCast();

    document.getElementById('save-favorite').addEventListener('click', saveToFavorites);
});
