"use client";
import { useState, useRef, useEffect } from "react";
import { useDebounce } from "use-debounce";
import  Modal  from "./modal";
import CameraModal from "./camera-modal";

const MemeGenerator = () => {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [memeImage, setMemeImage] = useState<string>();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [modalCamera, setModalCamera] = useState(false);

  const [ debounceTopText ] = useDebounce(topText, 500);
  const [ debounceBottomText ] = useDebounce(bottomText, 500);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setMemeImage(e.target?.result as string)
      };
      reader.readAsDataURL(file);
    }
  };

  const drawMeme = () => {
    if (!uploadedImage) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      const image = new Image();
      image.src = uploadedImage

      image.onload = () => {
        // size
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw image
        context.drawImage(image, 0, 0);
        
        // Text settings
        context.font = `${image.width * 0.07}px Impact`;
        context.fillStyle = "white";
        context.textAlign = "center";
        context.lineWidth = 4;

        // Text Top
        context.strokeText(topText, canvas.width / 2, image.width * 0.11, (image.width - (image.width * 0.1)));
        context.fillText(topText, canvas.width / 2, image.width * 0.11, (image.width - (image.width * 0.1)));

        // Text Bottom
        context.strokeText(bottomText, canvas.width / 2, canvas.height - image.width * 0.06, (image.width - (image.width * 0.1)));
        context.fillText(bottomText, canvas.width / 2, canvas.height - image.width * 0.06, (image.width - (image.width * 0.1)));
      
        const memeData = canvasRef.current?.toDataURL('image/png');
        setMemeImage(memeData);
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
  
  useEffect(() => {
    drawMeme()
  }, [debounceTopText, debounceBottomText, uploadedImage])

  return (
    <>
      <CameraModal
        isOpen={modalCamera}
        onClose={setModalCamera}
        setPhoto={setUploadedImage}
      />
          
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-3xl font-bold">
          Gerador de Memes
        </h1>

        <div className="flex justify-center items-center gap-2">
          <div>
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded text-center  inline-block"
            >
              {uploadedImage ? 'Alterar imagem' : 'Escolha uma imagem'}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <button onClick={() => setModalCamera(true)} className="px-4 py-2 bg-blue-500 text-white rounded text-center">
            {uploadedImage ? 'Tirar outra foto' : 'Tirar foto'}
          </button>
        </div>
        {memeImage && (
          <>
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                placeholder="Texto superior"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Texto inferior"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                className="p-2 border rounded"
              />
            </div>

            <button
              onClick={downloadMeme}
              disabled={!uploadedImage}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Baixar Meme
            </button>
          </>
        )}
      
        <canvas ref={canvasRef} className="hidden" />
        {memeImage && <img src={memeImage} className="max-h-96" />}
      </div>
    </>
  );
};

export default MemeGenerator;
