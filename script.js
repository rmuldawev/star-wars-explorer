const API_BASE_URL = "https://www.swapi.tech/api";

async function getCharacters() {
    const response = await fetch(`${API_BASE_URL}/people`);
    const data = await response.json();

    const container = document.querySelector("#characters-container");

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

async function getCharacterDetails(id) {
    const response = await fetch(`${API_BASE_URL}/people/${id}`);
    const data = await response.json();

    const character = data.result.properties;
    const container = document.querySelector("#character-container");

    container.innerHTML = `
        <h2>${character.name}</h2>
        <p>Height: ${character.height}</p>
        <p>Mass: ${character.mass}</p>
        <p>Hair color: ${character.hair_color}</p>
        <p>Skin color: ${character.skin_color}</p>
        <p>Eye color: ${character.eye_color}</p>
        <p>Birth year: ${character.birth_year}</p>
        <p>Gender: ${character.gender}</p>
    `;

    const filmsContainer = document.querySelector("#character-films");

        filmsContainer.innerHTML = "<h3>Films</h3>";

        for (const filmUrl of character.films) {
            const response = await fetch(filmUrl);
            const data = await response.json();

            const film = data.result.properties;

            const filmElement = document.createElement("p");

            filmElement.innerHTML = `
                <a href="film.html?id=${data.result.uid}">
                    ${film.title}
                </a>
            `;

            filmsContainer.appendChild(filmElement);
        }
}

async function getFilmDetails(id) {
    const response = await fetch(`${API_BASE_URL}/films/${id}`);
    const data = await response.json();

    const film = data.result.properties;
    const container = document.querySelector("#film-container");

    container.innerHTML = `
        <h2>${film.title}</h2>
        <p>Episode: ${film.episode_id}</p>
        <p>Director: ${film.director}</p>
        <p>Producer: ${film.producer}</p>
        <p>Release date: ${film.release_date}</p>
        <p>Opening crawl: ${film.opening_crawl}</p>
    `;

    const charactersContainer = document.querySelector("#film-characters");

    charactersContainer.innerHTML = "<h3>Characters</h3>";

    const characters = await Promise.all(
        film.characters.map(async characterUrl => {
            const response = await fetch(characterUrl);
            const data = await response.json();

            return data.result;
        })
    );

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