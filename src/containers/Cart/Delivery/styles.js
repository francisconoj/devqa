/** @format */

import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Color } from '@common';
const { width, height } = Dimensions.get('window');

const vh = height / 100;
export default StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
  },
  deliveryCart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  form: {
    marginTop: 20,
    marginLeft: 0,
    marginRight: 0,
  },
  formTitle: {
    fontSize: 16,
    padding: 16,
    color: Color.neutralDark,
    fontFamily: 'Mulish',
  },
  formTitleBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E3E3E3',
  },
  notes: {
    height: 400,
    marginBottom: 100,
  },
  input: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
    height: vh * 7,
  },
  firstInput: {
    alignItems: 'center',
    position: 'absolute',
    top: Platform.OS === 'ios' ? -20 : 10,
    right: 20,
    left: 20,
  },
  inputAndroid: {
    width: width - 50,
    height: vh * 7,
    paddingLeft: 10,
    marginTop: 10,
    position: 'relative',
  },
  lastInput: {
    alignItems: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? -20 : 10,
    right: 20,
    left: 20,
  },
  btnNextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  btnNext: {
    backgroundColor: '#0091ea',
    height: 40,
    width: 200,
    borderRadius: 20,
  },
  btnNextText: {
    fontWeight: 'bold',
  },
  picker: {
    width: width - 80,
  },
  formAddress: {
    borderColor: '#d4dce1',
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    height: 200,
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  shippingMethod: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  shippingDesc: {
    marginTop: 0,
    marginBottom: 20,
  },
  formContainer: {
    // padding: 10,
  },
  name:{
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 5,
    alignContent:"center"
  },
  text:{
    fontSize: 13,
    marginBottom: 3,
    justifyContent:"center"
  },
  contentAddreess:{
    marginHorizontal: 10,
    backgroundColor:'#fff',
    marginTop: 10,
    marginBottom: 3,
    borderRadius: 5,
    ...Platform.select({
      ios:{
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: {
            height: 1,
            width: 1
        },
      },
      android:{
        elevation: 2
      }
    }),
    flexDirection:'row',
    padding: 10
  },
  buttons2:{
    justifyContent:'space-between'
  },
  content: {
    width: 220,
    height: 100,
    borderRadius: 12,
    backgroundColor: "white",
    fontFamily:"Mulish"
  },
  content2: {
    flex:1
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, .6)",
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: {
          height: 2,
          width: 0,
        },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  money: {
    color: Color.blue,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    backgroundColor: "transparent",
    fontFamily: 'Mulish',
  },
  type: {
    color: Color.blue,
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 3,
    marginTop: 8,
    backgroundColor: "transparent",
    fontFamily: 'Mulish',
  },
  buttons:{
    justifyContent:'flex-end',
    flex:1,
    flexDirection:"row"
  },
  
  iconEdit:{
    fontWeight: "bold",
    marginRight:25
  },
  iconEdit2:{
    margin: 10,
    fontWeight: "bold",
  },
 
});
