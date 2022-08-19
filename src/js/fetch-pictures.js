const axios = require('axios').default;    
const URL = "https://pixabay.com/api/"
const API_KEY = "29293155-88281a8f727831a2430122fa5"

export async function fetchPictures(inputQuery, page) {
    return await axios.get(`${URL}?key=${API_KEY}&q=${inputQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
        .then(response => response.data)
}    



