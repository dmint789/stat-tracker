import {StyleSheet} from 'react-native';

export default GS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  modalBackground: {
    width: '80%',
    borderRadius: 30,
    padding: 30,
    marginTop: 100,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    elevation: 16,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  text: {
    marginBottom: 6,
    fontSize: 18,
    color: 'black',
  },
  nameText: {
    color: '#555',
  },
  commentText: {
    marginBottom: 10,
    fontSize: 17,
    color: '#555',
  },
  normalText: {
    margin: 20,
    fontSize: 18,
    color: 'black',
  },
  smallText: {
    fontSize: 16,
    color: 'grey',
  },
  infoText: {
    margin: 20,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
  },
  input: {
    color: 'black',
    fontSize: 18,
    marginBottom: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  card: {
    position: 'relative',
    marginTop: 12,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'pink',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  bottomButtons: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 10,
    right: 10,
  },
});
