import { ArrowsClockwise, Question } from 'phosphor-react';
import { useCanvas } from '../../hooks/useCanvas';
import { MenuSection } from '../../components/Section';
import Input from '../../components/Input';
import { ChangeEvent } from 'react';
import { SideBar } from '../../components/SideBar';
import Checkbox from '../../components/Checkbox';
import Button from '../../components/Button';

export function CropperSection() {

  const {
    blurAmount,
    canvasWidth,
    canvasHeight,
    integerScale,
    integerScaleValue,
    showBlur,
    smoothRendering,
    invertSizes,
    updateBlur,
    updateIntegerScale,
    updateSizes,
    toggleImageBlur,
    toggleIntegerScale,
    toggleSmoothRendering,
  } = useCanvas();

  return (
    <SideBar anchor='right'>
      <MenuSection title='Crop'
        className='z-10 grid gap-2 grid-cols-[1fr_auto_1fr] place-items-end'>
        <Input id='cropperSection_imageWidth'
          label='Width'
          type='number'
          className='w-full'
          max={3000}
          min={0}
          value={canvasWidth}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateSizes(Number(e.target.value), -1)}
        />

        <Button label='Invert'
          hideLabel
          className='bg-neutral-500'
          icon={<ArrowsClockwise size={16}
            weight='bold' />}
          onClick={invertSizes}
        />

        <Input id='cropperSection_imageHeight'
          label='Height'
          type='number'
          className='w-full'
          max={3000}
          min={0}
          value={canvasHeight}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateSizes(-1, Number(e.target.value))}
        />
      </MenuSection>

      <MenuSection title='Presets'>
        <div className='flex mb-2 items-center'>
          <span className='text-sm text-neutral-200'>{'1 : 1 · Square'}</span>
          <span className='ml-2 opacity-50 cursor-help'
            title={'Square images are good if you want balance between horizontal and vertical content.\nHowever, on RG552 it\'ll not look good.\nHover the following buttons for more details.'}>
            <Question size={16}
              weight='bold' />
          </span>
        </div>
        <div className='grid grid-cols-3 gap-2 mb-3'>
          <Button className='justify-center flex-1'
            label='320 x 320'
            title={'Width: 320 pixels\nHeight: 320 pixels\nMinimum size for RG351P/M'}
            onClick={() => updateSizes(320, 320)} />

          <Button className='justify-center flex-1'
            label='480 x 480'
            title={'Width: 480 pixels\nHeight: 480 pixels\nMinimum size for RG351V/MP'}
            onClick={() => updateSizes(480, 480)} />

          <Button className='justify-center flex-1'
            label='1152 x 1152'
            title={'Width: 1152 pixels\nHeight: 1152 pixels\nMinimum size for RG552'}
            onClick={() => updateSizes(1152, 1152)} />

          <Button className='justify-center flex-1'
            label='1280 x 1280'
            title={'Width: 1280 pixels\nHeight: 1280 pixels\n4x RG351P/M size'}
            onClick={() => updateSizes(1280, 1280)} />

          <Button className='justify-center flex-1'
            label='1920 x 1920'
            title={'Width: 1920 pixels\nHeight: 1920 pixels\n4x RG351V/MP size'}
            onClick={() => updateSizes(1920, 1920)} />
        </div>

        <div className='flex mb-2 items-center'>
          <span className='text-sm text-neutral-200'>{'3 : 2'}</span>
          <span className='ml-2 opacity-50 cursor-help'
            title={'3:2 images fit perfectly on RG351P/M.\nHover the following buttons for more details.'}>
            <Question size={16}
              weight='bold' />
          </span>
        </div>
        <div className='grid grid-cols-3 gap-2 mb-3'>
          <Button className='justify-center flex-1'
            label='480 x 320'
            title={'Width: 480 pixels\nHeight: 320 pixels\nRG351P/M original resolution.'}
            onClick={() => updateSizes(480, 320)} />

          <Button className='justify-center flex-1'
            label='1920 x 1280'
            title={'Width: 1920 pixels\nHeight: 1280 pixels\nRG351P/M resolution multiplied by 4.'}
            onClick={() => updateSizes(1920, 1280)} />
        </div>

        <div className='flex mb-2 items-center'>
          <span className='text-sm text-neutral-200'>{'4 : 3'}</span>
          <span className='ml-2 opacity-50 cursor-help'
            title={'4:3 images fit perfectly on RG351V/MP.\nHover the following buttons for more details.'}>
            <Question size={16}
              weight='bold' />
          </span>
        </div>
        <div className='grid grid-cols-3 gap-2 mb-3'>
          <Button className='justify-center flex-1'
            label='640 x 480'
            title={'Width: 640 pixels\nHeight: 480 pixels\nRG351V/MP original resolution.'}
            onClick={() => updateSizes(640, 480)} />
          <Button className='justify-center flex-1'
            label='1920 x 1440'
            title={'Width: 1920 pixels\nHeight: 1440 pixels\nRG351V/MP resolution multiplied by 3.'}
            onClick={() => updateSizes(1920, 1440)} />
        </div>

        <div className='flex mb-2 items-center'>
          <span className='text-sm text-neutral-200'>{'5 : 3'}</span>
          <span className='ml-2 opacity-50 cursor-help'
            title={'5:3 images fit perfectly on RG552.\nHover the following buttons for more details.'}>
            <Question size={16}
              weight='bold' />
          </span>
        </div>
        <div className='grid grid-cols-3 gap-2 mb-3'>
          <Button className='justify-center flex-1'
            label='1920 x 1152'
            title={'Width: 1920 pixels\nHeight: 1152 pixels\nRG552 original resolution.'}
            onClick={() => updateSizes(1920, 1152)} />
        </div>
      </MenuSection>

      <MenuSection title='Render options'
        className='grid gap-2'>
        <Checkbox id='cropperSection_smoothRendering'
          label='Smooth rendering'
          checked={smoothRendering}
          triggerMethod={toggleSmoothRendering} />

        <Checkbox id='cropperSection_integerCheckbox'
          checked={integerScale}
          label='Manual scale'
          triggerMethod={toggleIntegerScale}
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateIntegerScale(Number(e.target.value))}
            helperText='1 to 20' />
        )}
      </MenuSection>

      <MenuSection title='Blur settings'>
        <Checkbox id='cropperSection_showBlurredVariant'
          label='Show blurred variant'
          checked={showBlur}
          triggerMethod={toggleImageBlur}
        />
        <Input label={'Blur: ' + blurAmount}
          helperText='0 to 180'
          id='cropperSection_BlurInput'
          type='range'
          min={0}
          max={180}
          className='mt-4'
          value={blurAmount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateBlur(Number(e.target.value))} />
      </MenuSection>
    </SideBar>
  );
}
