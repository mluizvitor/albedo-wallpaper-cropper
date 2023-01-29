import { ChangeEvent, ReactElement, createContext, useContext, useEffect, useState } from "react";

import * as StackBlur from 'stackblur-canvas';

import DefaultImage from '../assets/screenshot.png';
import { selectSystemNameInput } from "../utils/SelectInput";
import { getScaleFactor } from "../utils/GetScaleFactor";

export interface CanvasContentProps {
  normal: string;
  blurred: string;
}

interface FileProps {
  name: string;
  content: string;
}

interface CanvasContextData {
  currentSystemImage: FileProps;

  canvasContent: CanvasContentProps;
  canvasWidth: number;
  canvasHeight: number;
  blurAmount: number;
  integerScale: boolean;
  showBlur: boolean;

  updateBlur: (blur: number) => void;
  toggleImageBlur: () => void;
  toggleIntegerScale: () => void;
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

  const [canvasWidth, setCanvasWidth] = useState(480);
  const [canvasHeight, setCanvasHeight] = useState(320);
  const [canvasContent, setCanvasContent] = useState({} as CanvasContentProps);
  const [currentSystemImage, setCurrentSystemImage] = useState<FileProps>({ name: "", content: DefaultImage });
  const [blurAmount, setBlurAmount] = useState(10);
  const [integerScale, setIntegerScale] = useState(false);
  const [showBlur, setShowBlur] = useState(false);

  function updateBlur(blur: number) {
    if (0 <= blur && blur <= 180) {
      setBlurAmount(blur)
    }
  }

  function toggleImageBlur() {
    setShowBlur(!showBlur);
  }

  function toggleIntegerScale() {
    setIntegerScale(!integerScale)
  }

  function updateSizes(width: number, height: number) {
    if (width >= 0 && width <= 3000) {
      setCanvasWidth(width);
    }
    if (height >= 0 && height <= 3000) {
      setCanvasHeight(height);
    }
  }

  function invertSizes() {
    const newWidth = canvasHeight;
    const newHeight = canvasWidth;

    setCanvasWidth(newWidth);
    setCanvasHeight(newHeight);
  }

  function updateImage(event: ChangeEvent<HTMLInputElement>) {
    const data = event.currentTarget.files;

    if (data) {
      const file = data[0];
      const fileName = file.name;

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
          setCurrentSystemImage({ name: fileName, content: canvas.toDataURL("image/png", 1) })
        }
      }

      selectSystemNameInput("systemName")
    }
  }

  async function handleFile() {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    let normal = "";
    let blurred = "";

    let image = new Image();
    image.src = currentSystemImage.content;
    image.onload = function () {
      const integerScaleValue = Math.max(getScaleFactor(image.height, canvasHeight), getScaleFactor(image.width, canvasWidth))

      console.log(integerScaleValue)

      const imageWidthScaled = image.width * integerScaleValue;
      const imageHeightScaled = image.height * integerScaleValue;

      context!.clearRect(0, 0, canvasWidth, canvasHeight);

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const newImageHeight = (image.width / Number(canvasWidth) * Number(canvasHeight));
      const newImageWidth = (image.height / Number(canvasHeight) * Number(canvasWidth));

      const yPosition = (image.height / 2) - (newImageHeight / 2);
      const xPosition = (image.width / 2) - (newImageWidth / 2);

      if (integerScale) {
        context!.imageSmoothingEnabled = false;

        if (canvasWidth / canvasHeight > image.width / image.height) {
          context!.drawImage(image, -(imageWidthScaled - canvasWidth) / 2, -(imageHeightScaled - canvasHeight) / 2, imageWidthScaled, imageHeightScaled);
          normal = canvas.toDataURL("image/jpg", 1);
        } else {
          context!.drawImage(image, -(imageWidthScaled - canvasWidth) / 2, -(imageHeightScaled - canvasHeight) / 2, imageWidthScaled, imageHeightScaled);
          normal = canvas.toDataURL("image/jpg", 1);
        }
      } else {
        context!.imageSmoothingEnabled = true;

        if (canvasWidth / canvasHeight > image.width / image.height) {
          context!.drawImage(image, 0, yPosition, image.width, newImageHeight, 0, 0, canvasWidth, canvasHeight);
          normal = canvas.toDataURL("image/jpg", 1);
        } else {
          context!.drawImage(image, xPosition, 0, newImageWidth, image.height, 0, 0, canvasWidth, canvasHeight);
          normal = canvas.toDataURL("image/jpg", 1);
        }
      }

      StackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, blurAmount);
      blurred = canvas.toDataURL("image/jpg", 1);

      setCanvasContent({ normal, blurred });
    }
  }

  useEffect(() => {
    const timeOutUpdate = setTimeout(() => {
      handleFile();
    }, 500);

    return () => clearTimeout(timeOutUpdate);

  }, [canvasWidth, canvasHeight, currentSystemImage.content, blurAmount, integerScale])

  return (
    <CanvasContext.Provider value={{
      canvasContent,
      currentSystemImage,
      canvasWidth,
      canvasHeight,
      blurAmount,
      showBlur,
      integerScale,
      updateBlur,
      toggleImageBlur,
      toggleIntegerScale,
      updateImage,
      updateSizes,
      invertSizes,
      handleFile
    }}>
      {children}
    </CanvasContext.Provider>
  )
}

export function useCanvas() {
  const context = useContext(CanvasContext);

  return context;
}