import { ChangeEvent, ReactElement, createContext, useContext, useEffect, useState } from 'react';
import * as StackBlur from 'stackblur-canvas';
import { useLoader } from './useLoader';

export interface CanvasContentProps {
  normal: string;
  blurred: string;
  thumbnail?: string;
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
  smoothRendering: boolean;


  clearCanvas: () => void;
  invertSizes: () => void;
  updateBlur: (blur: number) => void;
  updateCanvas: () => void;
  updateImage: (event: ChangeEvent<HTMLInputElement>) => void;
  updateImageFromClipboard: (event: ClipboardEvent) => void;
  updateIntegerScale: (scale: number) => void;
  updateSizes: (width: number, height: number) => void;
  toggleImageBlur: () => void;
  toggleIntegerScale: () => void;
  toggleSmoothRendering: () => void;
}

interface CanvasProviderProps {
  children: ReactElement
}

const CanvasContext = createContext<CanvasContextData>({} as CanvasContextData);

export function CanvasProvider({ children }: CanvasProviderProps) {
  const { showLoader, hideLoader } = useLoader();

  const [blurAmount, setBlurAmount] = useState(60);
  const [canvasContent, setCanvasContent] = useState({} as CanvasContentProps);
  const [canvasHeight, setCanvasHeight] = useState(1280);
  const [canvasWidth, setCanvasWidth] = useState(1920);
  const [currentLoadedImage, setCurrentLoadedImage] = useState('');
  const [currentLoadedFileName, setCurrentLoadedFileName] = useState('');
  const [integerScale, setIntegerScale] = useState(false);
  const [integerScaleValue, setIntegerScaleValue] = useState(1);
  const [showBlur, setShowBlur] = useState(false);
  const [smoothRendering, setSmoothRendering] = useState(true);

  function updateBlur(blur: number) {
    if (0 <= blur && blur <= 180) {
      setBlurAmount(blur);
    }
  }

  function toggleSmoothRendering() {
    setSmoothRendering(!smoothRendering);
  }

  function updateIntegerScale(scale: number) {
    if (scale >= 1 && scale <= 32) {
      setIntegerScaleValue(scale);
    } else {
      return null;
    }
  }

  function toggleImageBlur() {
    setShowBlur(!showBlur);
  }

  function toggleIntegerScale() {
    setIntegerScale(!integerScale);
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

  function updateImageFromClipboard(event: ClipboardEvent) {
    event.preventDefault();

    const { clipboardData } = event;
    if (!clipboardData) {
      return;
    }

    const clipboardItem = clipboardData.files[0];

    if (clipboardItem && clipboardItem.type.startsWith('image/')) {
      const reader = new FileReader;

      reader.readAsDataURL(clipboardItem);

      reader.onloadstart = () => {
        showLoader();
      };

      reader.onerror = (e) => {
        console.error('reader error:', e);
        hideLoader();

      };

      reader.onload = (e) => {
        console.log('Loading Image from clipboard...');
        const image = new Image();

        image.onerror = (e) => {
          alert('Error reading image from clipboard. Try to save it and then load via "Load File" button.');
          console.error('Error loading image:', e);
          hideLoader();
        };

        image.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas?.getContext('2d');

          if (!context) {
            return null;
          }

          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);

          setCurrentLoadedImage(canvas.toDataURL());
          setCurrentLoadedFileName('From clipboard');
          hideLoader();
          console.log('Image loaded successfully!');

        };

        image.src = e.target?.result as string;

      };
    }
  }

  function updateImage(event: ChangeEvent<HTMLInputElement>) {
    const data = event.currentTarget.files;
    if (!data) {
      return null;
    }

    const file = data[0];
    const fileName = file.name;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadstart = () => {
      showLoader();
    };

    reader.onerror = (e) => {
      console.error(e);
      hideLoader();
    };

    reader.onloadend = (e) => {
      const image = new Image();

      image.onloadstart = () => {
        showLoader();
      };

      image.onerror = (e) => {
        console.error(e);
        hideLoader();
      };

      image.onload = () => {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
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

        setCurrentLoadedImage(canvas.toDataURL(file.type));
        setCurrentLoadedFileName(fileName);
        hideLoader();
      };

      image.src = e.target?.result as string;
    };
  }

  function updateCanvas() {
    const originalCanvas = document.getElementById('canvasNormal') as HTMLCanvasElement;

    if (!originalCanvas) {
      return;
    }

    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = originalCanvas.width;
    normalCanvas.height = originalCanvas.height;
    const normalContext = normalCanvas.getContext('2d', { willReadFrequently: true });
    normalContext && normalContext.drawImage(originalCanvas, 0, 0);


    const blurredCanvas = document.createElement('canvas');
    blurredCanvas.width = originalCanvas.width;
    blurredCanvas.height = originalCanvas.height;
    const blurredContext = blurredCanvas.getContext('2d', { willReadFrequently: true });
    blurredContext && blurredContext.drawImage(originalCanvas, 0, 0);

    StackBlur.canvasRGBA(blurredCanvas, 0, 0, blurredCanvas.width, blurredCanvas.height, blurAmount);

    const thumbnailCanvas = document.createElement('canvas');
    const thumbnailContext = thumbnailCanvas.getContext('2d', { willReadFrequently: true });

    const auxThumbCanvas = document.createElement('canvas');
    const auxThumbContext = auxThumbCanvas.getContext('2d', { willReadFrequently: true });
    if (!thumbnailContext || !thumbnailCanvas || !auxThumbCanvas || !auxThumbContext) {
      return;
    }

    const scaleSize = () => {
      return 1 / Math.min(canvasWidth, canvasHeight) * 192;
    };

    let curCanvasSize = {
      width: Math.floor(originalCanvas.width * 0.5),
      height: Math.floor(originalCanvas.height * 0.5),
    };

    thumbnailCanvas.width = originalCanvas.width / 1 * scaleSize();
    thumbnailCanvas.height = originalCanvas.height / 1 * scaleSize();

    auxThumbCanvas.width = curCanvasSize.width;
    auxThumbCanvas.height = curCanvasSize.height;

    auxThumbContext.drawImage(originalCanvas, 0, 0, curCanvasSize.width, curCanvasSize.height);

    while (Math.min(curCanvasSize.width, curCanvasSize.height) * 0.5 > Math.min(thumbnailCanvas.width, thumbnailCanvas.height)) {
      curCanvasSize = {
        width: Math.floor(curCanvasSize.width * 0.5),
        height: Math.floor(curCanvasSize.height * 0.5),
      };

      auxThumbContext.drawImage(auxThumbCanvas, 0, 0, curCanvasSize.width * 2, curCanvasSize.height * 2, 0, 0, curCanvasSize.width, curCanvasSize.height);
    }
    const scaleValue = 1 / Math.min(curCanvasSize.width, curCanvasSize.height) * 192;

    thumbnailContext.scale(scaleValue, scaleValue);
    thumbnailContext.drawImage(auxThumbCanvas, 0, 0, curCanvasSize.width, curCanvasSize.height, 0, 0, curCanvasSize.width, curCanvasSize.height);

    const normal = originalCanvas.toDataURL('image/webp', 0.9);
    const blurred = blurredCanvas.toDataURL('image/webp', 0.9);
    const thumbnail = thumbnailCanvas.toDataURL('image/webp', 0.75);


    setCanvasContent({ normal, blurred, thumbnail });
  }

  function clearCanvas() {
    const originalCanvas = document.getElementById('canvasNormal') as HTMLCanvasElement;
    const context = originalCanvas?.getContext('2d', { willReadFrequently: true });
    if (!originalCanvas || !context) {
      return;
    }

    setCanvasContent({ normal: '', blurred: '' });
    setCurrentLoadedImage('');
    setCurrentLoadedFileName('');
    context.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateCanvas();
      console.log('updateCanvas timeout');
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentLoadedImage, blurAmount, integerScale, integerScaleValue, smoothRendering, canvasWidth, canvasHeight]);

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
      smoothRendering,

      clearCanvas,
      invertSizes,
      updateBlur,
      updateCanvas,
      toggleImageBlur,
      toggleIntegerScale,
      toggleSmoothRendering,
      updateImageFromClipboard,
      updateIntegerScale,
      updateImage,
      updateSizes,
    }}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);

  return context;
}