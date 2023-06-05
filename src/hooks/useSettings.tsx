import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';

import sdv from '../assets/settingsDefaultValues.json';
import { idbAddElement, idbEditElement, idbGetElement } from '../database/actions';
import { useLoader } from './useLoader';

export interface SettingsProps {
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
  settings: SettingsProps;

  updateProjectName: (name: string) => void;
  updateCanvasSize: (w: number, h: number) => void;
  updateBlurAmount: (amount: number) => void;
  updateIntegerScaleValue: (scale: number) => void;
  updateGuideType: (guide: GuideProps) => void;
  invertCanvasValues: () => void;
  toggleImageBlur: (value?: boolean) => void;
  toggleIntegerScale: (value?: boolean) => void;
  toggleSmoothRendering: (value?: boolean) => void;
  saveInOneGo: (data: SettingsProps) => void;
}

const SettingsContext = createContext<SettingsContextData>({} as SettingsContextData);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { showLoader, hideLoader } = useLoader();
  const [settings, setSettings] = useState<SettingsProps>({
    id: 1001001,
    projectName: sdv.projectName,
    blurAmount: sdv.blurAmount,
    canvasSize: {
      w: sdv.canvasSize.w,
      h: sdv.canvasSize.h,
    },
    integerScale: sdv.integerScale,
    integerScaleValue: sdv.integerScaleValue,
    smoothRendering: sdv.smoothRendering,
    showBlur: sdv.showBlur,
    guideType: sdv.guideType,
  });

  /**
   * Update Project Name
   */
  function updateProjectName(projectName: string) {
    if (projectName) {
      setSettings({ ...settings, projectName });
    }
  }

  /**
   * Update Canvas Size
   */
  function updateCanvasSize(w: number, h: number) {
    if (w >= 0 && w <= 3000) {
      setSettings({
        ...settings,
        canvasSize: {
          w,
          h: h < 0 ? settings.canvasSize.h : h,
        },
      });
    }
    if (h >= 0 && h <= 3000) {
      setSettings({
        ...settings,
        canvasSize: {
          w: w < 0 ? settings.canvasSize.w : w,
          h,
        },
      });
    }
  }

  /**
   * Invert Canvas Values
   */
  function invertCanvasValues() {
    setSettings({
      ...settings,
      canvasSize: {
        w: settings.canvasSize.h,
        h: settings.canvasSize.w,
      },
    });
  }

  /**
   * Update Blur Amount
   */
  function updateBlurAmount(amount: number) {
    if (0 <= amount && amount <= 180) {
      setSettings({
        ...settings,
        blurAmount: amount,
      });
    }
  }

  /**
   * Toggle Smooth Rendering
   */
  function toggleSmoothRendering() {
    setSettings({
      ...settings,
      smoothRendering: !settings.smoothRendering,
    });
  }

  /**
   * Update Integer Scale
   */
  function updateIntegerScaleValue(integerScaleValue: number) {
    if (integerScaleValue >= 1 && integerScaleValue <= 32) {
      setSettings({
        ...settings,
        integerScaleValue,
      });
    } else {
      return null;
    }
  }

  /**
   * Toggle Canvas to show blurred variant
   */
  function toggleImageBlur() {
    setSettings({
      ...settings,
      showBlur: !settings.showBlur,
    });
  }

  /**
 * Toggle canvas to zoom image in integer or floating point number
 */
  function toggleIntegerScale() {
    setSettings({
      ...settings,
      integerScale: !settings.integerScale,
    });
  }

  /**
 * Update Guide type
 */
  function updateGuideType(guideType: GuideProps) {
    setSettings({
      ...settings,
      guideType,
    });
  }

  const firstUpdate = useRef(true);

  useEffect(() => {
    async function saveSettings() {
      return await idbEditElement('albedoSettings', 1001001, settings);
    }
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    saveSettings();
  }, [settings]);

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

  /**
   * Save
   */
  function saveInOneGo(data: SettingsProps) {
    setSettings(data);
  }

  async function getExistentData() {
    showLoader();
    await asyncCallTimeout(idbGetElement('albedoSettings', 1001001), 5000).then(async (result) => {

      if (result) {
        const data: SettingsProps = result as SettingsProps;
        saveInOneGo(data);

      } else {
        const data: SettingsProps = {
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
      settings,
      updateProjectName,
      updateCanvasSize,
      updateBlurAmount,
      invertCanvasValues,
      toggleSmoothRendering,
      updateIntegerScaleValue,
      toggleImageBlur,
      toggleIntegerScale,
      updateGuideType,
      saveInOneGo,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};


export function useSettings() {
  const context = useContext(SettingsContext);

  return context;
}