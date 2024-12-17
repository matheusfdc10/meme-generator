"use client";
import React, { useState, useRef } from "react";

const templates = [
  {
    name: "Cara Tranquilo",
    url: "https://i.imgflip.com/2wifvo.jpg", // Link de um template famoso
  },
  {
    name: "Outro Meme",
    url: "https://i.imgflip.com/1bij.jpg", // Exemplo de outro template
  },
];

const MemeGenerator = () => {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].url);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawMeme = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      const image = new Image();
      image.src = uploadedImage || selectedTemplate;

      image.onload = () => {
        // Canvas size
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw image
        context.drawImage(image, 0, 0);

        // Text settings
        context.font = "40px Impact";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.lineWidth = 4;
        context.strokeStyle = "black";

        // Top Text
        context.strokeText(topText, canvas.width / 2, 50);
        context.fillText(topText, canvas.width / 2, 50);

        // Bottom Text
        context.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
        context.fillText(bottomText, canvas.width / 2, canvas.height - 20);
      };
    }
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas?.toDataURL("image/png") || "";
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Gerador de Memes</h1>

      {/* Upload de imagem */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {/* Templates */}
      <select
        onChange={(e) => setSelectedTemplate(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        {templates.map((template, index) => (
          <option key={index} value={template.url}>
            {template.name}
          </option>
        ))}
      </select>

      {/* Text Inputs */}
      <div className="flex flex-col space-y-2 mb-4">
        <input
          type="text"
          placeholder="Texto Superior"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Texto Inferior"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="border mb-4"></canvas>

      {/* Botões */}
      <div className="flex space-x-4">
        <button
          onClick={drawMeme}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Gerar Meme
        </button>
        <button
          onClick={downloadMeme}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Baixar Meme
        </button>
      </div>
    </div>
  );
};

export default MemeGenerator;
