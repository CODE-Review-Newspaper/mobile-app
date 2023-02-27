import * as SecureStorage from 'expo-secure-store';

import { DEFAULT_TIMEPICKER_MODE } from '../data/views.data';

export interface TimePickerMode {
  id: string;
  displayName: string;
  startHours: number;
  endHours: number;
  rangeHours: number;
}

export default class UserPreferences {
  static timePickerIntervalKey = 'preferences.timePickerInterval';

  static async setTimePickerInterval(intervalPreference: TimePickerMode) {
    const jsonValue = JSON.stringify(intervalPreference);

    await SecureStorage.setItemAsync(this.timePickerIntervalKey, jsonValue);

    return intervalPreference;
  }

  static async getTimePickerInterval(): Promise<TimePickerMode> {
    const jsonValue = await SecureStorage.getItemAsync(
      this.timePickerIntervalKey
    );

    if (jsonValue == null) {
      await this.setTimePickerInterval(DEFAULT_TIMEPICKER_MODE);

      return DEFAULT_TIMEPICKER_MODE;
    }
    const intervalPreference: TimePickerMode = JSON.parse(jsonValue);

    return intervalPreference;
  }
}
