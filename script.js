const API_BASE_URL = "https://www.swapi.tech/api";




//fetch characters with pagination

//CONSTS
let currentPage = 1;
let totalPages = 1;

async function getCharacters( page=1 ) {
    currentPage = page;
     const response = await fetch(
        `${API_BASE_URL}/people?page=${page}&limit=10`
    );

    const data = await response.json();
    
    totalPages = data.total_pages;

    previousButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    const pageInfo = document.querySelector("#page-info");
    pageInfo.textContent = `Page ${page} of ${data.total_pages}`;

    const container = document.querySelector("#characters-container");
    container.innerHTML = "";

    data.results.forEach(character => {
        const characterElement = document.createElement("div");

        characterElement.innerHTML = `
            <h3>
                <a href="character.html?id=${character.uid}">
                    ${character.name}
                </a>
            </h3>
            <p>ID: ${character.uid}</p>
        `;

        container.appendChild(characterElement);
    });
}

const previousButton = document.querySelector("#previous-page");
const nextButton = document.querySelector("#next-page");

if (previousButton && nextButton) {
    nextButton.addEventListener("click", () => {
        if(currentPage < totalPages) {
            getCharacters(currentPage + 1);
        }
});
}

if(previousButton && nextButton) {
    previousButton.addEventListener('click', () => {
        if(currentPage > 1) {
            getCharacters(currentPage - 1)
        }
    })
}

async function getCharacterDetails(id) {
    const response = await fetch(`${API_BASE_URL}/people/${id}`);
    const data = await response.json();

    const character = data.result.properties;
    const container = document.querySelector("#character-container");

    container.innerHTML = `
    <h2>${character.name}</h2>

    <p>
        <span class="details-label">Height:</span>
        <span class="details-value">${character.height}</span>
    </p>

    <p>
        <span class="details-label">Mass:</span>
        <span class="details-value">${character.mass}</span>
    </p>

    <p>
        <span class="details-label">Hair color:</span>
        <span class="details-value">${character.hair_color}</span>
    </p>

    <p>
        <span class="details-label">Skin color:</span>
        <span class="details-value">${character.skin_color}</span>
    </p>

    <p>
        <span class="details-label">Eye color:</span>
        <span class="details-value">${character.eye_color}</span>
    </p>

    <p>
        <span class="details-label">Birth year:</span>
        <span class="details-value">${character.birth_year}</span>
    </p>

    <p>
        <span class="details-label">Gender:</span>
        <span class="details-value">${character.gender}</span>
    </p>
`;

    const filmsContainer = document.querySelector("#character-films");

        const films = await Promise.all(
    character.films.map(async filmUrl => {
        const response = await fetch(filmUrl);
        const data = await response.json();

        return data.result;
    })
);

    filmsContainer.innerHTML = "<h3>Films</h3>";

    films.forEach(film => {
        const filmElement = document.createElement("p");

        filmElement.innerHTML = `
            <a href="film.html?id=${film.uid}">
                ${film.properties.title}
            </a>
        `;

        filmsContainer.appendChild(filmElement);
    });
}

async function getFilmDetails(id) {
    const response = await fetch(`${API_BASE_URL}/films/${id}`);
    const data = await response.json();

    const film = data.result.properties;
    const container = document.querySelector("#film-container");

  container.innerHTML = `
    <h2>${film.title}</h2>

    <p>
        <span class="details-label">Episode:</span>
        <span class="details-value">${film.episode_id}</span>
    </p>

    <p>
        <span class="details-label">Director:</span>
        <span class="details-value">${film.director}</span>
    </p>

    <p>
        <span class="details-label">Producer:</span>
        <span class="details-value">${film.producer}</span>
    </p>

    <p>
        <span class="details-label">Release date:</span>
        <span class="details-value">${film.release_date}</span>
    </p>

    <p>
        <span class="details-label">Opening crawl:</span>
        <span class="details-value">${film.opening_crawl}</span>
    </p>
`;

    const charactersContainer = document.querySelector("#film-characters");


    const characters = await Promise.all(
        film.characters.map(async characterUrl => {
            const response = await fetch(characterUrl);
            const data = await response.json();

            return data.result;
        })
    );

    charactersContainer.innerHTML = "<h3>Characters</h3>";

    characters.forEach(character => {
        const characterElement = document.createElement("p");

        characterElement.innerHTML = `
            <a href="character.html?id=${character.uid}">
                ${character.properties.name}
            </a>
        `;

        charactersContainer.appendChild(characterElement);
    });
}

async function getFilms() {
    const response = await fetch(`${API_BASE_URL}/films`);
    const data = await response.json();

    const container = document.querySelector("#films-container");

    data.result.forEach(film => {
        const filmElement = document.createElement("div");

        filmElement.innerHTML = `
            <h3>
                <a href="film.html?id=${film.uid}">
                    ${film.properties.title}
                </a>
            </h3>
            <p>Episode: ${film.properties.episode_id}</p>
        `;

        container.appendChild(filmElement);
    });
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (document.querySelector("#films-container")) {
    getFilms();
} else if (document.querySelector("#film-container")) {
    getFilmDetails(id);
} else if (id) {
    getCharacterDetails(id);
} else {
    getCharacters();
}