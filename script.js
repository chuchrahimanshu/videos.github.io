// FETCH YOUTUBE VIDEOS

function getDuration(durationString) {
  let resultString = durationString
    ?.replace("PT", "")
    ?.replace("H", ":")
    ?.replace("M", ":")
    ?.replace("S", "");

  if (!resultString.includes(":")) {
    resultString = `00:${resultString}`;
  }
  return resultString;
}

const cards = document.querySelector("#cards");

function createVideoTemplate(video, channelData) {
  const definition = video.items.contentDetails.definition;
  const duration = video.items.contentDetails.duration;
  const channelTitle = video.items.snippet.channelTitle;
  const title = video.items.snippet.title;
  const thumbnail = video.items.snippet.thumbnails.medium.url;
  const avatar = channelData?.data?.info?.snippet?.thumbnails?.default?.url;

  const card = document.createElement("div");
  card.className = "card";

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";

  const cardThumbnail = document.createElement("img");
  cardThumbnail.className = "card-thumbnail";
  cardThumbnail.src = thumbnail;
  cardThumbnail.alt = "Thumbnail";

  const cardDuration = document.createElement("p");
  cardDuration.className = "card-duration";
  cardDuration.innerText = getDuration(duration);

  const cardDefinition = document.createElement("div");
  cardDefinition.className = "card-definition";

  const cardDefinitionText = document.createElement("p");
  cardDefinitionText.innerText = definition.toUpperCase();

  const cardContent = document.createElement("div");
  cardContent.className = "card-content";

  const cardAvatar = document.createElement("img");
  cardAvatar.className = "card-avatar";
  cardAvatar.src = avatar;
  cardAvatar.alt = "Avatar";

  const cardTitleContainer = document.createElement("div");

  const cardTitle = document.createElement("p");
  cardTitle.className = "card-title";
  cardTitle.innerText = title;

  const cardChannel = document.createElement("p");
  cardChannel.className = "card-channel";
  cardChannel.innerText = `@${channelTitle.toLowerCase().replaceAll(" ", "")}`;

  cardDefinition.append(cardDefinitionText);
  cardHeader.append(cardThumbnail, cardDuration, cardDefinition);
  cardTitleContainer.append(cardTitle, cardChannel);
  cardContent.append(cardAvatar, cardTitleContainer);
  card.append(cardHeader, cardContent);

  card.addEventListener("click", () =>
    window.open(`https://www.youtube.com/watch?v=${video.items.id}`, "_blank")
  );
  return card;
}

async function fetchYoutubeVideos(page, limit) {
  const response = await fetch(
    `https://api.freeapi.app/api/v1/public/youtube/videos?page=${page}&limit=${limit}`
  );
  const channelResponse = await fetch(
    "https://api.freeapi.app/api/v1/public/youtube/channel"
  );
  const data = await response.json();
  const channelData = await channelResponse.json();
  localStorage.setItem("videos", JSON.stringify(data?.data?.data));
  localStorage.setItem("channelData", JSON.stringify(channelData));
  const cardNodes = [];

  data?.data?.data?.forEach((video) => {
    cardNodes.push(createVideoTemplate(video, channelData));
  });
  cards.replaceChildren(...cardNodes);
}
fetchYoutubeVideos(1, 12);

// PAGINATION IMPLEMENTATION
const pageNumber = document.querySelector(".page");
pageNumber.style.backgroundColor = "#222222";

const allPages = document.querySelectorAll(".page");

allPages.forEach((page) => {
  page.addEventListener("click", (event) => {
    fetchYoutubeVideos(event.target.textContent, 12);
    allPages.forEach((item) => (item.style.backgroundColor = "#111111"));
    page.style.backgroundColor = "#222222";
  });
});

// SEARCH FUNCTIONALITY IMPLEMENTATION
const searchInput = document.querySelector("#search-videos");
const searchBtn = document.querySelector("#search-btn");

function filterVideos() {
  const inputText = searchInput.value;
  const videos = JSON.parse(localStorage.getItem("videos"));
  const channelData = JSON.parse(localStorage.getItem("channelData"));
  const videoNodes = [];
  videos.forEach((video) => {
    if (
      video.items.snippet.title.toLowerCase().includes(inputText.toLowerCase())
    ) {
      videoNodes.push(createVideoTemplate(video, channelData));
    }
  });
  cards.replaceChildren(...videoNodes);
  searchInput.value = "";
}

searchBtn.addEventListener("click", filterVideos);
