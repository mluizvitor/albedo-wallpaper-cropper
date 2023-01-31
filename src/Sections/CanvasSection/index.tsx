import { CircleNotch, Minus, Plus } from "phosphor-react";
import Button from "../../components/Button";
import { useCanvas } from "../../hooks/useCanvas"
import { getScaleFactor } from "../../utils/GetScaleFactor";
import { WheelEvent, useEffect, useState } from "react";

export function CanvasSection() {

  const {
    canvasContent,
    canvasWidth,
    canvasHeight,
    currentLoadedImage,
    currentLoadedFileName,
    integerScale,
    integerScaleValue,
    showBlur,
    showLoader,
    clearCanvas,
    updateImageFromClipboard,
    updateTimestamp
  } = useCanvas();

  function updater() {
    const originalCanvas = document.getElementById("canvasNormal") as HTMLCanvasElement;
    const context = originalCanvas?.getContext("2d", { willReadFrequently: true });
    if (!originalCanvas || !context) {
      return;
    }

    let draggable = false;
    let currentX = originalCanvas.width / 2;
    let currentY = originalCanvas.height / 2;

    const image = new Image();

    let autoScaleValue = 0;
    let imageWidthScaled = 0;
    let imageHeightScaled = 0;

    let yPosition = 0;
    let xPosition = 0;

    let newImageHeight = image.width / canvasWidth * canvasHeight;
    let newImageWidth = image.height / canvasHeight * canvasWidth;

    image.onload = () => {
      context.clearRect(0, 0, originalCanvas.width, originalCanvas.height)
      autoScaleValue = Math.max(getScaleFactor(image.height, canvasHeight), getScaleFactor(image.width, canvasWidth))
      imageWidthScaled = image.width * (integerScale ? integerScaleValue : autoScaleValue);
      imageHeightScaled = image.height * (integerScale ? integerScaleValue : autoScaleValue);

      if (integerScale) {
        context.imageSmoothingEnabled = false;
        context.imageSmoothingQuality = "low"

        context!.drawImage(image, originalCanvas.width / 2 - imageWidthScaled / 2, originalCanvas.height / 2 - imageHeightScaled / 2, imageWidthScaled, imageHeightScaled);

      } else {
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "low"

        newImageHeight = image.width / canvasWidth * canvasHeight;
        newImageWidth = image.height / canvasHeight * canvasWidth;

        yPosition = (image.height / 2) - (newImageHeight / 2);
        xPosition = (image.width / 2) - (newImageWidth / 2);

        if (canvasWidth / canvasHeight > image.width / image.height) {
          context.drawImage(image, 0, yPosition, image.width, newImageHeight, 0, 0, canvasWidth, canvasHeight);
        } else {
          context.drawImage(image, xPosition, 0, newImageWidth, image.height, 0, 0, canvasWidth, canvasHeight);
        }
      }
    }

    image.src = currentLoadedImage;

    originalCanvas.onmousedown = (e) => {
      if (
        e.offsetX <= (currentX + (imageWidthScaled / 2)) &&
        e.offsetX >= (currentX - (imageWidthScaled / 2)) &&
        e.offsetY <= (currentY + (imageHeightScaled / 2)) &&
        e.offsetY >= (currentY - (imageHeightScaled / 2))
      ) {
        draggable = true;
        document.body.style.cursor = "grabbing";
      };
    }
    originalCanvas.onmousemove = (e) => {
      if (draggable) {
        currentX = e.offsetX;
        currentY = e.offsetY;

        context.clearRect(0, 0, originalCanvas.width, originalCanvas.height)

        if (integerScale) {
          if (imageWidthScaled === originalCanvas.width) {
            context.drawImage(image, 0, currentY - imageHeightScaled / 2, imageWidthScaled, imageHeightScaled);
          } else if (imageHeightScaled === originalCanvas.height) {
            context.drawImage(image, currentX - imageWidthScaled / 2, 0, imageWidthScaled, imageHeightScaled);
          } else {
            context.drawImage(image, currentX - imageWidthScaled / 2, currentY - imageHeightScaled / 2, imageWidthScaled, imageHeightScaled);
          }
        } else {
          if (canvasWidth / canvasHeight > image.width / image.height) {
            context.drawImage(image, 0, currentY - (canvasWidth / image.width * image.height) / 2, canvasWidth, canvasWidth / image.width * image.height);
          } else {
            context.drawImage(image, currentX - (canvasHeight / image.height * image.width) / 2, 0, canvasHeight / image.height * image.width, canvasHeight);
          }
        }
      }
    };
    originalCanvas.onmouseup = () => {
      draggable = false;
      document.body.style.cursor = "grab";
      updateTimestamp()
    };
    originalCanvas.onmouseenter = () => {
      document.body.style.cursor = "grab";
    }
    originalCanvas.onmouseout = () => {
      draggable = false;
      document.body.style.cursor = "auto";
    };
  }

  const [canvasScaleOnScreen, setCanvasScaleOnScreen] = useState(100);

  function updateCanvasScaleOnScreen(type: "zoomIn" | "zoomOut") {
    if (type === "zoomIn" && canvasScaleOnScreen < 200) {
      setCanvasScaleOnScreen(canvasScaleOnScreen + 5);

    } else if (type === "zoomOut" && canvasScaleOnScreen > 20) {
      setCanvasScaleOnScreen(canvasScaleOnScreen - 5);
    }
  }

  function wheelHandler(event: WheelEvent) {
    if (event.deltaY < 0) {
      updateCanvasScaleOnScreen("zoomIn");
    }
    else if (event.deltaY > 0) {
      updateCanvasScaleOnScreen("zoomOut");
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      updater();
    }, 100);

    return () => clearTimeout(timeout);

  }, [currentLoadedImage, integerScale, integerScaleValue, canvasHeight, canvasWidth])

  useEffect(() => {
    document.addEventListener("paste", (event: ClipboardEvent) => updateImageFromClipboard(event));
    console.log("listening for paste events")
  }, []);

  return (
    <section id="MainCanvas"
      className={`z-0 w-[100vw] h-[100vh] relative overflow-hidden flex items-center justify-center`}
      onWheel={(e: WheelEvent<HTMLDivElement>) => wheelHandler(e)}
    >
      <div className="opacity-50 fixed top-0 inset-x-0 flex items-center justify-center h-16 font-teko text-lg">
        <h1>{currentLoadedFileName}</h1>
      </div>

      <div className="flex flex-col h-[100vh] items-center justify-center fixed inset-0">
        <canvas id="canvasNormal"
          className={["bg-neutral-700", showBlur && "hidden"].join(" ")}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            transform: `scale(${canvasScaleOnScreen / 100})`,
            borderRadius: 6 / (canvasScaleOnScreen / 100) * 1,
          }}
        />

        <img src={canvasContent.blurred}
          className={["bg-neutral-700 cursor-not-allowed pointer-events-none", !showBlur && "hidden"].join(" ")}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            transform: `scale(${canvasScaleOnScreen / 100})`,
            borderRadius: 6 / (canvasScaleOnScreen / 100) * 1,
          }}
        />

        {showLoader && (
          <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center backdrop-blur-lg">
            <CircleNotch size={96} className="animate-spin" />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 flex items-center justify-center h-16 text-lg">

        <div className="opacity-50 hover:opacity-100 flex group transition-opacity duration-300">
          <Button label="Clear Canvas" className="mr-4" onClick={clearCanvas} />

          <Button label={"Zoom Out"}
            hideLabel
            className="rounded-r-none hover:rounded-l-xl hover:rounded-r-none"
            icon={<Minus size={16} />}
            onClick={() => {
              updateCanvasScaleOnScreen("zoomOut")
            }}
          />
          <div className="w-16 bg-neutral-700 flex items-center justify-center font-bold text-sm pointer-events-none">
            {Math.ceil(canvasScaleOnScreen)}%
          </div>
          <Button label={"Zoom Out"}
            hideLabel
            className="rounded-l-none hover:rounded-l-none hover:rounded-r-xl"
            icon={<Plus size={16} />}
            onClick={() => {
              updateCanvasScaleOnScreen("zoomIn")
            }}
          />
        </div>

      </div>
    </section >
  )
}
