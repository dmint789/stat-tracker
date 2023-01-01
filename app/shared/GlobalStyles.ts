import { StyleSheet } from 'react-native';

export const xsFontSize = 16;
export const smFontSize = 17;
export const mdFontSize = 18;
export const lgFontSize = 22;

export const darkGray = '#555';

export const xxsGap = 6;
export const xsGap = 10;
export const smGap = 12;
export const mdGap = 16;
export const lgGap = 20;
export const xlGap = 30;

const largeShadow = {
  shadowColor: 'black',
  shadowOpacity: 0.5,
  elevation: 16,
};

const smallShadow = {
  shadowColor: 'black',
  shadowOpacity: 0.5,
  elevation: 5,
};

const cardStyle = {
  borderRadius: 10,
  backgroundColor: 'pink',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxHeight: '62%',
    width: '80%',
    padding: lgGap,
    borderRadius: 30,
    backgroundColor: 'white',
    ...largeShadow,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollableArea: {
    flex: 1,
    paddingHorizontal: lgGap,
  },
  textMar: {
    marginBottom: xxsGap,
    fontSize: mdFontSize,
    color: 'black',
  },
  text: {
    fontSize: mdFontSize,
    color: 'black',
  },
  whiteText: {
    fontSize: mdFontSize,
    color: 'white',
  },
  darkGrayText: {
    fontSize: mdFontSize,
    color: darkGray,
  },
  commentText: {
    marginBottom: xsGap,
    fontSize: smFontSize,
    color: darkGray,
  },
  normalText: {
    fontSize: mdFontSize,
    color: 'black',
    marginBottom: lgGap,
  },
  titleText: {
    marginTop: xxsGap,
    marginBottom: mdGap,
    textAlign: 'center',
    fontSize: lgFontSize,
    fontWeight: 'bold',
    color: 'black',
  },
  smallGrayText: {
    fontSize: xsFontSize,
    color: 'gray',
  },
  infoText: {
    margin: lgGap,
    textAlign: 'center',
    fontSize: mdFontSize,
    color: 'black',
  },
  input: {
    maxHeight: 130,
    marginBottom: xsGap,
    paddingVertical: xxsGap,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    fontSize: mdFontSize,
    color: 'black',
  },
  bigCard: {
    ...cardStyle,
    position: 'relative',
    marginTop: smGap,
    marginHorizontal: mdGap,
    padding: mdGap,
    ...smallShadow,
  },
  smallCard: {
    ...cardStyle,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: xsGap,
    paddingVertical: xsGap,
    paddingHorizontal: mdGap,
  },
  buttonRowButton: {
    flex: 1,
    margin: xsGap,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: lgGap,
  },
  cardButtons: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: xsGap,
    right: xsGap,
  },
});
