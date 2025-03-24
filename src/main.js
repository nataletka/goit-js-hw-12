import getPhoto from './js/pixabay-api';
// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';
import { renderGallery, clearGallery } from './js/render-functions';

const form = document.querySelector('.form');
const input = document.querySelector('input[name = "search-text"]');
const loader = document.querySelector('.loader');
const loadPage = document.querySelector('.btnLoad-more');
const per_page = 15;
let totalPage = 0;
let page = 1;
let query = '';

form.addEventListener('submit', findFoto);
loadPage.addEventListener('click', LoadPage);

async function findFoto(event) {
  event.preventDefault();
  query = input.value.trim();
  if (!query) {
    iziToast.info({
      title: 'Hello',
      message: 'Please enter your query',
    });

    return;
  }
  page = 1;
  loader.classList.remove('hidden');
  clearGallery();
  try {
    const data = await getPhoto(query, page, per_page);
    if (data.hits.length === 0) {
      iziToast.info({
        title: 'Sorry',
        message:
          'There are no images matching your search query. Please try again!',
      });
      return;
    }

    totalPage = Math.ceil(data.totalHits / per_page);
    renderGallery(data.hits);

    loadPage.classList.toggle('hidden', page >= totalPage);
  } catch (error) {
    console.error('Failed to fetch images. Try again later!', error);
  } finally {
    loader.classList.add('hidden');
  }
}
async function LoadPage() {
  if (page >= totalPage) return;

  page += 1;
  loader.classList.remove('hidden');

  try {
    const data = await getPhoto(query, page, per_page);
    renderGallery(data.hits);
    smoothScroll();

    if (page >= totalPage) {
      loadPage.classList.add('hidden');
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    console.error('Failed to fetch more images:', error);
  } finally {
    loader.classList.add('hidden');
  }
}

function smoothScroll() {
  const firstCard = document.querySelector('.gallery-item');
  if (firstCard) {
    const cardHeight = firstCard.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
