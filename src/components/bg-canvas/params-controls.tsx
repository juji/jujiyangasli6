"use client";
import { useState } from "react";
import { DEFAULT_PARAMS } from "./defaultParamsValues";
import styles from "./params-controls.module.css";

interface ParamsControlsProps {
  onParamsChange: (params: {
    temperature?: number;
    tint?: number;
    contrast?: number;
    brightness?: number;
    gamma?: number;
    saturation?: number;
    vibrance?: number;
    lift?: number;
    gain?: number;
    exposure?: number;
    clarity?: number;
  }) => void;
}

export function ParamsControls({ onParamsChange }: ParamsControlsProps) {
  const [temperature, setTemperature] = useState<number>(
    DEFAULT_PARAMS.temperature,
  );
  const [tint, setTint] = useState<number>(DEFAULT_PARAMS.tint);
  const [contrast, setContrast] = useState<number>(DEFAULT_PARAMS.contrast);
  const [brightness, setBrightness] = useState<number>(
    DEFAULT_PARAMS.brightness,
  );
  const [gamma, setGamma] = useState<number>(DEFAULT_PARAMS.gamma);
  const [saturation, setSaturation] = useState<number>(
    DEFAULT_PARAMS.saturation,
  );
  const [vibrance, setVibrance] = useState<number>(DEFAULT_PARAMS.vibrance);
  const [lift, setLift] = useState<number>(DEFAULT_PARAMS.lift);
  const [gain, setGain] = useState<number>(DEFAULT_PARAMS.gain);
  const [exposure, setExposure] = useState<number>(DEFAULT_PARAMS.exposure);
  const [clarity, setClarity] = useState<number>(DEFAULT_PARAMS.clarity);
  const [isVisible, setIsVisible] = useState(false);

  // Handle mousewheel events to allow page scrolling
  const handleWheel = (e: React.WheelEvent) => {
    const target = e.currentTarget as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    // If we're at the top and scrolling up, or at the bottom and scrolling down
    // let the event bubble up to allow page scrolling
    if (
      (scrollTop === 0 && e.deltaY < 0) ||
      (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0)
    ) {
      // Don't prevent default - let the page scroll
      return;
    }

    // Otherwise, prevent the event from bubbling to avoid page scrolling
    e.stopPropagation();
  };

  const handleTemperatureChange = (value: number) => {
    setTemperature(value);
    onParamsChange({ temperature: value, tint });
  };

  const handleTintChange = (value: number) => {
    setTint(value);
    onParamsChange({ temperature, tint: value });
  };

  const handleContrastChange = (value: number) => {
    setContrast(value);
    onParamsChange({ contrast: value, brightness, gamma });
  };

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    onParamsChange({ contrast, brightness: value, gamma });
  };

  const handleGammaChange = (value: number) => {
    setGamma(value);
    onParamsChange({ contrast, brightness, gamma: value });
  };

  const handleSaturationChange = (value: number) => {
    setSaturation(value);
    onParamsChange({
      saturation: value,
      vibrance,
      lift,
      gain,
      exposure,
      clarity,
    });
  };

  const handleVibranceChange = (value: number) => {
    setVibrance(value);
    onParamsChange({
      saturation,
      vibrance: value,
      lift,
      gain,
      exposure,
      clarity,
    });
  };

  const handleLiftChange = (value: number) => {
    setLift(value);
    onParamsChange({
      saturation,
      vibrance,
      lift: value,
      gain,
      exposure,
      clarity,
    });
  };

  const handleGainChange = (value: number) => {
    setGain(value);
    onParamsChange({
      saturation,
      vibrance,
      lift,
      gain: value,
      exposure,
      clarity,
    });
  };

  const handleExposureChange = (value: number) => {
    setExposure(value);
    onParamsChange({
      saturation,
      vibrance,
      lift,
      gain,
      exposure: value,
      clarity,
    });
  };

  const handleClarityChange = (value: number) => {
    setClarity(value);
    onParamsChange({
      saturation,
      vibrance,
      lift,
      gain,
      exposure,
      clarity: value,
    });
  };

  if (!isVisible) {
    return (
      <button
        type="button"
        className={styles.toggleButton}
        onClick={() => setIsVisible(true)}
        title="Show Parameter Controls"
      >
        🎨
      </button>
    );
  }

  return (
    <div className={styles.controls} onWheel={handleWheel}>
      <div className={styles.header}>
        <h3>Parameter Controls</h3>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => setIsVisible(false)}
          title="Hide Controls"
        >
          ×
        </button>
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.label}>
          Temperature: {temperature.toFixed(2)}
          <button
            type="button"
            className={styles.resetIndividual}
            onClick={() => handleTemperatureChange(DEFAULT_PARAMS.temperature)}
            title="Reset Temperature"
          >
            ↺
          </button>
          <span className={styles.hint}>
            {temperature > 0
              ? "Warmer"
              : temperature < 0
                ? "Cooler"
                : "Neutral"}
          </span>
        </label>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.01"
          value={temperature}
          onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.label}>
          Tint: {tint.toFixed(2)}
          <button
            type="button"
            className={styles.resetIndividual}
            onClick={() => handleTintChange(DEFAULT_PARAMS.tint)}
            title="Reset Tint"
          >
            ↺
          </button>
          <span className={styles.hint}>
            {tint > 0 ? "Magenta" : tint < 0 ? "Green" : "Neutral"}
          </span>
        </label>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.01"
          value={tint}
          onChange={(e) => handleTintChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.sectionDivider}></div>

      <div className={styles.sectionTitle}>Image Adjustments</div>

      <div className={styles.sliderGroup}>
        <label className={styles.label}>
          Contrast: {contrast.toFixed(2)}
          <button
            type="button"
            className={styles.resetIndividual}
            onClick={() => handleContrastChange(DEFAULT_PARAMS.contrast)}
            title="Reset Contrast"
          >
            ↺
          </button>
          <span className={styles.hint}>
            {contrast < 1 ? "Lower" : contrast > 1 ? "Higher" : "Normal"}
          </span>
        </label>
        <input
          type="range"
          min="0.5"
          max="3.0"
          step="0.1"
          value={contrast}
          onChange={(e) => handleContrastChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.label}>
          Brightness: {brightness.toFixed(2)}
          <button
            type="button"
            className={styles.resetIndividual}
            onClick={() => handleBrightnessChange(DEFAULT_PARAMS.brightness)}
            title="Reset Brightness"
          >
            ↺
          </button>
          <span className={styles.hint}>
            {brightness < 1.0
              ? "Darker"
              : brightness > 1.0
                ? "Brighter"
                : "Default"}
          </span>
        </label>
        <input
          type="range"
          min="0.2"
          max="2.0"
          step="0.1"
          value={brightness}
          onChange={(e) => handleBrightnessChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.label}>
          Gamma: {gamma.toFixed(2)}
          <button
            type="button"
            className={styles.resetIndividual}
            onClick={() => handleGammaChange(DEFAULT_PARAMS.gamma)}
            title="Reset Gamma"
          >
            ↺
          </button>
          <span className={styles.hint}>
            {gamma < 1.0
              ? "Darker midtones"
              : gamma > 1.0
                ? "Brighter midtones"
                : "Default"}
          </span>
        </label>
        <input
          type="range"
          min="0.5"
          max="2.5"
          step="0.1"
          value={gamma}
          onChange={(e) => handleGammaChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.sectionDivider}></div>

      <div className={styles.sectionTitle}>Advanced Color</div>

      <div className={styles.sliderGroup}>
        <label className={styles.label}>
          Saturation: {saturation.toFixed(2)}
          <button
            type="button"
            className={styles.resetIndividual}
            onClick={() => handleSaturationChange(DEFAULT_PARAMS.saturation)}
            title="Reset Saturation"
          >
            ↺
          </button>
          <span className={styles.hint}>
            {saturation < 1 ? "Muted" : saturation > 1 ? "Vivid" : "Normal"}
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.01"
          value={saturation}
          onChange={(e) => handleSaturationChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.label}>
          Vibrance: {vibrance.toFixed(2)}
          <button
            type="button"
            className={styles.resetIndividual}
            onClick={() => handleVibranceChange(DEFAULT_PARAMS.vibrance)}
            title="Reset Vibrance"
          >
            ↺
          </button>
          <span className={styles.hint}>
            {vibrance > 0
              ? "More vivid colors"
              : vibrance < 0
                ? "Less vivid colors"
                : "Normal"}
          </span>
        </label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={vibrance}
          onChange={(e) => handleVibranceChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.label}>
          Lift: {lift.toFixed(2)}
          <button
            type="button"
            className={styles.resetIndividual}
            onClick={() => handleLiftChange(DEFAULT_PARAMS.lift)}
            title="Reset Lift"
          >
            ↺
          </button>
          <span className={styles.hint}>
            {lift > 0
              ? "Brighter shadows"
              : lift < 0
                ? "Darker shadows"
                : "Normal"}
          </span>
        </label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={lift}
          onChange={(e) => handleLiftChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.label}>
          Gain: {gain.toFixed(2)}
          <button
            type="button"
            className={styles.resetIndividual}
            onClick={() => handleGainChange(DEFAULT_PARAMS.gain)}
            title="Reset Gain"
          >
            ↺
          </button>
          <span className={styles.hint}>
            {gain > 1
              ? "Brighter highlights"
              : gain < 1
                ? "Darker highlights"
                : "Normal"}
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={gain}
          onChange={(e) => handleGainChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.label}>
          Exposure: {exposure.toFixed(2)}
          <button
            type="button"
            className={styles.resetIndividual}
            onClick={() => handleExposureChange(DEFAULT_PARAMS.exposure)}
            title="Reset Exposure"
          >
            ↺
          </button>
          <span className={styles.hint}>
            {exposure > 0 ? "Brighter" : exposure < 0 ? "Darker" : "Normal"}
          </span>
        </label>
        <input
          type="range"
          min="-4"
          max="4"
          step="0.01"
          value={exposure}
          onChange={(e) => handleExposureChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.label}>
          Clarity: {clarity.toFixed(2)}
          <button
            type="button"
            className={styles.resetIndividual}
            onClick={() => handleClarityChange(DEFAULT_PARAMS.clarity)}
            title="Reset Clarity"
          >
            ↺
          </button>
          <span className={styles.hint}>
            {clarity > 0 ? "Sharper" : clarity < 0 ? "Softer" : "Normal"}
          </span>
        </label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={clarity}
          onChange={(e) => handleClarityChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
      </div>

      <button
        type="button"
        className={styles.resetButton}
        onClick={() => {
          setTemperature(DEFAULT_PARAMS.temperature);
          setTint(DEFAULT_PARAMS.tint);
          setContrast(DEFAULT_PARAMS.contrast);
          setBrightness(DEFAULT_PARAMS.brightness);
          setGamma(DEFAULT_PARAMS.gamma);
          setSaturation(DEFAULT_PARAMS.saturation);
          setVibrance(DEFAULT_PARAMS.vibrance);
          setLift(DEFAULT_PARAMS.lift);
          setGain(DEFAULT_PARAMS.gain);
          setExposure(DEFAULT_PARAMS.exposure);
          setClarity(DEFAULT_PARAMS.clarity);
          onParamsChange({
            temperature: DEFAULT_PARAMS.temperature,
            tint: DEFAULT_PARAMS.tint,
            contrast: DEFAULT_PARAMS.contrast,
            brightness: DEFAULT_PARAMS.brightness,
            gamma: DEFAULT_PARAMS.gamma,
            saturation: DEFAULT_PARAMS.saturation,
            vibrance: DEFAULT_PARAMS.vibrance,
            lift: DEFAULT_PARAMS.lift,
            gain: DEFAULT_PARAMS.gain,
            exposure: DEFAULT_PARAMS.exposure,
            clarity: DEFAULT_PARAMS.clarity,
          });
        }}
      >
        Reset All
      </button>
    </div>
  );
}
