import { Pressable, StyleSheet } from 'react-native';

import SelectedCircleIcon from '../../assets/icons/selectableCircle/selectedCircle.svg';
import UnselectedCircleIcon from '../../assets/icons/selectableCircle/unselectedCircle.svg';
import { Text, View } from '../Themed';

export interface PanelSelectInputOption {
  id: string;
  displayName: string;

  isSelected: boolean;
}
export interface PanelSelectInputProps {
  options: PanelSelectInputOption[];

  onOptionClick: (option: PanelSelectInputOption) => any;
}
export default function PanelSelectInput({
  options,
  onOptionClick,
}: PanelSelectInputProps) {
  return (
    <View style={styles.panelSelect}>
      {options.map((i) => (
        <Pressable
          key={i.id}
          onPress={() => onOptionClick(i)}
          style={({ pressed }) => [
            i.isSelected ? styles.selectedOption : styles.unselectedOption,
            pressed && {
              backgroundColor: i.isSelected ? '#fe746a' : '#848484',
            },
          ]}
        >
          <View style={styles.iconContainer}>
            {i.isSelected ? (
              <SelectedCircleIcon width="22" height="22" />
            ) : (
              <UnselectedCircleIcon width="22" height="22" />
            )}
          </View>
          <Text style={styles.optionText}>{i.displayName}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panelSelect: {
    flexDirection: 'column',

    backgroundColor: 'transparent',
  },
  selectedOption: {
    borderRadius: 4,
    backgroundColor: '#FF6961',
    height: 48,
    width: '100%',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 4,
  },
  unselectedOption: {
    borderRadius: 4,
    backgroundColor: '#7c7c7c',
    height: 48,
    width: '100%',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 4,
  },
  iconContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',

    aspectRatio: 1,

    height: '100%',
  },
  optionText: {
    color: 'white',
    fontWeight: '900',
  },
});
