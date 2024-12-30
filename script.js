// DOM
const generateForm = document.querySelector(".main-form");
const imgGallery = document.querySelector(".image-section");

//API
const OPENAI_API_KEY = "";

// Function to Update Img Card
const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imgGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadButton = imgCard.querySelector(".download-btn");

    // Set the image source to the AI genearted image data
    const aiGeneratingImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratingImg;

    // When the image is loaded, remove the loading class
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadButton.setAttribute("href", aiGeneratingImg);
      downloadButton.setAttribute("download", `${new Date().getTime()}.jpg`);
    };
  });
};

// Function to Generate Ai Images
const generateAiImages = async (userPrompt, userImgQuantity) => {
  // Sends request to the Open Ai to generate Images
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userPrompt,
          n: parseInt(userImgQuantity),
          size: "512x512",
          response_format: "b64_json",
        }),
      }
    );

    if (!response.ok)
      throw new Error("Failed to generate Img. Please try Again.");

    const { data } = await response.json();
    updateImageCard([...data]);
  } catch (error) {
    alert(error.message);
  }
};

// Function to Handle Form Submission
const handleFormSubmission = (e) => {
  e.preventDefault();

  //   Get Users input and img quantity values
  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = e.srcElement[1].value;

  // Creating img html with loading state
  const imgCardHtml = Array.from(
    { length: userImgQuantity },
    () =>
      `   <div class="img-card loading">
        <img src="Images/loader.svg" alt="img" />
        <a href="#" class="download-btn">
          <img src="Images/download.svg" alt="img" />
        </a>
      </div>`
  ).join("");

  imgGallery.innerHTML = imgCardHtml;
  generateAiImages(userPrompt, userImgQuantity);
};

// Adding Event Listener to Generate form
generateForm.addEventListener("submit", handleFormSubmission);
