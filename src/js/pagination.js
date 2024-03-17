import { getTrending } from './api';
import { renderMarkup } from './cardsMarkup';
import { loader } from './searchForm';
import { saveLocalStorage } from './storage';
import { loader } from './searchForm';
const content = document.querySelector('.fetch-cards');
function getTrendingMovies(page) {
  loader.style.display = 'block';
  content.style.display = 'none';

  getTrending(page).then(data => {
    renderMarkup(data);
    saveLocalStorage('moviesData', data.results);
    loader.style.display = 'none';
    content.style.display = 'block';
  });
}
let currentPage = 1;
getTrendingMovies(currentPage);

const nextBtn = document.querySelector('.prev-btn');
const prevBtn = document.querySelector('.next-btn');
const pageNumberContainer = document.querySelector('.page-number');
nextBtn.addEventListener('click', () => {
  currentPage++;
  getTrendingMovies(currentPage);
});
prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    getTrendingMovies(currentPage);
  } else {
    prevBtn.classList.add('disabled');
  }
});

function createPageNumberButton(pageNumber) {
  const button = document.createElement('button');
  button.textContent = pageNumber;
  button.addEventListener('click', () => {
    currentPage = pageNumber;
    getTrendingMovies(currentPage);
    updateActiveButton();
  });
  return button;
}

function updateActiveButton() {
  const buttons = pageNumberContainer.querySelectorAll('button');
  buttons.forEach(button => {
    button.classList.remove('active');
    if (parseInt(button.textContent) === currentPage) {
      button.classList.add('active');
    }
  });
}
updateActiveButton();

const totalItems = 1000;
const itemsPerPage = 20;
const totalPages = Math.ceil(totalItems / itemsPerPage);
function displayPageNumbers(totalPages) {
  pageNumberContainer.innerHTML = '';
  const maxButtonsToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

  if (
    totalPages > maxButtonsToShow &&
    currentPage > Math.floor(maxButtonsToShow / 2)
  ) {
    startPage = Math.min(
      currentPage - Math.floor(maxButtonsToShow / 2),
      totalPages - maxButtonsToShow + 1
    );
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = createPageNumberButton(i);
    pageNumberContainer.appendChild(button);
  }
}

displayPageNumbers(totalPages);
