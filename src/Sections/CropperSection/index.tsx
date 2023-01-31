import { ArrowsClockwise, CheckSquare, Plus, Square } from "phosphor-react";
import { useCanvas } from "../../hooks/useCanvas";
import { MenuSection } from "../../components/Section";
import Input from "../../components/Input";
import { ChangeEvent } from "react";
import { SideBar } from "../../components/SideBar";
import Checkbox from "../../components/Checkbox";
import Button from "../../components/Button";

export function CropperSection() {

  const {
    blurAmount,
    canvasWidth,
    canvasHeight,
    integerScale,
    integerScaleValue,
    showBlur,
    invertSizes,
    updateBlur,
    updateIntegerScale,
    updateSizes,
    toggleImageBlur,
    toggleIntegerScale
  } = useCanvas();
  return (
    <SideBar anchor="right">
      <MenuSection title="Crop" className="z-10 grid gap-2 grid-cols-[1fr_auto_1fr] place-items-end">
        <Input id={"imageWidth"}
          label={"Width"}
          type={"number"}
          className="w-full"
          max={3000}
          min={0}
          value={canvasWidth}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateSizes(Number(e.target.value), -1)}
        />

        <Button label={"Invert"}
          hideLabel
          className="bg-orange-500 px-2"
          icon={<ArrowsClockwise size={24} weight="bold" />}
          onClick={invertSizes}
        />

        <Input id={"imageHeight"}
          label={"Height"}
          type={"number"}
          className="w-full"
          max={3000}
          min={0}
          value={canvasHeight}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateSizes(-1, Number(e.target.value))}
        />
      </MenuSection>

      <MenuSection title="Presets" className="grid grid-cols-2 gap-2">
        <span className="text-sm text-neutral-200 col-span-2">1 : 1</span>
        <Button className="justify-center flex-1" label="320x320" onClick={() => updateSizes(320, 320)} />
        <Button className="justify-center flex-1" label="1920x1920" onClick={() => updateSizes(1920, 1920)} />

        <span className="text-sm text-neutral-200 col-span-2">3 : 2</span>
        <Button className="justify-center flex-1" label="480x320" onClick={() => updateSizes(480, 320)} />
        <Button className="justify-center flex-1" label="1920x1280" onClick={() => updateSizes(1920, 1280)} />

        <span className="text-sm text-neutral-200 col-span-2">4 : 3</span>
        <Button className="justify-center flex-1" label="640x480" onClick={() => updateSizes(640, 480)} />
        <Button className="justify-center flex-1" label="1920x1440" onClick={() => updateSizes(1920, 1440)} />

        <span className="text-sm text-neutral-200 col-span-2">5 : 3</span>
        <Button className="justify-center flex-1" label="1920x1152" onClick={() => updateSizes(1920, 1152)} />
      </MenuSection>

      <MenuSection title="Integer Scale">
        <Checkbox
          className="bg-neutral-700 py-1 px-2"
          id={"integerCheckbox"}
          checked={integerScale}
          label={"Use integer scale"}
          triggerMethod={toggleIntegerScale}
        />
        {integerScale && (
          <Input id={"wow"} label={"Scale"}
            value={integerScaleValue} step="0.1" type={"number"}
            className="mt-4"
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateIntegerScale(Number(e.target.value))}
            helperText="0.1 to 12"
          />
        )}
      </MenuSection>

      <MenuSection title="Blur settings">
        <Checkbox id={"canvasShowBlurredVariant"}
          label={"Show blurred variant"}
          checked={showBlur}
          triggerMethod={toggleImageBlur}
          className="px-2 py-1 bg-neutral-700"
        />
        <Input label={"Blur"}
          helperText="0 to 180"
          id={"imageBlur"}
          type={"number"}
          className="mt-4"
          value={blurAmount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateBlur(Number(e.target.value))} />
      </MenuSection>
    </SideBar>
  )
}
