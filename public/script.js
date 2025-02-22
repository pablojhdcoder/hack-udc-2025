const dropArea = document.querySelector(".drop-area");
const fileInput = document.querySelector("#fileInput");
const preview = document.querySelector("#preview");
const uploadForm = document.querySelector("#uploadForm");


// Detectar arrastre sobre el área
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.background = "#ddd";
});

// Detectar salida del área
dropArea.addEventListener("dragleave", () => {
    dropArea.style.background = "#fff";
});

// Detectar soltar archivo
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.background = "#fff";
    fileInput.files = e.dataTransfer.files;
    showPreview(fileInput.files);
});

// Cuando se selecciona un archivo manualmente
fileInput.addEventListener("change", () => {
    showPreview(fileInput.files);
});

// Mostrar vista previa
function showPreview(files) {
    preview.innerHTML = "";
    [...files].forEach(file => {
        const fileElement = document.createElement("p");
        fileElement.textContent = file.name;
        preview.appendChild(fileElement);
    });
}

// Enviar archivos al servidor
uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    for (let i = 0; i < fileInput.files.length; i++) {
        formData.append("files", fileInput.files[i]);
    }

    try {
        const response = await fetch("http://localhost:3000/uploads", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Error al subir archivo", error);
    }
});
