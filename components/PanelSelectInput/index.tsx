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
          style={i.isSelected ? styles.selectedOption : styles.unselectedOption}
        >
          <View style={styles.iconContainer}>
            {i.isSelected ? (
              <SelectedCircleIcon width="32" />
            ) : (
              <UnselectedCircleIcon width="32" />
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

    marginTop: 8,
  },
  unselectedOption: {
    borderRadius: 4,
    backgroundColor: '#7c7c7d',
    height: 48,
    width: '100%',

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 8,
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
