const dropZone = document.getElementById("dropZone");
const imageUpload = document.getElementById("imageUpload");
const previewContainer = document.getElementById("previewContainer");

dropZone.addEventListener("click", () => imageUpload.click());

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("bg-gray-200");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("bg-gray-200");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("bg-gray-200");
  const files = Array.from(e.dataTransfer.files);
  handleFiles(files);
});

imageUpload.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  handleFiles(files);
});

function handleFiles(files) {
  files.forEach((file) => {
    previewImage(file);
    readExifData(file);
  });
}

function previewImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const imgDiv = document.createElement("div");
    imgDiv.innerHTML = `<img src="${e.target.result}" alt="Preview" class="max-w-full max-h-64 object-contain mb-2 rounded" id="img-${file.name}" />`;
    previewContainer.appendChild(imgDiv);
  };
  reader.readAsDataURL(file);
}

function readExifData(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const tags = ExifReader.load(e.target.result);
    displayMap(tags, file);
    displayExifData(tags);
    displayRawExif(tags);
  };
  reader.readAsArrayBuffer(file);
}

function displayExifData(exifData) {
  const exifDiv = document.createElement("div");
  exifDiv.classList.add("bg-gray-100", "p-4", "rounded", "shadow-md", "mb-4");
  exifDiv.innerHTML = `<h3 class="font-semibold">EXIF Data</h3>`;
  for (const [key, value] of Object.entries(exifData)) {
    exifDiv.innerHTML += `<div><strong>${key}:</strong> <input type="text" value="${value.description}" data-key="${key}" class="border p-1 rounded w-full"/></div>`;
  }
  previewContainer.appendChild(exifDiv);
}

function displayMap(tags, file) {
  if (tags.GPSLatitude && tags.GPSLongitude) {
    const lat = tags.GPSLatitude.description;
    const lon = tags.GPSLongitude.description;
    const mapDiv = document.createElement("div");
    mapDiv.innerHTML = `<iframe width="100%" height="300" src="https://maps.google.com/maps?q=${lat},${lon}&output=embed"></iframe>`;
    const imgElement = document.getElementById(`img-${file.name}`);
    imgElement.parentNode.appendChild(mapDiv);
  }
}

function displayRawExif(exifData) {
  const rawDiv = document.createElement("div");
  rawDiv.classList.add(
    "bg-gray-200",
    "p-4",
    "rounded",
    "shadow-md",
    "mt-4",
    "overflow-auto"
  );
  rawDiv.innerHTML = `<h3 class="font-semibold">Raw EXIF JSON</h3><pre>${JSON.stringify(
    exifData,
    null,
    2
  )}</pre>`;
  previewContainer.appendChild(rawDiv);
}
