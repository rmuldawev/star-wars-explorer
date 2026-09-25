# Star Wars Explorer

Star Wars Explorer is a simple web application that allows users to explore Star Wars characters and films using the SWAPI public API.

## Features

- Browse Star Wars characters
- Search characters by name
- Navigate characters using pagination
- View detailed character information
- View films associated with a character
- Browse Star Wars films
- View detailed film information
- View characters associated with a film
- Navigate between related characters and films
- Loading states for API requests
- Error handling with retry functionality
- Message when a search returns no results

## API

This project uses the [SWAPI](https://www.swapi.tech/) public API.

The application uses the following endpoints:

- `GET /people`
- `GET /people/{id}`
- `GET /films`
- `GET /films/{id}`

## Pages

### Characters

The Characters page allows users to:

- Browse characters with pagination
- Search for characters by name
- Open a character's details

### Character Details

The Character Details page displays information about a character and the films they appear in.

### Films

The Films page displays the available Star Wars films.

### Film Details

The Film Details page displays information about a film and the characters who appear in it.

## Navigation

The application provides navigation between the Characters and Films sections.

Related characters and films are also linked to their corresponding detail pages.

## Technologies

- HTML5
- CSS3
- JavaScript
- SWAPI

## How to Run

This project does not require any dependencies, build tools, or API keys.

1. Clone the repository:

```bash
git clone https://github.com/rmuldawev/star-wars-explorer.git