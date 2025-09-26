// index.js
import * as Carousel from "./Carousel.js"; // Keep your carousel functions


const API_KEY = "live_ny1coITWHsiGzrj1f0lyvgnlGnFPy6pJq9vMuTTIfUTbQb6hIUnOW7ie4wuvO7i5";

// Set Axios defaults
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

// DOM Elements
const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Progress bar function
function updateProgress(event) {
  if (event.total) {
    const percent = (event.loaded / event.total) * 100;
    progressBar.style.width = percent + "%";
  } else {
    progressBar.style.width = "50%";
  }
}

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

// Load breeds and populate select
async function initialLoad() {
  try {
    const res = await axios.get("/breeds");
    const breeds = res.data;

    for (let i = 0; i < breeds.length; i++) {
      const breed = breeds[i];
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
}


    // Automatically load first breed on page load
    if (breeds.length > 0) {
      loadBreedImages(breeds[0].id);
    }

  } catch (err) {
    console.error("Error loading breeds:", err);
  }
}

// Load images for a breed
async function loadBreedImages(breedId) {
  if (!breedId) return;

  try {
    const res = await axios.get("/images/search", {
      params: { breed_ids: breedId, limit: 10 },
      onDownloadProgress: updateProgress
    });

    const images = res.data;

    if (!images.length) {
      console.log("No images found for this breed");
      return;
    }

    // Clear previous carousel items
    Carousel.clear();

    for (let i = 0; i < images.length; i++) {
      const imgObj = images[i];
      const breedInfo = imgObj.breeds[0];
      const item = Carousel.createCarouselItem(imgObj.url, breedInfo ? breedInfo.name : "", imgObj.id);
      Carousel.appendCarousel(item);
    }


    Carousel.start();

    // Display breed info
    infoDump.innerHTML = "";
    if (images.length > 0 && images[0].breeds && images[0].breeds.length > 0) {
      const breed = images[0].breeds[0];

      const infoTitle = document.createElement("h2");
      infoTitle.textContent = breed.name;

      const infoDesc = document.createElement("p");
      infoDesc.textContent = breed.description;

      const infoTemp = document.createElement("p");
      infoTemp.textContent = "Temperament: " + breed.temperament

      const infoLife = document.createElement("p");
      infoLife.textContent = "Life Expectancy (in years): " + breed.life_span;

      infoDump.appendChild(infoTitle);
      infoDump.appendChild(infoDesc);
      infoDump.appendChild(infoTemp);
      infoDump.appendChild(infoLife);
    }

  } catch (err) {
    console.error("Problem receiving images:", err);
  }
}

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

// Event listener for breed selection
breedSelect.addEventListener("change", (event) => {
  loadBreedImages(event.target.value);
});

// Initialize
initialLoad();

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */


// --- Add interceptors here ---
axios.interceptors.request.use(config => {
  console.log("Request started:", config.url);
  return config;
});

axios.interceptors.response.use(response => {
  console.log("Request finished:", response.config.url);
  return response;
});

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */


/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */

// Placeholder favourite function (used in Carousel.js)
export async function favourite(imgId) {
  console.log("Favourited image ID:", imgId);
  // Here you can implement actual API POST/DELETE to /favourites
}
