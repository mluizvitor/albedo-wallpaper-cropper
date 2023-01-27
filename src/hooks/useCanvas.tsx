import { ChangeEvent, InputHTMLAttributes, ReactElement, createContext, useContext, useEffect, useState } from "react";

import DefaultImage from '../assets/screenshot.png';

interface SystemProps {
  systemName: string;
  file: string;
}

interface CanvasContextData {
  systemCollection: SystemProps[];

  currentSystemName: string;
  currentSystemImage: {
    name: string;
    extension: string;
    content: string;
  }
  canvasWidth: number;
  canvasHeight: number;
  blurAmount: number;

  addSystemToCollection: () => void;
  removeSystemFromCollection: (systemName: string) => void;

  updateSystemName: (name: string) => void;
  updateBlur: (blur: number) => void;
  updateImage: (event: ChangeEvent<HTMLInputElement>) => void;

  updateSizes: (width: number, height: number) => void;

  invertSizes: () => void;
  handleFile: () => void;
}

interface CanvasProviderProps {
  children: ReactElement
}

const CanvasContext = createContext<CanvasContextData>({} as CanvasContextData);

export function CanvasProvider({ children }: CanvasProviderProps) {

  const [systemCollection, setSystemCollection] = useState<SystemProps[]>([]);

  const [canvasWidth, setCanvasWidth] = useState(480);
  const [canvasHeight, setCanvasHeight] = useState(320);

  const [canvasContent, setCanvasContent] = useState(DefaultImage);

  const [currentSystemName, setCurrentSystemName] = useState("");
  const [currentSystemImage, setCurrentSystemImage] = useState({ name: "Load File", extension: "", content: DefaultImage });

  const [blurAmount, setBlurAmount] = useState(0);

  function updateSystemName(name: string) {
    setCurrentSystemName(name.toLowerCase());
  }

  function updateBlur(blur: number) {
    if (blur >= 0) {
      setBlurAmount(blur)
    }
  }

  function updateSizes(width: number, height: number) {
    width >= 0 && setCanvasWidth(width);
    height >= 0 && setCanvasHeight(height);
  }

  function invertSizes() {
    const newWidth = canvasHeight;
    const newHeight = canvasWidth;

    setCanvasWidth(newWidth);
    setCanvasHeight(newHeight);
  }

  function selectSystemNameInput() {
    const input = document.getElementById("systemName") as HTMLInputElement;

    input.focus()
    input.select()
  }

  function updateImage(event: ChangeEvent<HTMLInputElement>) {
    const data = event.currentTarget.files;

    if (data) {
      const file = data[0];
      const fileName = file.name.substring(0, file.name.lastIndexOf("."));
      const fileExtension = file.type.substring(file.type.lastIndexOf("/") + 1);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = (e) => {
        let image = new Image();
        image.src = e.target?.result as string;

        image.onload = () => {

          const canvas = document.createElement("canvas") as HTMLCanvasElement;
          if (!canvas) {
            return null;
          }

          const context = canvas.getContext('2d');
          if (!context) {
            return null;
          }

          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);
          setCurrentSystemImage({ name: fileName, extension: fileExtension, content: canvas.toDataURL("image/jpg", 0.1) })
        }
      }

      selectSystemNameInput()
    }
  }

  function addSystemToCollection() {
    const currentlyAtCollection = systemCollection.find(item => item.systemName === currentSystemName);
    if (currentlyAtCollection) {
      alert("Already at collection")
      return null;
    }

    if (!currentSystemName) {
      alert("Please insert a system name")
      return null;
    }

    setSystemCollection([...systemCollection, {
      file: canvasContent,
      systemName: currentSystemName
    }])

    selectSystemNameInput()
  }

  function removeSystemFromCollection(systemName: string) {
    const newCollection = [...systemCollection].filter(item => item.systemName !== systemName);

    setSystemCollection(newCollection);
  }

  function handleFile() {
    const canvas = document.getElementById("wallpaperCanvas") as HTMLCanvasElement;
    if (!canvas) {
      return null;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }

    let image = new Image();
    image.onload = function () {

      const imageHeight = (image.width / Number(canvasWidth) * Number(canvasHeight));
      const imageWidth = (image.height / Number(canvasHeight) * Number(canvasWidth));

      const yPosition = (image.height / 2) - (imageHeight / 2);
      const xPosition = (image.width / 2) - (imageWidth / 2);


      context.filter = `blur(${blurAmount * 0.5}px)`;
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      if (canvasWidth / canvasHeight > image.width / image.height) {
        context.drawImage(image, 0, yPosition, image.width, imageHeight, -blurAmount / 2, -blurAmount / 2, (Number(canvasWidth)) + blurAmount, (Number(canvasHeight)) + blurAmount);

        context.globalCompositeOperation = 'destination-over';

        context.filter = "blur(0)";
        context.drawImage(image, 0, yPosition, image.width, imageHeight, 0, 0 / 2, Number(canvasWidth), Number(canvasHeight));

      } else {
        context.drawImage(image, xPosition, 0, imageWidth, image.height, -blurAmount / 2, -blurAmount / 2, (Number(canvasWidth)) + blurAmount, (Number(canvasHeight)) + blurAmount);

        context.globalCompositeOperation = 'destination-over';

        context.filter = "blur(0)";
        context.drawImage(image, xPosition, 0, imageWidth, image.height, 0, 0, Number(canvasWidth), Number(canvasHeight));
      }

      setCanvasContent(canvas.toDataURL("image/jpg", 0.1));
    }

    image.src = currentSystemImage.content;
  }

  useEffect(() => {
    handleFile();

  }, [canvasWidth, canvasHeight, blurAmount, currentSystemImage]);

  return (
    <CanvasContext.Provider value={{ systemCollection, currentSystemName, currentSystemImage, canvasWidth, canvasHeight, blurAmount, addSystemToCollection, removeSystemFromCollection, updateSystemName, updateBlur, updateImage, updateSizes, invertSizes, handleFile }}>
      {children}
    </CanvasContext.Provider>
  )
}

export function useCanvas() {
  const context = useContext(CanvasContext);

  return context;
}