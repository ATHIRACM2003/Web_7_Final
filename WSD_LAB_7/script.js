const baseURL = "https://athiracm2003.github.io/WEB_BOOKS/books.json";
let booklist = [];
let currentPage = 1;
const booksPerPage = 4;
let filteredBooks = [];

window.onload = () => {
    const fetchButton = document.getElementById("fetchButton");
    fetchButton.addEventListener('click', fetchBooks);

    const filterAuthor = document.getElementById("filterAuthor");
    const filterGenre = document.getElementById("filterGenre");
    const sortCriteria = document.getElementById("sortCriteria");

    filterAuthor.addEventListener('input', applyFilters);
    filterGenre.addEventListener('input', applyFilters);
    sortCriteria.addEventListener('change', applyFilters);
}

async function fetchBooks() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("error").style.display = "none";
    
    try {
        const response = await fetch(baseURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        booklist = data;
        filteredBooks = booklist;
        console.log(booklist);
        document.getElementById("loading").style.display = "none";
        displayBooks();
        displayPagination();
    } catch (err) {
        console.error('Failed to fetch books: ', err);
        document.getElementById("loading").style.display = "none";
        document.getElementById("error").innerHTML = "Failed to load data. Please try again later.";
        document.getElementById("error").style.display = "block";
    }
}

function displayBooks() {
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToDisplay = filteredBooks.slice(startIndex, endIndex);

    const bookListElement = document.getElementById("booklist");
    bookListElement.innerHTML = "";

    if (booksToDisplay.length === 0) {
        bookListElement.innerHTML = "<p>No books available for the selected filters.</p>";
        return;
    }

    booksToDisplay.forEach(book => {
        const newBook = document.createElement('div');
        newBook.className = "single-book";

        const bookInfo = document.createElement('div');
        bookInfo.className = "book-info";

        const title = document.createElement('div');
        title.className = "book-title";
        title.innerHTML = book.title;

        const author = document.createElement('div');
        author.className = "book-author";
        author.innerHTML = "Author: " + book.author;

        const genre = document.createElement('div');
        genre.className = "book-genre";
        genre.innerHTML = "Genre: " + book.genre;

        const cost = document.createElement('div');
        cost.className = "book-cost";
        cost.innerHTML = "Cost: $" + book.cost;

        const desc = document.createElement('div');
        desc.className = "book-desc";
        desc.innerHTML = book.description;

        bookInfo.appendChild(title);
        bookInfo.appendChild(author);
        bookInfo.appendChild(genre);
        bookInfo.appendChild(cost);
        bookInfo.appendChild(desc);

        newBook.appendChild(bookInfo);
        bookListElement.appendChild(newBook);
    });
}

function displayPagination() {
    const paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = "";

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerHTML = i;
        pageButton.className = "page-button";
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayBooks();
            displayPagination();
        });
        paginationElement.appendChild(pageButton);
    }
}

function applyFilters() {
    const authorFilter = document.getElementById("filterAuthor").value.toLowerCase();
    const genreFilter = document.getElementById("filterGenre").value.toLowerCase();
    const sortCriteria = document.getElementById("sortCriteria").value;

    filteredBooks = booklist.filter(book => {
        const authorMatch = authorFilter ? book.author.toLowerCase().includes(authorFilter) : true;
        const genreMatch = genreFilter ? book.genre.toLowerCase().includes(genreFilter) : true;
        return authorMatch && genreMatch;
    });

    if (sortCriteria) {
        filteredBooks.sort((a, b) => {
            if (sortCriteria === "title") {
                return a.title.localeCompare(b.title);
            } else if (sortCriteria === "year") {
                return a.year - b.year; 
            } else if (sortCriteria === "cost") {
                return a.cost - b.cost;
            }
        });
    }

    currentPage = 1;
    displayBooks();
    displayPagination();
}
