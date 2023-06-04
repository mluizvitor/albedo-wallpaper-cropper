import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';

import sdv from '../assets/settingsDefaultValues.json';
import { idbAddElement, idbEditElement, idbGetElement } from '../database/actions';
import { useLoader } from './useLoader';

export interface settingsProps {
  id: number,
  projectName: string,
  canvasSize: CanvasSizeProps,
  guideType: GuideProps,
  blurAmount: number,
  integerScale: boolean,
  integerScaleValue: number,
  smoothRendering: boolean
  showBlur: boolean
}

export interface CanvasSizeProps {
  w: number,
  h: number
}

const guideNames = ['none', 'albedo', 'elementerial'];
export type GuideProps = typeof guideNames[number];

interface SettingsContextData {
  projectName: string;
  canvasSize: CanvasSizeProps;
  blurAmount: number;
  integerScale: boolean;
  integerScaleValue: number
  smoothRendering: boolean;
  showBlur: boolean;
  guideType: GuideProps;

  updateProjectName: (name: string) => void;
  updateCanvasSize: (w: number, h: number) => void;
  updateBlurAmount: (amount: number) => void;
  updateIntegerScaleValue: (scale: number) => void;
  updateGuideType: (guide: GuideProps) => void;
  invertCanvasValues: () => void;
  toggleImageBlur: (value?: boolean) => void;
  toggleIntegerScale: (value?: boolean) => void;
  toggleSmoothRendering: (value?: boolean) => void;
}

const SettingsContext = createContext<SettingsContextData>({} as SettingsContextData);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [projectName, setProjectName] = useState(sdv.projectName);
  const [blurAmount, setBlurAmount] = useState(sdv.blurAmount);
  const [canvasSize, setCanvasSize] = useState<CanvasSizeProps>({ w: sdv.canvasSize.w, h: sdv.canvasSize.h });
  const [integerScale, setIntegerScale] = useState(sdv.integerScale);
  const [integerScaleValue, setIntegerScaleValue] = useState(sdv.integerScaleValue);
  const [smoothRendering, setSmoothRendering] = useState(sdv.smoothRendering);
  const [showBlur, setShowBlur] = useState(sdv.showBlur);
  const [guideType, setGuideType] = useState<GuideProps>(sdv.guideType);

  const { showLoader, hideLoader } = useLoader();

  /**
   * Update Project Name
   */
  function updateProjectName(name: string) {
    if (name) {
      setProjectName(name);
    }
  }

  /**
   * Update Canvas Size
   */
  function updateCanvasSize(w: number, h: number) {
    if (w >= 0 && w <= 3000) {
      setCanvasSize({ w, h: h < 0 ? canvasSize.h : h });
    }
    if (h >= 0 && h <= 3000) {
      setCanvasSize({ w: w < 0 ? canvasSize.w : w, h });
    }
  }

  /**
   * Invert Canvas Values
   */
  function invertCanvasValues() {
    const newWidth = canvasSize.h;
    const newHeight = canvasSize.w;
    setCanvasSize({ w: newWidth, h: newHeight });
  }

  /**
   * Update Blur Amount
   */
  function updateBlurAmount(amount: number) {
    if (0 <= amount && amount <= 180) {
      setBlurAmount(amount);
    }
  }

  /**
   * Toggle Smooth Rendering
   */
  function toggleSmoothRendering() {
    setSmoothRendering(!smoothRendering);
  }

  function updateSmoothRendering(value: boolean) {
    setSmoothRendering(value);
  }

  /**
   * Update Integer Scale
   */
  function updateIntegerScaleValue(scale: number) {
    if (scale >= 1 && scale <= 32) {
      setIntegerScaleValue(scale);
    } else {
      return null;
    }
  }

  /**
   * Toggle Canvas to show blurred variant
   */
  function toggleImageBlur() {
    setShowBlur(!showBlur);
  }

  function updateImageBlur(value: boolean) {
    setShowBlur(value);
  }

  /**
   * Toggle canvas to zoom image in integer or floating point number
   */
  function toggleIntegerScale() {
    setIntegerScale(!integerScale);
  }

  function updateIntegerScale(value: boolean) {
    setIntegerScale(value);
  }

  /**
   * Update Guide type
   */
  function updateGuideType(guide: GuideProps) {
    setGuideType(guide);
  }

  const firstUpdate = useRef(true);

  useEffect(() => {
    async function saveSettings() {
      return await idbEditElement('albedoSettings', 1001001, {
        id: 1001001,
        blurAmount,
        canvasSize,
        guideType,
        integerScale,
        integerScaleValue,
        projectName,
        showBlur,
        smoothRendering,
      });
    }
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    saveSettings();
  }, [
    blurAmount,
    canvasSize,
    guideType,
    integerScale,
    integerScaleValue,
    projectName,
    showBlur,
    smoothRendering
  ]);

  const asyncCallTimeout = async (asyncPromise: unknown, timeLimit: number) => {
    let timeoutHandle: NodeJS.Timeout;

    const timeoutPromise = new Promise((_resolve, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error('Timeout reached')),
        timeLimit
      );
    });

    return Promise.race([asyncPromise, timeoutPromise]).then((result) => {
      clearTimeout(timeoutHandle);
      return result;
    });
  };

  async function getExistentData() {
    showLoader();
    await asyncCallTimeout(idbGetElement('albedoSettings', 1001001), 5000).then(async (result) => {

      if (result) {
        const data: settingsProps = result as settingsProps;

        updateProjectName(data.projectName);
        updateCanvasSize(data.canvasSize.w, data.canvasSize.h);
        updateGuideType(data.guideType);
        updateBlurAmount(data.blurAmount);
        updateIntegerScaleValue(data.integerScaleValue);
        updateIntegerScale(data.integerScale);
        updateSmoothRendering(data.smoothRendering);
        updateImageBlur(data.showBlur);

      } else {
        const data: settingsProps = {
          id: 1001001,
          projectName: sdv.projectName,
          canvasSize: { w: sdv.canvasSize.w, h: sdv.canvasSize.h },
          guideType: sdv.guideType,
          blurAmount: sdv.blurAmount,
          integerScale: sdv.integerScale,
          integerScaleValue: sdv.integerScaleValue,
          smoothRendering: sdv.smoothRendering,
          showBlur: sdv.showBlur,
        };

        idbAddElement('albedoSettings', data);
      };
    });
    setTimeout(() => {
      hideLoader();
    }, 2000);
  }

  useEffect(() => {
    getExistentData();
  }, []);

  return (
    <SettingsContext.Provider value={{
      projectName,
      blurAmount,
      canvasSize,
      integerScale,
      integerScaleValue,
      smoothRendering,
      showBlur,
      guideType,
      updateProjectName,
      updateCanvasSize,
      updateBlurAmount,
      invertCanvasValues,
      toggleSmoothRendering,
      updateIntegerScaleValue,
      toggleImageBlur,
      toggleIntegerScale,
      updateGuideType,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};


export function useSettings() {
  const context = useContext(SettingsContext);

  return context;
}