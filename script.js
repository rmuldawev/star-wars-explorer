const API_BASE_URL = "https://www.swapi.tech/api";




//fetch characters with pagination

//CONSTS
let currentPage = 1;
let totalPages = 1;
let isLoading = false
let charactersRequestId = 0;
let lastCharactersRequest = null;


function showLoader(container, message = "Loading...") {
    if (!container) {
        return;
    }

    container.innerHTML = `
        <p class="loader">${message}</p>
    `;
}

function hideLoader(container) {
    const load = container?.querySelector(".loader");

    if (load) {
        load.remove();
    }
}

function showError(container, message, retryCallback) {
    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <button class="retry-button">Retry</button>
        </div>
    `;

    const retryButton = container.querySelector(".retry-button");

    retryButton.addEventListener("click", retryCallback);
}


async function getCharacters(page = 1) {


    if (isLoading) {
        return;
    }

    const requestId = ++charactersRequestId;


    lastCharactersRequest = () => getCharacters(page);

    isLoading = true;

    previousButton.disabled = true;
    nextButton.disabled = true;

    const container = document.querySelector("#list-container");

    showLoader(container);

    try {
        const url = `${API_BASE_URL}/people?page=${page}&limit=10`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch characters");
        }

        const data = await response.json();

        if (requestId !== charactersRequestId) {
            return;
        }

        currentPage = page;
        totalPages = data.total_pages;

        const pageInfo = document.querySelector("#page-info");
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        hideLoader(container);

        data.results.forEach(character => {
            const characterElement = document.createElement("div");

            characterElement.innerHTML = `
                <a href="character.html?id=${character.uid}">
                    ${character.name}
                </a>
            `;

            container.appendChild(characterElement);
        });

    } catch (error) {
       console.error(error);

    if (requestId !== charactersRequestId) {
        return;
    }

    showError(
        container,
        "Failed to load characters.",
        lastCharactersRequest
    );

    } finally {
        isLoading = false;

        previousButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }
}

async function searchCharacters(searchQuery) {
    previousButton.hidden = true;
    nextButton.hidden = true;

    const pageInfo = document.querySelector("#page-info");
    const searchInfo = document.querySelector("#search-info");


    pageInfo.textContent = "";
    searchInfo.textContent = "Search results";

    const requestId = ++charactersRequestId;

    const url = `${API_BASE_URL}/people?name=${encodeURIComponent(searchQuery)}`;

    const container = document.querySelector("#list-container");

    lastCharactersRequest = () => searchCharacters(searchQuery);

    showLoader(container, "Searching...");

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to search characters");
        }

        const data = await response.json();

        if (requestId !== charactersRequestId) {
            return;
        }

        const characters = data.result;

        if (characters.length === 0) {
            hideLoader(container);

            container.innerHTML = `
                <p class="no-results">No characters found.</p>
            `;

            return;
        }
        
        hideLoader(container);

        characters.forEach(character => {
            const characterElement = document.createElement("div");

            characterElement.innerHTML = `
                <a href="character.html?id=${character.uid}">
                    ${character.properties.name}
                </a>
            `;

            container.appendChild(characterElement);
        });

    } catch (error) {
        console.error(error);

    if (requestId !== charactersRequestId) {
        return;
    }

    showError(
        container,
        "Failed to search characters.",
        lastCharactersRequest
    );

    }
}

const previousButton = document.querySelector("#previous-page");
const nextButton = document.querySelector("#next-page");

function showPagination() {
    previousButton.style.removeProperty("display");
    nextButton.style.removeProperty("display");

    previousButton.hidden = false;
    nextButton.hidden = false;
}

const searchInput = document.querySelector('input[type="search"]');


let searchTimeout;

if (searchInput) {
    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            const searchQuery = searchInput.value.trim();

           if (searchQuery) {
                searchCharacters(searchQuery);
            } else {
                document.querySelector("#search-info").textContent = "";
                showPagination();

                getCharacters(1);
            }
        }, 400);
    });
}

if (previousButton && nextButton) {
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            getCharacters(currentPage + 1);
        }
    });

    previousButton.addEventListener("click", () => {
        if (currentPage > 1) {
            getCharacters(currentPage - 1);
        }
    });
}

async function getCharacterDetails(id) {
    const container = document.querySelector("#character-container");

    showLoader(container);

    try {
        const response = await fetch(`${API_BASE_URL}/people/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch character");
        }

        const data = await response.json();

        const character = data.result.properties;

        hideLoader(container);

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

        await getCharacterFilms(character.films);

    } catch (error) {
        console.error(error);

        showError(
            container,
            "Failed to load character.",
            () => getCharacterDetails(id)
        );
    }
}

async function getCharacterFilms(filmUrls) {
    const filmsContainer = document.querySelector("#character-films");

    showLoader(filmsContainer, "Loading films...");

    try {
        const films = await Promise.all(
            filmUrls.map(async filmUrl => {
                const response = await fetch(filmUrl);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch film: ${response.status}`
                    );
                }

                const data = await response.json();

                return data.result;
            })
        );

        hideLoader(filmsContainer);

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

    } catch (error) {
        console.error(error);

        showError(
            filmsContainer,
            "Failed to load films.",
            () => getCharacterFilms(filmUrls)
        );
    }
}

async function getFilmDetails(id) {
    const container = document.querySelector("#film-container");

    showLoader(container);

    try {
        const response = await fetch(`${API_BASE_URL}/films/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch film");
        }

        const data = await response.json();

        const film = data.result.properties;

        hideLoader(container);

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

        await getFilmCharacters(film.characters);

    } catch (error) {
        console.error(error);

        showError(
            container,
            "Failed to load film.",
            () => getFilmDetails(id)
        );
    }
}


async function getFilmCharacters(characterUrls) {
    const container = document.querySelector("#film-characters");

    showLoader(container, "Loading characters...");

    try {
        container.innerHTML = `
            <h3>Characters</h3>
            <div id="characters-list"></div>
            <p class="loader">Loading characters...</p>
        `;

        const charactersList = container.querySelector("#characters-list");
        const loader = container.querySelector(".loader");

        const failedUrls = [];

        for (const characterUrl of characterUrls) {
            try {
                const response = await fetch(characterUrl);

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch character: ${response.status}`
                    );
                }

                const data = await response.json();
                const character = data.result;

                const characterElement = document.createElement("p");

                characterElement.innerHTML = `
                    <a href="character.html?id=${character.uid}">
                        ${character.properties.name}
                    </a>
                `;

                charactersList.appendChild(characterElement);

            } catch (error) {
                console.error(error);

                showError(
                    container,
                    "Failed to load characters.",
                    () => getFilmCharacters(characterUrls)
                );;
            }
        }

        loader.remove();

        if (failedUrls.length > 0) {
            const errorContainer = document.createElement("div");

            errorContainer.className = "error-message";

            errorContainer.innerHTML = `
                <p>
                    Failed to load ${failedUrls.length}
                    character${failedUrls.length === 1 ? "" : "s"}.
                </p>

                <button class="retry-button">
                    Retry
                </button>
            `;

            container.appendChild(errorContainer);

            const retryButton =
                errorContainer.querySelector(".retry-button");

            retryButton.addEventListener("click", () => {
                errorContainer.remove();

                getFilmCharacters(failedUrls);
            });
        }

    } catch (error) {
        console.error(error);
    }
}

async function getFilms() {
    const container = document.querySelector("#films-container");

    showLoader(container);

    try {
        const response = await fetch(`${API_BASE_URL}/films`);

        if (!response.ok) {
            throw new Error("Failed to fetch films");
        }

        const data = await response.json();

        hideLoader(container);

        data.result.forEach(film => {
            const filmElement = document.createElement("div");

            filmElement.innerHTML = `
                <a href="film.html?id=${film.uid}">
                    <span>Episode: ${film.properties.episode_id}</span>
                    <span>${film.properties.title}</span>
                </a>
            `;

            container.appendChild(filmElement);
        });

    } catch (error) {
        console.error(error);

        showError(
            container,
            "Failed to load films.",
            getFilms
        );
    }
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");


window.addEventListener("pageshow", event => {
    if (!event.persisted || !searchInput) {
        return;
    }

    searchInput.value = "";
    document.querySelector("#search-info").textContent = "";
    document.querySelector("#page-info").textContent = "";

    showPagination();

    const container = document.querySelector("#list-container");

    if (container) {
        container.innerHTML = "";
    }

    getCharacters(1);
});




if (document.querySelector("#films-container")) {
    getFilms();
} else if (document.querySelector("#film-container")) {
    getFilmDetails(id);
} else if (id) {
    getCharacterDetails(id);
} else {
    searchInput.value = "";
    getCharacters();
}