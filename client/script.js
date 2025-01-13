const dropZone = document.getElementById("dropZone");
const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");

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
  const file = e.dataTransfer.files[0];
  previewImage(file);
  uploadImage(file);
});

imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  previewImage(file);
  uploadImage(file);
});

function previewImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    imagePreview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const response = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  displayExifData(data.exifData, data.filePath);
}

async function saveExifData(filePath, updates) {
  await fetch("http://localhost:3000/update-exif", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filePath, exifUpdates: updates }),
  });
}

function displayExifData(exifData, filePath) {
  const exifDiv = document.getElementById("exifData");
  exifDiv.innerHTML = "";
  for (const [key, value] of Object.entries(exifData)) {
    exifDiv.innerHTML += `<div><strong>${key}:</strong> <input type="text" value="${value}" data-key="${key}" /></div>`;
  }
  document.getElementById("saveExif").onclick = () => {
    const updates = {};
    document.querySelectorAll("#exifData input").forEach((input) => {
      updates[input.dataset.key] = input.value;
    });
    saveExifData(filePath, updates);
  };
}
