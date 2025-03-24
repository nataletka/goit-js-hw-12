import axios from 'axios';
const API_KEY = '49376461-7308a4eb46f734d3329281beb';

async function getPhoto(searchPhoto, page = 1, per_page = 40) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: searchPhoto,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error loading images:', error);
    return { hits: [] };
  }
}

export default getPhoto;
