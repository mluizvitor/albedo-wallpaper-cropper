import { ArrowsClockwise, CheckSquare, Square } from "phosphor-react";
import { useCanvas } from "../../hooks/useCanvas";
import { MenuSection } from "../../components/Section";
import Input from "../../components/Input";
import { ChangeEvent } from "react";
import { SideBar } from "../../components/SideBar";
import Checkbox from "../../components/Checkbox";
import Button from "../../components/Button";

export function CropperSection() {

  const { canvasWidth, canvasHeight, blurAmount, integerScale, updateSizes, invertSizes, updateBlur, toggleIntegerScale } = useCanvas();
  return (
    <SideBar anchor={"left"}>
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

        <button className="p-2 bg-slate-500 text-gray-50 rounded-xl shrink" onClick={invertSizes}>
          <ArrowsClockwise size={24} weight="bold" />
        </button>

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

      <MenuSection title="Presets" className="flex flex-wrap gap-2">
        <Button className="justify-center flex-1" label="480x320" onClick={() => updateSizes(480, 320)} />
        <Button className="justify-center flex-1" label="640x480" onClick={() => updateSizes(640, 480)} />
        <Button className="justify-center flex-1" label="1920x1152" onClick={() => updateSizes(1920, 1152)} />
      </MenuSection>


      <MenuSection title="Other Settings">
        <Checkbox
          className="bg-stone-700 py-1 px-2"
          id={"integerCheckbox"} checked={integerScale} label={"Use integer scale"} triggerMethod={toggleIntegerScale} />

        <Input label={"Blur"}
          helperText="0 to 180"
          id={"imageBlur"}
          type={"number"}
          className="mt-4"
          value={blurAmount}
          min={0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateBlur(Number(e.target.value))} />
      </MenuSection>
    </SideBar>
  )
}
