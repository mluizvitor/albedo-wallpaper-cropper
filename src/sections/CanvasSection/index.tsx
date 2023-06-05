import { Minus, Plus } from 'phosphor-react';
import Button from '../../components/Button';
import { useCanvas } from '../../hooks/useCanvas';
import { getScaleFactor } from '../../utils/GetScaleFactor';
import { WheelEvent, useEffect, useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import EditText from 'react-editext';
import styles from './styles.module.css';

export function CanvasSection() {

  const {
    canvasContent,
    currentLoadedImage,
    currentLoadedFileName,
    clearCanvas,
    updateImageFromClipboard,
    updateCanvas,
  } = useCanvas();

  const {
    settings,
    updateProjectName,
  } = useSettings();

  const canvasSize = settings.canvasSize;
  const integerScale = settings.integerScale;
  const integerScaleValue = settings.integerScaleValue;
  const smoothRendering = settings.smoothRendering;
  const projectName = settings.projectName;
  const guideType = settings.guideType;
  const showBlur = settings.showBlur;

  function updater() {
    const originalCanvas = document.getElementById('canvasNormal') as HTMLCanvasElement;
    const context = originalCanvas?.getContext('2d', { willReadFrequently: true });
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

    let newImageHeight = image.width / canvasSize.w * canvasSize.h;
    let newImageWidth = image.height / canvasSize.h * canvasSize.w;

    image.onload = () => {
      context.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
      autoScaleValue = Math.max(getScaleFactor(image.height, canvasSize.h), getScaleFactor(image.width, canvasSize.w));
      imageWidthScaled = image.width * (integerScale ? integerScaleValue : autoScaleValue);
      imageHeightScaled = image.height * (integerScale ? integerScaleValue : autoScaleValue);

      context.imageSmoothingQuality = 'high';
      context.imageSmoothingEnabled = settings.smoothRendering;

      if (integerScale) {
        context.drawImage(image, originalCanvas.width / 2 - imageWidthScaled / 2, originalCanvas.height / 2 - imageHeightScaled / 2, imageWidthScaled, imageHeightScaled);

      } else {
        newImageHeight = image.width / canvasSize.w * canvasSize.h;
        newImageWidth = image.height / canvasSize.h * canvasSize.w;

        yPosition = (image.height / 2) - (newImageHeight / 2);
        xPosition = (image.width / 2) - (newImageWidth / 2);

        if (canvasSize.w / canvasSize.h > image.width / image.height) {
          context.drawImage(image, 0, yPosition, image.width, newImageHeight, 0, 0, canvasSize.w, canvasSize.h);
        } else {
          context.drawImage(image, xPosition, 0, newImageWidth, image.height, 0, 0, canvasSize.w, canvasSize.h);
        }
      }
    };

    image.src = currentLoadedImage;

    originalCanvas.onmousedown = (e) => {
      if (
        e.offsetX <= (currentX + (imageWidthScaled / 2)) &&
        e.offsetX >= (currentX - (imageWidthScaled / 2)) &&
        e.offsetY <= (currentY + (imageHeightScaled / 2)) &&
        e.offsetY >= (currentY - (imageHeightScaled / 2))
      ) {
        draggable = true;
        document.body.style.cursor = 'grabbing';
      };
    };
    originalCanvas.onmousemove = (e) => {
      if (draggable) {
        currentX = e.offsetX;
        currentY = e.offsetY;

        context.fillStyle = 'rgba(0,0,0,1)';
        context.fillRect(0, 0, originalCanvas.width, originalCanvas.height);

        if (integerScale) {
          if (imageWidthScaled === originalCanvas.width) {
            context.drawImage(image, 0, currentY - imageHeightScaled / 2, imageWidthScaled, imageHeightScaled);
          } else if (imageHeightScaled === originalCanvas.height) {
            context.drawImage(image, currentX - imageWidthScaled / 2, 0, imageWidthScaled, imageHeightScaled);
          } else {
            context.drawImage(image, currentX - imageWidthScaled / 2, currentY - imageHeightScaled / 2, imageWidthScaled, imageHeightScaled);
          }
        } else {
          if (canvasSize.w / canvasSize.h > image.width / image.height) {
            context.drawImage(image, 0, currentY - (canvasSize.w / image.width * image.height) / 2, canvasSize.w, canvasSize.w / image.width * image.height);
          } else {
            context.drawImage(image, currentX - (canvasSize.h / image.height * image.width) / 2, 0, canvasSize.h / image.height * image.width, canvasSize.h);
          }
        }
      }
    };
    originalCanvas.onmouseup = () => {
      draggable = false;
      document.body.style.cursor = 'grab';
      updateCanvas();
    };
    originalCanvas.onmouseenter = () => {
      document.body.style.cursor = 'grab';
    };
    originalCanvas.onmouseout = () => {
      draggable = false;
      document.body.style.cursor = 'auto';
    };
  }

  const [canvasScaleOnScreen, setCanvasScaleOnScreen] = useState(50);
  const maxScale = 300;
  const minScale = 10;

  function updateCanvasScaleOnScreen(type: 'zoomIn' | 'zoomOut') {
    if (type === 'zoomIn' && canvasScaleOnScreen < maxScale) {
      setCanvasScaleOnScreen(canvasScaleOnScreen + 5);

    } else if (type === 'zoomOut' && canvasScaleOnScreen > minScale) {
      setCanvasScaleOnScreen(canvasScaleOnScreen - 5);
    }
  }

  function handleUpdateScaleInput(scaleTarget: number) {
    if (scaleTarget >= minScale && scaleTarget <= maxScale) {
      setCanvasScaleOnScreen(scaleTarget);
    }
  }

  function wheelHandler(event: WheelEvent) {
    if (event.deltaY < 0) {
      updateCanvasScaleOnScreen('zoomIn');
    } else if (event.deltaY > 0) {
      updateCanvasScaleOnScreen('zoomOut');
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      updater();
    }, 100);

    return () => clearTimeout(timeout);

  }, [currentLoadedImage, integerScale, integerScaleValue, canvasSize, smoothRendering]);

  useEffect(() => {
    document.addEventListener('paste', (event: ClipboardEvent) => updateImageFromClipboard(event));
  }, []);

  return (
    <section id='MainCanvas'
      className='z-0 w-[100vw] h-[100vh] relative overflow-hidden flex items-center justify-center bg-[#0a0a0a]'
      onWheel={(e: WheelEvent<HTMLDivElement>) => wheelHandler(e)}
    >
      <div className='fixed top-0 inset-x-0 grid grid-cols-2 items-center justify-between z-20 py-3 bg-[#0a0a0a]/50 px-[25rem] 2xl:px-[29rem]'>
        <EditText type='text'
          value={projectName}

          validation={(value) => !!value}
          validationMessage="Title can't be empty"

          onSave={(value) => {
            updateProjectName(value);
          }}

          editButtonClassName='hidden'
          cancelButtonClassName='hidden'
          saveButtonClassName='hidden'

          editOnViewClick
          submitOnUnfocus
          submitOnEnter
          cancelOnEscape
          hideIcons

          inputProps={{
            className: 'bg-transparent text-xl text-start outline-none h-10 border-b-2 border-amber-500 w-full',
            placeholder: 'Project Title',
          }}

          containerProps={{
            className: 'bg-transparent text-xl text-start outline-none h-10 flex border-b-2 border-transparent w-full',
          }}
        />
        <span title={currentLoadedFileName}
          className='opacity-50 text-lg font-teko leading-[1.25rem] inline-block overflow-hidden break-words text-ellipsis max-h-5 text-end'>
          {currentLoadedFileName}
        </span>
      </div>

      <div className='flex flex-col h-[100vh] items-center justify-center fixed inset-0'>
        <canvas id='canvasNormal'
          className={['bg-neutral-700', guideType !== 'none' && 'brightness-[0.4]', showBlur && 'hidden'].join(' ')}
          width={canvasSize.w}
          height={canvasSize.h}
          style={{
            transform: `scale(${canvasScaleOnScreen / 100})`,
            borderRadius: 6 / (canvasScaleOnScreen / 100) * 1,
            imageRendering: smoothRendering ? 'crisp-edges' : 'pixelated',
          }}
        />

        <img src={canvasContent.blurred}
          className={['bg-neutral-700 cursor-not-allowed pointer-events-none fixed', !showBlur && 'hidden'].join(' ')}
          width={canvasSize.w}
          height={canvasSize.h}
          style={{
            transform: `scale(${canvasScaleOnScreen / 100})`,
            borderRadius: 6 / (canvasScaleOnScreen / 100) * 1,
          }}
        />

        {canvasSize.h !== canvasSize.w && (
          <div className={['pointer-events-none z-10 fixed', guideType !== 'none' && 'backdrop-brightness-[2.5]', showBlur && 'hidden'].join(' ')}
            style={{
              background: 'none',
              transform: `scale(${canvasScaleOnScreen / 100})`,
              width: guideType === 'elementerial' ? canvasSize.w : Math.min(canvasSize.h, canvasSize.w),
              height: guideType === 'elementerial' ? canvasSize.h / 2 : Math.min(canvasSize.h, canvasSize.w),
            }}
          />
        )}
      </div>

      <div className='fixed bottom-0 inset-x-0 flex items-center justify-center h-16 text-lg'>

        <div className='opacity-60 hover:opacity-100 flex transition-opacity duration-300'>
          <Button label='Clear Canvas'
            className='mr-4 text-sm'
            onClick={clearCanvas} />

          <Button label='Zoom Out'
            hideLabel
            icon={<Minus size={16} />}
            onClick={() => {
              updateCanvasScaleOnScreen('zoomOut');
            }}
          />

          <EditText
            type='number'
            value={Math.ceil(canvasScaleOnScreen).toString()}
            renderValue={() => `${Math.ceil(canvasScaleOnScreen).toString()}%`}

            onSave={(value) => handleUpdateScaleInput(Number(value))}

            editButtonClassName='hidden m-0 p-0'
            cancelButtonClassName='hidden m-0 p-0'
            saveButtonClassName='hidden m-0 p-0'

            editOnViewClick
            submitOnUnfocus
            submitOnEnter
            cancelOnEscape
            hideIcons

            containerProps={{
              className: [styles.button, 'mx-1'].join(' '),
            }}

            viewContainerClassName='m-0'

            inputProps={{
              id: 'canvasSection_zoomInput',
              className: 'min-w-0 w-full h-8 bg-transparent m-0 p-0 text-center outline-none',
            }}
          />

          <Button label='Zoom Out'
            hideLabel
            icon={<Plus size={16} />}
            onClick={() => {
              updateCanvasScaleOnScreen('zoomIn');
            }}
          />
        </div>

      </div>
    </section >
  );
}
