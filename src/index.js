import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import { fetchPictures } from "./js/fetch-pictures"

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('input');
const galleryEl = document.querySelector('.gallery')
const loadMoreBtn = document.querySelector('.load-more')
const endCollectionEl = document.querySelector('.end-collection')

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
  
let currentPage;
let currentHits;
let inputQuery = '';

formEl.addEventListener('submit', getPictures);


async function getPictures(e) {

  try {

    e.preventDefault();
    
    clearMarkup();
    onSearchClick();

    inputQuery = inputEl.value.trim();
    const response = await fetchPictures(inputQuery, currentPage);
       
    if (inputQuery === '') {
      clearMarkup();
      onInfoMessage("Please enter a word to start search");
      return;
    }
    
    if (response.hits.length === 0) {
      onFailureMessage("Sorry, there are no images matching your search query. Please try again.");
      return;
    }
    
    onSuccessMessage(`Hooray! We found ${response.totalHits} images.`);
    
    incertCardContent(response.hits);
    lightbox.refresh();
    onSmoothScroll();
  
    currentHits += response.hits.length;

    if (currentHits < response.totalHits) {
      loadMoreBtn.classList.remove('is-hidden');
    }
       
    
  } catch (error) {
        console.error(error);
  }
  
}


function createCardMarkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return `<div class="photo-card">
  <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`;
  
}



function generatePictureCard(array) {
return array.reduce((acc, item) => acc + createCardMarkup(item), "");
    
  }

  function incertCardContent (array) {

    const result = generatePictureCard(array);
    // console.log(result);
    galleryEl.insertAdjacentHTML('beforeend', result);
}

function clearMarkup() {
  return galleryEl.innerHTML = '';
}

function onSearchClick() {
  loadMoreBtn.classList.add('is-hidden');
  endCollectionEl.classList.add('is-hidden');
    currentPage = 1;
    currentHits = 0;
}

loadMoreBtn.addEventListener('click', onLoadMore)

async function onLoadMore() {
  currentPage += 1; 
  const response = await fetchPictures(inputQuery, currentPage);

  currentHits += response.hits.length;
        
  incertCardContent(response.hits);
  lightbox.refresh();
  onSmoothScroll();

  if (currentHits >= response.totalHits) {
    loadMoreBtn.classList.add('is-hidden');
    endCollectionEl.classList.remove('is-hidden');
  }
}

function onSuccessMessage(message) {
  Notiflix.Notify.success(message)
}

function onFailureMessage(message) {
  Notiflix.Notify.failure(message)
}

function onInfoMessage(message) {
  Notiflix.Notify.info(message)
}

function onSmoothScroll() {
  const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
}
