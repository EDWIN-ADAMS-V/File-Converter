const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("upload-area");
const convertBtn = document.getElementById("convertBtn");
const formatSelect = document.getElementById("formatSelect");
const statusMessage = document.getElementById("statusMessage");
const downloadSection = document.getElementById("downloadSection");
const downloadLink = document.getElementById("downloadLink");

document.querySelector(".browse-btn").addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    statusMessage.textContent = `Selected: ${fileInput.files[0].name}`;
    downloadSection.style.display = "none";
  }
});

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = "#ddeeff";
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.style.backgroundColor = "#f9f9f9";
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.style.backgroundColor = "#f9f9f9";

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    fileInput.files = files;
    statusMessage.textContent = `Dropped: ${files[0].name}`;
    downloadSection.style.display = "none";
  }
});

convertBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  const format = formatSelect.value;

  if (!file) {
    alert("Please upload a file first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("format", format);

  statusMessage.textContent = "⏳ Converting...";
  downloadSection.style.display = "none";

  try {
    const res = await fetch("/convert", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Conversion failed.");
    }

    const blob = await res.blob();
    const downloadUrl = URL.createObjectURL(blob);

    downloadLink.href = downloadUrl;
    downloadLink.download = `${file.name.split('.')[0]}.${format}`;
    downloadSection.style.display = "block";

    statusMessage.textContent = "✅ Conversion successful! Download below.";
  } catch (error) {
    console.error("❌ Error:", error);
    statusMessage.textContent = "❌ Conversion failed. Check server log.";
  }
});
