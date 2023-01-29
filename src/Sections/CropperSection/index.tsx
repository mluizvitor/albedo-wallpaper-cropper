import { ArrowsClockwise } from "phosphor-react";
import { useCanvas } from "../../hooks/useCanvas";
import { MenuSection } from "../../components/Section";
import Input from "../../components/Input";
import { ChangeEvent } from "react";
import { SideBar } from "../../components/SideBar";

export function CropperSection() {

  const { canvasWidth, canvasHeight, blurAmount, updateSizes, invertSizes, updateBlur } = useCanvas();
  return (
    <SideBar anchor={"left"}>
      <header className="bg-stone-600 border-b border-stone-500 px-6 py-3">
        <h1 className="text-2xl font-bold uppercase">Image Handler</h1>
      </header>

      <MenuSection title="Crop" className="grid gap-2 grid-cols-[1fr_auto_1fr] place-items-end">
        <Input id={"imageWidth"}
          label={"Width"}
          type={"number"}
          className="w-full"
          max={1920}
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
          max={1920}
          min={0}
          value={canvasHeight}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateSizes(-1, Number(e.target.value))}
        />
      </MenuSection>


      <MenuSection title="Presets" className="flex flex-wrap gap-2">
        <button className="px-3 h-12 rounded-xl text-sm font-semibold bg-stone-700 flex-1" onClick={() => { updateSizes(480, 320) }}>480x320</button>
        <button className="px-3 h-12 rounded-xl text-sm font-semibold bg-stone-700 flex-1" onClick={() => updateSizes(640, 480)}>640x480</button>
        <button className="px-3 h-12 rounded-xl text-sm font-semibold bg-stone-700 flex-1" onClick={() => updateSizes(1920, 1152)}>1920x1152</button>
      </MenuSection>


      <MenuSection title="Other Settings">
        <Input label={"Create .blurred variant"}
          id={"croppedVariant"}
          type={"checkbox"}
        />
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
