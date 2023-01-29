import { ChangeEvent, ReactElement, createContext, useContext, useEffect, useState } from "react";

import * as StackBlur from 'stackblur-canvas';

import DefaultImage from '../assets/screenshot.png';
import { selectSystemNameInput } from "../utils/SelectInput";

export interface CanvasContentProps {
  normal: string;
  blurred: string;
}

interface CanvasContextData {
  currentSystemImage: {
    name: string;
    extension: string;
    content: string;
  }

  canvasContent: CanvasContentProps;
  canvasWidth: number;
  canvasHeight: number;
  blurAmount: number;

  integerScale: boolean;

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

  const [canvasWidth, setCanvasWidth] = useState(480);
  const [canvasHeight, setCanvasHeight] = useState(320);
  const [canvasContent, setCanvasContent] = useState({} as CanvasContentProps);
  const [currentSystemImage, setCurrentSystemImage] = useState({ name: "Load File", extension: "", content: DefaultImage });
  const [blurAmount, setBlurAmount] = useState(10);
  const [integerScale, setIntegerScale] = useState(true);

  function updateBlur(blur: number) {
    if (0 <= blur && blur <= 180) {
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
          setCurrentSystemImage({ name: fileName, extension: fileExtension, content: canvas.toDataURL("image/png", 1) })
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


      function getScaleFactor(number: number, compare: number) {
        return Math.ceil(compare / number);
      }

      const integerScaleValue = Math.max(getScaleFactor(image.height, canvasHeight), getScaleFactor(image.width, canvasWidth))

      const imageWidthW = image.width * integerScaleValue;
      const imageHeightW = image.height * integerScaleValue;

      context!.clearRect(0, 0, canvasWidth, canvasHeight);

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      context!.imageSmoothingEnabled = false;

      if (canvasWidth / canvasHeight > image.width / image.height) {
        context!.drawImage(image, -(imageWidthW - canvasWidth) / 2, -(imageHeightW - canvasHeight) / 2, imageWidthW, imageHeightW);
        normal = canvas.toDataURL("image/jpg", 1);
      } else {
        context!.drawImage(image, -(imageWidthW - canvasWidth) / 2, -(imageHeightW - canvasHeight) / 2, imageWidthW, imageHeightW);
        normal = canvas.toDataURL("image/jpg", 1);
      }

      StackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, blurAmount);

      blurred = canvas.toDataURL("image/jpg", 1);

      setCanvasContent({ normal, blurred });
    }

  }

  useEffect(() => {
    handleFile();
    console.log(canvasContent)

  }, [canvasWidth, canvasHeight, currentSystemImage.content, blurAmount])

  return (
    <CanvasContext.Provider value={{ canvasContent, currentSystemImage, canvasWidth, canvasHeight, blurAmount, integerScale, updateBlur, updateImage, updateSizes, invertSizes, handleFile }}>
      {children}
    </CanvasContext.Provider>
  )
}

export function useCanvas() {
  const context = useContext(CanvasContext);

  return context;
}