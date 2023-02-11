import { ArrowsClockwise } from 'phosphor-react';
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

      <MenuSection title='Presets'
        className='grid grid-cols-2 gap-2'>
        <span className='text-sm text-neutral-200 col-span-2'>{'1 : 1'}</span>
        <Button className='justify-center flex-1'
          label='320x320'
          onClick={() => updateSizes(320, 320)} />
        <Button className='justify-center flex-1'
          label='1920x1920'
          onClick={() => updateSizes(1920, 1920)} />

        <span className='text-sm text-neutral-200 col-span-2'>{'3 : 2'}</span>
        <Button className='justify-center flex-1'
          label='480x320'
          onClick={() => updateSizes(480, 320)} />
        <Button className='justify-center flex-1'
          label='1920x1280'
          onClick={() => updateSizes(1920, 1280)} />

        <span className='text-sm text-neutral-200 col-span-2'>{'4 : 3'}</span>
        <Button className='justify-center flex-1'
          label='640x480'
          onClick={() => updateSizes(640, 480)} />
        <Button className='justify-center flex-1'
          label='1920x1440'
          onClick={() => updateSizes(1920, 1440)} />

        <span className='text-sm text-neutral-200 col-span-2'>{'5 : 3'}</span>
        <Button className='justify-center flex-1'
          label='1920x1152'
          onClick={() => updateSizes(1920, 1152)} />
      </MenuSection>

      <MenuSection title='Integer Scale'
        className='grid gap-2'>
        <Checkbox id='cropperSection_smoothRendering'
          className='bg-neutral-900 py-1 px-2'
          label='Smooth rendering'
          checked={smoothRendering}
          triggerMethod={toggleSmoothRendering} />

        <Checkbox
          className='bg-neutral-900 py-1 px-2'
          id='cropperSection_integerCheckbox'
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
          className='px-2 py-1 bg-neutral-900'
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
