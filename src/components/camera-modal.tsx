import { useEffect, useRef, useState } from "react";
import Modal from "./modal";
import Image from "next/image";

interface Props {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
    setPhoto: (photo: string | null) => void
}

const CameraModal = ({
    isOpen = false,
    onClose,
    setPhoto
}: Props) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Funçao para abrir a camera
  useEffect(() => {
    if (isOpen && navigator.mediaDevices) {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                if (stream.active && videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsCameraActive(stream.active)
                }
            })
            .catch((err) => {
                console.error('Erro ao acessar a câmera: ', err);
                stopCamera()
                alert('Você deve permitir acesso a câmera')
            });
    } else {
        stopCamera()
    }
  }, [isOpen])

  // Funçao para capturar a foto
  const capturePhoto = () => {
    if (cameraCanvasRef.current && videoRef.current) {
      const ctx = cameraCanvasRef.current.getContext('2d');
      if (ctx) {
        // Ajusta o canvas para o tamanho do vídeo
        cameraCanvasRef.current.width = videoRef.current.videoWidth;
        cameraCanvasRef.current.height = videoRef.current.videoHeight;

        // Desenha o quadro atual do vídeo no canvas
        ctx.drawImage(videoRef.current, 0, 0, cameraCanvasRef.current.width, cameraCanvasRef.current.height);

        // Converte a imagem para base64 e define como foto
        const imageData = cameraCanvasRef.current.toDataURL('image/png');

        setImage(imageData);
      }
    }
  };

    // Funçao para parar a camera
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        setIsCameraActive(false)
        setImage(null)
        }
        onClose(false)
    };

    // Funçao para selecionar foto
    const selectPhoto = () => {
        if (image) {
            setPhoto(image)
            stopCamera()
        }
    };

    // Funçao para tirar outra foto
    const takeAnotherPhoto = () => {
        setImage(null)
    }

    return (
        <Modal isOpen={isOpen} onClose={stopCamera}>
            <div className="relative flex justify-center items-center text-center">
                {!isCameraActive && <p className="text-center">Carregando...</p>}
                <video ref={videoRef} autoPlay playsInline style={{ display: image || !isCameraActive ? 'none' : 'block'}}/>
                <canvas ref={cameraCanvasRef} className="hidden"></canvas>
                {image && <Image alt="Photo" src={image} width={500} height={500} className="object-contain"  />}
            </div>
            {isCameraActive && (
                <div className="w-full flex justify-end flex-wrap gap-4 mt-4">
                    {image ? (
                        <>
                            <button onClick={takeAnotherPhoto} className="px-4 py-2 bg-green-500 text-white rounded">
                                Tirar outra foto
                            </button>
                            <button onClick={selectPhoto} className="px-4 py-2 bg-green-500 text-white rounded">
                                Selecinar
                            </button>
                        </>
                    ) : (
                        <button onClick={capturePhoto} className="px-4 py-2 bg-green-500 text-white rounded">
                            Tirar foto
                        </button>
                    )}
                </div>
            )}
        </Modal>
    );
}
 
export default CameraModal;