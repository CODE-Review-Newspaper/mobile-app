import { StyleSheet } from 'react-native';

const baseBg = {
  backgroundColor: '#111',
  // borderColor: '#333',
  // borderWidth: 1,
  borderRadius: 4,

  // backgroundColor: "white",
  // borderColor: "transparent",
};

const baseText = {
  color: 'white',

  // color: "#444",
};

const overlayElementsStyles = StyleSheet.create({
  bigOverlayText: {
    ...baseText,

    fontWeight: '700',

    fontSize: 20,
  },
  smallOverlayText: {
    ...baseText,

    fontSize: 16,
  },
  bigOverlayElement: {
    ...baseBg,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: 48,
    paddingHorizontal: 16,

    fontSize: 20,
  },
  bigOverlaySquare: {
    ...baseBg,

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    width: 48,
    height: 48,

    fontSize: 20,
  },
  smallOverlayElement: {
    ...baseBg,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: 32,
    paddingHorizontal: 8,

    fontSize: 16,
  },
  smallOverlaySquare: {
    ...baseBg,

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    width: 32,
    height: 32,

    fontSize: 16,
  },
});
export default overlayElementsStyles;
