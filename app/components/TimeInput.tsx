import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import GS from '../shared/GlobalStyles';
import { getTimeString } from '../shared/GlobalFunctions';

const TimeInput: React.FC<{
  value: number; // this is set to -1 if the currently entered time is invalid
  decimals: number;
  placeholder: string;
  placeholderTextColor: string;
  dontShowTimeWhenZero?: boolean;
  changeTime: (value: number) => void;
}> = ({ value, decimals, placeholder, placeholderTextColor, dontShowTimeWhenZero = false, changeTime }) => {
  const [timeValue, setTimeValue] = useState<string>('');
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    // if (value > 0 || !dontShowTimeWhenZero) {
    const tempTimeValue = getTimeString(value, decimals);
    setTimeValue(tempTimeValue);
    updateTime(tempTimeValue, true);
    // }
  }, []);

  useEffect(() => {
    // Update timeValue if the new value is a valid time
    if (value !== -1) {
      const tempTimeValue = getTimeString(value, decimals);
      setTimeValue(tempTimeValue);
      updateTime(tempTimeValue, true);
    }
  }, [value]);

  useEffect(() => {
    // if (value !== 0 || !dontShowTimeWhenZero) {
    //   let tempTimeValue = timeValue;

    //   // init timeValue
    //   if (value > 0 && timeValue === '') {
    //     tempTimeValue = getTimeString(value, false);
    //     setTimeValue(tempTimeValue);
    //   }

    //   updateTime(tempTimeValue);
    // }
    if (timeValue !== '') {
      updateTime(timeValue, true);
    }
  }, [decimals]);

  const onChangeTime = (e: any) => {
    let newTimeValue = timeValue;

    if (e.nativeEvent.key === 'Backspace') {
      newTimeValue = newTimeValue.slice(0, -1);
    } else if (!/[^0-9]/.test(e.nativeEvent.key) && timeValue.length < decimals + 8) {
      if (e.nativeEvent.key !== '0' || timeValue !== '') {
        newTimeValue += e.nativeEvent.key;
      }
    }

    if (newTimeValue !== timeValue) {
      setTimeValue(newTimeValue);
      updateTime(newTimeValue);
    }
  };

  const updateTime = (newTimeValue: string, formattedTimeOnly = false) => {
    const noDecimals = newTimeValue.length - decimals;

    if (!formattedTimeOnly) {
      // Test validity of the time
      let newTime = -1; //setting new time as invalid by default
      const multiplier = Math.pow(10, decimals);

      if (newTimeValue.length > decimals + 1) {
        const seconds = Number(newTimeValue.slice(noDecimals - 2)); // seconds, but without decimal point

        if (seconds < 60 * multiplier) {
          let minutes = 0;

          if (newTimeValue.length > decimals + 3) {
            minutes = Number(newTimeValue.slice(noDecimals - 4, noDecimals - 2));
          } else if (newTimeValue.length > decimals + 2) {
            minutes = Number(newTimeValue[noDecimals - 3]);
          }

          if (minutes < 60) {
            let hours = 0;

            if (newTimeValue.length > decimals + 4) {
              hours = Number(newTimeValue.slice(0, noDecimals - 4));
            }

            newTime = Number(hours * 3600 * multiplier + minutes * 60 * multiplier + seconds);
          }
        }
      } else {
        newTime = Number(newTimeValue);
      }

      changeTime(newTime);
    }

    // Format the displayed time
    const hoursStr = noDecimals > 4 ? newTimeValue.slice(0, noDecimals - 4) : '0';

    let minutesStr: string;
    if (noDecimals > 3) minutesStr = newTimeValue.slice(noDecimals - 4, noDecimals - 2);
    else if (noDecimals > 2) minutesStr = '0' + newTimeValue[noDecimals - 3];
    else minutesStr = '00';

    let secondsStr: string;
    if (noDecimals > 1) secondsStr = newTimeValue.slice(noDecimals - 2, noDecimals);
    else if (noDecimals === 1) secondsStr = '0' + newTimeValue[noDecimals - 1];
    else secondsStr = '00';

    if (decimals > 0) {
      secondsStr +=
        '.' +
        '0'.repeat(Math.max(decimals - newTimeValue.length, 0)) +
        newTimeValue.slice(Math.max(noDecimals, 0));
    }

    setFormattedTime(`${hoursStr}:${minutesStr}:${secondsStr}`);
  };

  // const onFocusChange = (focusOn: boolean) => {
  //   if (focusOn && value === 0) {
  //     setFormattedTime(getTimeString(value));
  //   } else if (!focusOn && dontShowTimeWhenZero && value === 0) {
  //     setFormattedTime('');
  //   }
  // };

  // onFocus={() => onFocusChange(true)}
  // onBlur={() => onFocusChange(false)}
  return (
    <TextInput
      style={{ ...GS.input, color: value === -1 ? 'red' : GS.input.color }}
      value={formattedTime}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      keyboardType="numeric"
      contextMenuHidden={true}
      onKeyPress={onChangeTime}
    />
  );
};

export default TimeInput;
