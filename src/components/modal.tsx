import { useEffect, useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
    children: React.ReactNode
}

const Modal = ({
    isOpen =  false,
    onClose,
    children
}: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    if (!isMounted) {
        return null;
    }

    if (isOpen) {
        document.body.classList.add('overflow-hidden')
    } else {
        document.body.classList.remove('overflow-hidden')
    }

    if (!isOpen) return null;

    return (
        <div
            onClick={() => onClose(false)} 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto grid items-center"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full h-auto max-w-lg mx-auto bg-zinc-100 rounded-lg shadow-lg p-8 my-8"
            >
                <button
                    onClick={() => onClose(false)}
                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
                >
                    ✖
                </button>

                <div className="relative">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal;