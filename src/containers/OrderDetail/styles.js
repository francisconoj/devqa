/** @format */

import { StyleSheet, I18nManager, Dimensions } from 'react-native';
import { Color, Constants } from '@common';
import { ScreenStackHeaderCenterView } from 'react-native-screens';

const { width } = Dimensions.get('window');
const cardMargin = Constants.Dimension.ScreenWidth(0.05);

export default StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 0,
    margin: 0,
  },
  contentContainer: {
    marginHorizontal: cardMargin,
  },
  /* Order status */
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 12,
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: 1,
  },
  status: {
    flex: 1,
    width: 137,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  statusText: {
    width: '100%',
    fontSize: 16,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'FuturaBold',
    color: Color.neutralDark,
  },
  statusHint: {
    flex: 1,
    paddingLeft: 12,
    textAlign: 'right',
    fontFamily: 'Mulish',
    fontSize: 14,
  },
  /* Order properties */
  propertyContainer: {
    flexDirection: 'row',
    paddingTop: 13,
    paddingBottom: 13,
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: 1,
  },
  propertyName: {
    flex: 1,
    textAlign: 'left',
    fontFamily: 'Mulish',
    fontSize: 14,
    color: Color.neutralDark,
  },
  propertyValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'MulishBold',
    fontSize: 16,
    color: Color.neutralDark,
  },

  name: (text) => ({
    marginBottom: 4,
    color: text,
    width: Constants.Dimension.ScreenWidth(0.6),
    // paddingHorizontal: 10,
    color: 'darkgray',
  }),
  title: (text) => ({
    marginBottom: 4,
    color: text,
    width: Constants.Dimension.ScreenWidth(0.6),
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  }),
  cancelled: () => ({
    marginBottom: 4,
    color: '#E10B0B',
    width: Constants.Dimension.ScreenWidth(0.6),
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  }),
  completed: () => ({
    marginBottom: 4,
    color: '#0BE137',
    width: Constants.Dimension.ScreenWidth(0.6),
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  }),
  processing: () => ({
    marginBottom: 4,
    color: '#EEF10F',
    width: Constants.Dimension.ScreenWidth(0.6),
    textTransform: 'uppercase',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  }),
  text: (text) => ({
    marginBottom: 4,
    color: text,
    alignSelf: 'center',
    color: 'darkgray',
  }),
  header: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: (text) => ({
    textAlign: 'center',
    fontFamily: Constants.fontHeader,
    fontSize: 20,
    color: '#08eabe',
  }),
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 16,
    fontFamily: Constants.fontFamily,
  },
  itemContainer: {
    paddingTop: 12,
  },
  lineItem: {
    marginBottom: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: '40%',
    paddingHorizontal: 12,
    paddingBottom: 8,
    paddingTop: 3,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'transparent'
  },
  buttonText: {
    fontFamily: 'Futura',
    color: "white",
    fontSize: 16,
    marginHorizontal:10
    
  },
  noteItem: {
    marginBottom: 15,
  },
  noteContent: (text) => ({
    fontSize: 14,
    color: 'darkgray',
    marginTop: 3,
  }),
  noteTime: {
    fontSize: 12,
    color: '#4a4a4a',
    marginTop: 3,
  },
  addressContainer: {
    alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
  },
  buttonOrder: {
    marginTop: 15,
    height: 40,
    width: '40%',
    paddingHorizontal: 12,
    paddingBottom: 8,
    paddingTop: 3,
    borderRadius: 20,
    backgroundColor: Color.primary
  },
  containerButton: {
    fontFamily:'Futura',
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: Color.primary,
    alignSelf: 'center',
    marginVertical: 20,
    marginBottom: 70,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

  },
  centenedView2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalView: {
    backgroundColor: Color.secondary,
    borderRadius: 25,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalView2: {
    width: width - 40,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    margin: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    flexDirection: 'column',
    backgroundColor: Color.primary,
    paddingTop: 13,
    marginRight: 13,
    borderRadius: 20,
    alignSelf: 'flex-end'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    resizeMode: 'contain',
    marginBottom: 20
  },
  survey: {

    color: Color.neutralLight,
    fontFamily: Constants.fontFamily,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: "MulishBold",
    marginBottom: "10%",
    marginHorizontal: "5%"

  },
  input: {
    width: width - 60,
    height: 126,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:15
  },
  input2: {
    fontFamily: Constants.fontFamily,
    width: width - 80,
    height: 120,
    overflow: 'hidden',
    backgroundColor: "white",
    justifyContent: 'center',
    textAlign: 'center'
  },
  btnAdd: {
    fontFamily: Constants.fontHeader,
    width: 300,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    alignSelf: 'center',
    marginBottom: 10,
    fontWeight: "bold",
    shadowOpacity: 1,
    shadowColor: Color.primary,
    shadowRadius: 3,
    shadowOffset: { width: 5, height: 5 },
    elevation: 3,
    borderWidth: 3,
    borderColor: Color.primary,
    
    
  },
  add: {
    fontFamily: Constants.fontHeader,
    textAlign: "center",
    color: Color.neutralDark
    
  },
  innerText: {
    fontFamily: Constants.fontHeader,
    fontWeight: 'bold'
  }
});
