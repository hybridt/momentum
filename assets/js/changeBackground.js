const sliderLeftBtn = document.querySelector('.button_arrowL');
const sliderRightBtn = document.querySelector('.button_arrowR');
const defaultImageSource = 'github';
const unsplashApiKey = 'A4_Qv3bbj5LP1aqVPKSuRSg_6AKHaG0j_wJg2yk6NIw';
const flickrApiKey = '4cd24e9468822644876b9c212daf9034';
const image = new Image();
let timeDay = getTimeOfDay();
let imageNumber = getRandomImageNumber();

function updateBackgroundByTime() {
  const updatedTimeOfDay = getTimeOfDay();
  if (timeDay !== updatedTimeOfDay) {
    timeDay = updatedTimeOfDay;
    imageNumber = getRandomImageNumber();
    getImage();
    setBackground();
  }
  setTimeout(updateBackgroundByTime, 1000);
}

function getRandomImageNumber() {
  const min = 1;
  const max = 20;
  return Math.floor(Math.random() * (max - min) + min);
}

async function getImage() {
  const imageSource = localStorage.getItem('background') ?? defaultImageSource;
  if (imageSource === 'github') {
    imageNumber = imageNumber.toString().padStart(2, '0');
    image.src = `assets/img/gallery/${timeDay}/${imageNumber}.jpg`;
  } else {
    getImageFromApi(imageSource);
  }
}

async function getImageFromApi(apiName) {
  let url;
  if (apiName === 'unsplash') {
    url = `https://api.unsplash.com/photos/random/?query=${timeDay}&client_id=${unsplashApiKey}&count=1&orientation=landscape`;
  }
  if (apiName === 'flickr') {
    url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrApiKey}&tags=nature&extras=url_h&per_page=1&page=${imageNumber}&format=json&nojsoncallback=1`;
  }
  const response = await fetch(url);
  if (response.ok) {
    const imageData = await response.json();
    let imageUrl;
    if (apiName === 'unsplash') imageUrl = imageData[0].urls.raw + '&h=1080&q=50&fm=webp';
    if (apiName === 'flickr') imageUrl = imageData.photos.photo[0].url_h;
    image.src = imageUrl;
  } else {
    localStorage.setItem('background', 'github');
    getImage();
  }
}


function setBackground() {
  image.addEventListener('load', () => {
    document.body.style.backgroundImage = `url(${image.src})`
  })
}

function choosePrevImage() {
  imageNumber--;
  if (imageNumber === 0) imageNumber = 20;
  getImage();
  setBackground();
}

function chooseNextImage() {
  imageNumber = imageNumber % 20 + 1;
  getImage();
  setBackground();
}

sliderLeftBtn.addEventListener('click', choosePrevImage);
sliderRightBtn.addEventListener('click', chooseNextImage);

getImage();
setBackground();
updateBackgroundByTime();