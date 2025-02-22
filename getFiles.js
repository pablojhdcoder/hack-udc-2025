document.addEventListener("DOMContentLoaded", () => {
    // Crear y agregar estilos CSS
    const style = document.createElement("style");
    style.textContent = `
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f4f4f4;
        }

        .upload-container {
            text-align: center;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        .drop-area {
            width: 400px;
            height: 200px;
            border: 2px dashed #bbb;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: 0.3s;
        }

        .drop-area:hover {
            background: #e0e0e0;
        }

        .icon {
            font-size: 50px;
            color: #555;
        }

        input[type="file"] {
            display: none;
        }

        button {
            margin-top: 30px;
            padding: 10px 15px;
            border: none;
            background: #007BFF;
            color: white;
            font-size: 16px;
            cursor: pointer;
            border-radius: 20px;
        }

        button:hover {
            background: #0056b3;
        }

        #preview {
            margin-top: 15px;
        }
    `;
    document.head.appendChild(style);

    // Crear y agregar elementos HTML
    const uploadContainer = document.createElement("div");
    uploadContainer.className = "upload-container";

    const form = document.createElement("form");
    form.id = "uploadForm";

    const label = document.createElement("label");
    label.className = "drop-area";
    label.htmlFor = "fileInput";

    const icon = document.createElement("div");
    icon.className = "icon";
    icon.textContent = "+";

    const instructions = document.createElement("p");
    instructions.textContent = "Arrastra tus archivos aquí o haz clic para seleccionar";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "fileInput";
    fileInput.multiple = true;

    label.appendChild(icon);
    label.appendChild(instructions);
    label.appendChild(fileInput);

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Subir Archivo";

    form.appendChild(label);
    form.appendChild(button);

    const preview = document.createElement("div");
    preview.id = "preview";

    uploadContainer.appendChild(form);
    uploadContainer.appendChild(preview);

    document.body.appendChild(uploadContainer);

    // JavaScript para manejar la subida de archivos
    const dropArea = document.querySelector(".drop-area");

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
    form.addEventListener("submit", async (e) => {
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
});