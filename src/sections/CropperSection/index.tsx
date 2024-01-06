import { ArrowsClockwise, CaretDoubleUp, Question } from 'phosphor-react';
import { MenuSection } from '../../components/Section';
import Input from '../../components/Input';
import { ChangeEvent } from 'react';
import { SideBar } from '../../components/SideBar';
import Checkbox from '../../components/Checkbox';
import Button from '../../components/Button';
import { useSettings } from '../../hooks/useSettings';
import styles from './styles.module.css';


export function CropperSection() {

  const {
    settings,
    invertCanvasValues,
    updateBlurAmount,
    updateCanvasSize,
    updateIntegerScaleValue,
    toggleImageBlur,
    toggleIntegerScale,
    toggleSmoothRendering,
    updateGuideType,
    toggleRightPanel,
  } = useSettings();

  const canvasSize = settings.canvasSize;
  const integerScale = settings.integerScale;
  const integerScaleValue = settings.integerScaleValue;
  const smoothRendering = settings.smoothRendering;
  const guideType = settings.guideType;
  const showBlur = settings.showBlur;
  const blurAmount = settings.blurAmount;

  return (
    <>

      <Button label='Hide panel'
        hideLabel
        icon={<CaretDoubleUp size={16}
          className={['transition-transform', settings.hideRightPanel ? '-rotate-90' : 'rotate-90'].join(' ')} />}
        onClick={toggleRightPanel}
        className={[styles.hidePanelButton, settings.hideRightPanel ? 'translate-x-[24rem] 2xl:translate-x-[28rem]' : ''].join(' ')}
      />

      <SideBar anchor='right'
        className={settings.hideRightPanel ? 'translate-x-[24rem] 2xl:translate-x-[28rem]' : ''}>
        <MenuSection title='Crop'
          className='z-10 grid gap-2 grid-cols-[1fr_auto_1fr] place-items-end'>
          <Input id='cropperSection_imageWidth'
            label='Width'
            type='number'
            className='w-full'
            max={3000}
            min={0}
            value={canvasSize.w}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateCanvasSize(Number(e.target.value), -1)}
          />

          <Button label='Invert'
            hideLabel
            className='bg-neutral-500'
            icon={<ArrowsClockwise size={16}
              weight='bold' />}
            onClick={invertCanvasValues}
          />

          <Input id='cropperSection_imageHeight'
            label='Height'
            type='number'
            className='w-full'
            max={3000}
            min={0}
            value={canvasSize.h}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateCanvasSize(-1, Number(e.target.value))}
          />
        </MenuSection>

        <MenuSection title='Presets'
          className='grid grid-cols-3 gap-x-2'>
          <div className='flex mb-2 items-center col-span-3'>
            <span className='text-sm text-neutral-200'>{'1 : 1 · Square'}</span>
            <span className='ml-2 opacity-50 cursor-help'
              title={'Square images are good if you want balance between horizontal and vertical content.\nHowever, on RG552 it\'ll not look good.\nHover the following buttons for more details.'}>
              <Question size={16}
                weight='bold' />
            </span>
          </div>
          <div className='grid grid-cols-3 gap-2 mb-3 col-span-3'>
            <Button className={['justify-center flex-1', (canvasSize.w === 480 && canvasSize.h === 480) && 'bg-amber-500 text-black/80'].join(' ')}
              label='480 x 480'
              title={'Width: 480 pixels\nHeight: 480 pixels'}
              onClick={() => updateCanvasSize(480, 480)} />

            <Button className={['justify-center flex-1', (canvasSize.w === 640 && canvasSize.h === 640) && 'bg-amber-500 text-black/80'].join(' ')}
              label='640 x 640'
              title={'Width: 640 pixels\nHeight: 640 pixels'}
              onClick={() => updateCanvasSize(640, 640)} />

            <Button className={['justify-center flex-1', (canvasSize.w === 1920 && canvasSize.h === 1920) && 'bg-amber-500 text-black/80'].join(' ')}
              label='1920 x 1920'
              title={'Width: 1920 pixels\nHeight: 1920 pixels'}
              onClick={() => updateCanvasSize(1920, 1920)} />
          </div>

          <div className='flex mb-2 items-center col-span-3'>
            <span className='text-sm text-neutral-200'>{'2 : 1'}</span>
            <span className='ml-2 opacity-50 cursor-help'
              title='2:1 images are used on Elementerial theme it fits perfectly on 3:2, 4:3 and 5:3 devices.'>
              <Question size={16}
                weight='bold' />
            </span>
          </div>
          <div className='grid grid-cols-3 gap-2 mb-3 col-span-3'>
            <Button className={['justify-center flex-1', (canvasSize.w === 480 && canvasSize.h === 240) && 'bg-amber-500 text-black/80'].join(' ')}
              label='480 x 240'
              title={'Width: 480 pixels\nHeight: 240 pixels\nRG351P/M screen width.'}
              onClick={() => updateCanvasSize(480, 240)} />

            <Button className={['justify-center flex-1', (canvasSize.w === 640 && canvasSize.h === 320) && 'bg-amber-500 text-black/80'].join(' ')}
              label='640 x 320'
              title={'Width: 640 pixels\nHeight: 320 pixels\nRG351MP/V and RG353 screen width.'}
              onClick={() => updateCanvasSize(640, 320)} />

            <Button className={['justify-center flex-1', (canvasSize.w === 1920 && canvasSize.h === 960) && 'bg-amber-500 text-black/80'].join(' ')}
              label='1920 x 960'
              title={'Width: 1920 pixels\nHeight: 960 pixels\nRG351P/M screen width multiplied by 4.\nRG351MP/V and RG353 screen width multiplied by 3\nRG552 native screen width'}
              onClick={() => updateCanvasSize(1920, 960)} />
          </div>

          <div className='flex mb-2 items-center col-span-3'>
            <span className='text-sm text-neutral-200'>{'3 : 2'}</span>
            <span className='ml-2 opacity-50 cursor-help'
              title={'3:2 images fit perfectly on RG351P/M.\nHover the following buttons for more details.'}>
              <Question size={16}
                weight='bold' />
            </span>
          </div>
          <div className='grid grid-cols-3 gap-2 mb-3 col-span-3'>
            <Button className={['justify-center flex-1', (canvasSize.w === 480 && canvasSize.h === 320) && 'bg-amber-500 text-black/80'].join(' ')}
              label='480 x 320'
              title={'Width: 480 pixels\nHeight: 320 pixels\nRG351P/M original resolution.'}
              onClick={() => updateCanvasSize(480, 320)} />

            <Button className={['justify-center flex-1', (canvasSize.w === 960 && canvasSize.h === 640) && 'bg-amber-500 text-black/80'].join(' ')}
              label='960 x 640'
              title={'Width: 960 pixels\nHeight: 640 pixels\nRG351P/M resolution multiplied by 2.'}
              onClick={() => updateCanvasSize(960, 640)} />

            <Button className={['justify-center flex-1', (canvasSize.w === 1920 && canvasSize.h === 1280) && 'bg-amber-500 text-black/80'].join(' ')}
              label='1920 x 1280'
              title={'Width: 1920 pixels\nHeight: 1280 pixels\nRG351P/M resolution multiplied by 4.'}
              onClick={() => updateCanvasSize(1920, 1280)} />
          </div>

          <div className='flex mb-2 items-center col-span-2'>
            <span className='text-sm text-neutral-200'>{'4 : 3'}</span>
            <span className='ml-2 opacity-50 cursor-help'
              title={'4:3 images fit perfectly on RG351V/MP.\nHover the following buttons for more details.'}>
              <Question size={16}
                weight='bold' />
            </span>
          </div>

          <div className='flex mb-2 items-center col-span-1'>
            <span className='text-sm text-neutral-200'>{'5 : 3'}</span>
            <span className='ml-2 opacity-50 cursor-help'
              title={'5:3 images fit perfectly on RG552.\nHover the following buttons for more details.'}>
              <Question size={16}
                weight='bold' />
            </span>
          </div>

          <div className='grid grid-cols-2 gap-2 mb-3 col-span-2'>
            <Button className={['justify-center flex-1', (canvasSize.w === 640 && canvasSize.h === 480) && 'bg-amber-500 text-black/80'].join(' ')}
              label='640 x 480'
              title={'Width: 640 pixels\nHeight: 480 pixels\nRG351V/MP original resolution.'}
              onClick={() => updateCanvasSize(640, 480)} />

            <Button className={['justify-center flex-1', (canvasSize.w === 1920 && canvasSize.h === 1440) && 'bg-amber-500 text-black/80'].join(' ')}
              label='1920 x 1440'
              title={'Width: 1920 pixels\nHeight: 1440 pixels\nRG351V/MP resolution multiplied by 3.'}
              onClick={() => updateCanvasSize(1920, 1440)} />
          </div>


          <div className='grid grid-cols-1 gap-2 mb-3 col-span-1'>
            <Button className={['justify-center flex-1', (canvasSize.w === 1920 && canvasSize.h === 1152) && 'bg-amber-500 text-black/80'].join(' ')}
              label='1920 x 1152'
              title={'Width: 1920 pixels\nHeight: 1152 pixels\nRG552 original resolution.'}
              onClick={() => updateCanvasSize(1920, 1152)} />
          </div>

          <div className='flex mb-2 items-center col-span-3'>
            <span className='text-sm text-neutral-200'>{'16 : 9'}</span>
            <span className='ml-2 opacity-50 cursor-help'
              title={'16:9 images fit perfectly on most computers and TVs.\nHover the following buttons for more details.'}>
              <Question size={16}
                weight='bold' />
            </span>
          </div>
          <div className='grid grid-cols-3 gap-2 mb-3 col-span-3'>
            <Button className={['justify-center flex-1', (canvasSize.w === 960 && canvasSize.h === 544) && 'bg-amber-500 text-black/80'].join(' ')}
              label='960 x 544'
              title={'Width: 960 pixels\nHeight: 544 pixels\nRG503 resolution. 2X PSP resolution.'}
              onClick={() => updateCanvasSize(960, 544)} />

            <Button className={['justify-center flex-1', (canvasSize.w === 1280 && canvasSize.h === 720) && 'bg-amber-500 text-black/80'].join(' ')}
              label='1280 x 720'
              title={'Width: 1280 pixels\nHeight: 720 pixels\nHD resolution.'}
              onClick={() => updateCanvasSize(1280, 720)} />

            <Button className={['justify-center flex-1', (canvasSize.w === 1920 && canvasSize.h === 1080) && 'bg-amber-500 text-black/80'].join(' ')}
              label='1920 x 1080'
              title={'Width: 1920 pixels\nHeight: 1080 pixels\nFullHD resolution.'}
              onClick={() => updateCanvasSize(1920, 1080)} />
          </div>

          <div className='flex mb-2 items-center col-span-3'>
            <span className='text-sm text-neutral-200'>{'Theme guide'}</span>
            <span className='ml-2 opacity-50 cursor-help'
              title={'In this context, guide is a square or rectangle that will help you position your wallpaper.\nThe highlighted area means the best position for your image and the dimmed is a safe area can can or cannot be showed depending on device.'}>
              <Question size={16}
                weight='bold' />
            </span>
          </div>
          <div className='grid grid-cols-3 gap-2 mb-3 col-span-3'>
            <Button className={['justify-center flex-1', guideType === 'none' && 'bg-amber-500 text-black/80'].join(' ')}
              label='None'
              title='This option will remove any rectangular guides'
              onClick={() => updateGuideType('none')} />

            <Button className={['justify-center flex-1', guideType === 'albedo' && 'bg-amber-500 text-black/80'].join(' ')}
              label='Albedo'
              title={'Recommended aspect ratio → 3:2 is a good choice, but your device aspect ratio is a better choice\nThis option will show a square in the middle of the canvas to help you position your image for best results when creating wallpapers for Albedo theme.'}
              onClick={() => updateGuideType('albedo')} />

            <Button className={['justify-center flex-1', guideType === 'elementerial' && 'bg-amber-500 text-black/80'].join(' ')}
              label='Elementerial'
              title={'Recommended aspect ratio → 2:1\nThis option will show an wide rectangle in the middle of the canvas to help you position your image for best results when creating wallpapers for Elementerial theme.'}
              onClick={() => updateGuideType('elementerial')} />
          </div>

        </MenuSection>

        <MenuSection title='Render options'
          className='grid gap-2'>
          <Checkbox id='cropperSection_smoothRendering'
            label='Smooth rendering'
            checked={smoothRendering}
            triggerMethod={() => toggleSmoothRendering()} />

          <Checkbox id='cropperSection_integerCheckbox'
            checked={integerScale}
            label='Manual scale'
            triggerMethod={() => toggleIntegerScale()}
          />

          {integerScale && (
            <Input id='cropperSection_integerInput'
              label={'Scale: ' + integerScaleValue}
              value={integerScaleValue}
              step='1'
              type='range'
              min={1}
              max={32}
              className='mt-2'
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateIntegerScaleValue(Number(e.target.value))}
              helperText='1 to 20' />
          )}
        </MenuSection>

        <MenuSection title='Blur settings'>
          <Checkbox id='cropperSection_showBlurredVariant'
            label='Show blurred variant'
            checked={showBlur}
            triggerMethod={() => toggleImageBlur()}
          />
          <Input label={'Blur: ' + blurAmount}
            helperText='0 to 180'
            id='cropperSection_BlurInput'
            type='range'
            min={0}
            max={180}
            step={5}
            className='mt-4'
            value={blurAmount}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateBlurAmount(Number(e.target.value))} />
        </MenuSection>
      </SideBar>
    </>
  );
}
