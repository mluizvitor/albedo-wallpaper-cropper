import { ChangeEvent, ReactElement, createContext, useContext, useEffect, useState } from "react";

import * as StackBlur from "stackblur-canvas";

import DefaultImage from "../assets/screenshot.png";
import { selectSystemNameInput } from "../utils/SelectInput";

export interface CanvasContentProps {
  normal: string;
  blurred: string;
}

interface FileProps {
  name: string;
  content: string;
}

interface CanvasContextData {
  currentLoadedImage: string;
  currentLoadedFileName: string;

  canvasContent: CanvasContentProps;
  canvasWidth: number;
  canvasHeight: number;
  integerScaleValue: number;
  blurAmount: number;
  integerScale: boolean;
  showBlur: boolean;

  updateIntegerScale: (scale: number) => void;
  updateBlur: (blur: number) => void;
  updateTimestamp: () => void;
  toggleImageBlur: () => void;
  toggleIntegerScale: () => void;
  updateImage: (event: ChangeEvent<HTMLInputElement>) => void;
  updateSizes: (width: number, height: number) => void;
  invertSizes: () => void;

  updateCanvas: () => void;
}

interface CanvasProviderProps {
  children: ReactElement
}

const CanvasContext = createContext<CanvasContextData>({} as CanvasContextData);

export function CanvasProvider({ children }: CanvasProviderProps) {

  const [canvasWidth, setCanvasWidth] = useState(480);
  const [canvasHeight, setCanvasHeight] = useState(320);
  const [canvasContent, setCanvasContent] = useState({} as CanvasContentProps);
  const [currentLoadedImage, setCurrentLoadedImage] = useState(DefaultImage);
  const [currentLoadedFileName, setCurrentLoadedFileName] = useState("");
  const [currentLoadedFileType, setCurrentLoadedFileType] = useState("");
  const [blurAmount, setBlurAmount] = useState(10);
  const [integerScale, setIntegerScale] = useState(false);
  const [integerScaleValue, setIntegerScaleValue] = useState(1);
  const [showBlur, setShowBlur] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date);

  function updateBlur(blur: number) {
    if (0 <= blur && blur <= 180) {
      setBlurAmount(blur)
    }
  }

  function updateIntegerScale(scale: number) {
    if (scale >= 0.05 && scale <= 12) {
      setIntegerScaleValue(scale);
    } else {
      return null;
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

    updateTimestamp()
  }

  function updateTimestamp() {
    setTimestamp(new Date());
  }

  function invertSizes() {
    const newWidth = canvasHeight;
    const newHeight = canvasWidth;

    setCanvasWidth(newWidth);
    setCanvasHeight(newHeight);
  }

  document.addEventListener("paste", async (event: any) => {
    event.preventDefault();

    for (const clipboardItem of event.clipboardData.files) {
      if (clipboardItem.type.startsWith("image/")) {
        const reader = new FileReader;

        await reader.readAsDataURL(clipboardItem);

        reader.onload = (e) => {
          const image = new Image();

          image.onload = () => {
            const canvas = document.createElement("canvas");
            const context = canvas?.getContext("2d")

            if (!context) {
              return null;
            }

            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);

            setCurrentLoadedImage(canvas.toDataURL())
            setCurrentLoadedFileName("From clipboard");

          }
          image.src = e.target?.result as string;
        }
      }
    }
  });


  async function updateImage(event: ChangeEvent<HTMLInputElement>) {
    const data = event.currentTarget.files;

    if (data) {
      const file = data[0];
      const fileName = file.name;

      const reader = new FileReader();
      await reader.readAsDataURL(file);

      reader.onloadend = (e) => {
        let image = new Image();

        image.onload = () => {
          const canvas = document.createElement("canvas") as HTMLCanvasElement;
          if (!canvas) {
            return null;
          }

          const context = canvas.getContext("2d");
          if (!context) {
            return null;
          }

          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);

          setCurrentLoadedImage(canvas.toDataURL(file.type));
          setCurrentLoadedFileName(fileName);
          setCurrentLoadedFileType(file.type)
        }

        image.src = e.target?.result as string;
      }

      selectSystemNameInput("systemName")
    }
  }

  function updateCanvas() {
    const originalCanvas = document.getElementById("canvasNormal") as HTMLCanvasElement;

    if (!originalCanvas) {
      return;
    }

    const newNormalCanvas = document.createElement("canvas");
    newNormalCanvas.width = originalCanvas.width
    newNormalCanvas.height = originalCanvas.height

    const newNormalContext = newNormalCanvas.getContext("2d", { willReadFrequently: true })
    newNormalContext!.drawImage(originalCanvas, 0, 0)


    const newBlurredCanvas = document.createElement("canvas");
    newBlurredCanvas.width = originalCanvas.width
    newBlurredCanvas.height = originalCanvas.height

    const newBlurredContext = newBlurredCanvas.getContext("2d", { willReadFrequently: true })
    newBlurredContext!.drawImage(originalCanvas, 0, 0)

    let normal = originalCanvas.toDataURL("image/jpeg", 0.9)
    // .replace("image/jpeg", "image/octet-stream");

    StackBlur.canvasRGBA(newBlurredCanvas, 0, 0, newBlurredCanvas.width, newBlurredCanvas.height, blurAmount);

    let blurred = newBlurredCanvas.toDataURL("image/jpeg", 9)
    // .replace("image/jpeg", "image/octet-stream");

    setCanvasContent({ normal, blurred });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateCanvas();
    }, 500)

    return () => clearTimeout(timeout)

  }, [currentLoadedImage, blurAmount, integerScale, integerScaleValue, timestamp])

  return (
    <CanvasContext.Provider value={{
      blurAmount,
      canvasContent,
      canvasHeight,
      canvasWidth,
      currentLoadedImage,
      currentLoadedFileName,
      integerScale,
      integerScaleValue,
      showBlur,

      updateBlur,
      updateIntegerScale,
      updateCanvas,
      updateTimestamp,
      toggleImageBlur,
      toggleIntegerScale,
      updateImage,
      updateSizes,
      invertSizes,
    }}>
      {children}
    </CanvasContext.Provider>
  )
}

export function useCanvas() {
  const context = useContext(CanvasContext);

  return context;
}