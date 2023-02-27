import { createContext } from 'react';

import { TimePickerMode } from '../services/UserPreferences.service';

export interface PreferencesContextType {
  timePickerMode: TimePickerMode;
  setTimePickerMode: (mode: TimePickerMode) => Promise<any>;
}
// @ts-ignore
const PreferencesContext = createContext<PreferencesContextType>();
export default PreferencesContext;
