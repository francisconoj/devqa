/** @format */

import { StyleSheet } from 'react-native';
import { Color } from '@common';
import { Platform, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  containerStyle: {
    backgroundColor: "#0000", // invisible color
    paddingBottom: 12,
    paddingTop: 12,
    // marginHorizontal: Styles.width / 20,
    marginHorizontal: 10,
    marginTop: 12,

    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  imageView: {
    marginTop: 10,
    width: width - 40,
    marginLeft: 15,
    height: 80,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: "white"
  },
  textPrimary: {
    fontFamily: "FuturaBold",
    fontSize: 16,
    color: Color.primary,
    //flex:0.5
  },
  textSecond: {
    paddingTop: 5,
    fontFamily: "Futura",
    fontSize: 13,
    color: Color.neutralLight,
    //flex:0.5
  },
  overlay2: {
    // alignItems: 'left',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    flex: 0.6,
    top: 5,
    bottom: 0,
    width: "50%",
    marginLeft: 16
  },
  btnTrash: {
    position: "relative",
    justifyContent: "flex-end",
    marginTop: 8,
    marginLeft: 50,
    alignItems: "flex-end",
    right: 70,
    bottom: 10,
  },
  icon: {
    width: 15,
    height: 15,
    resizeMode: "contain",
    //margin: 10,
    justifyContent: "flex-end",

  },


  order: {
    flexDirection: 'column',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },
  orderHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  orderId: {
    flex: 1,
    textAlign: 'left',
    fontFamily: 'MulishBold',
    color: Color.primary,
    fontSize: 16,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 12
  },
  orderShippingAddress: {
    flex: 1,
    textAlign: 'left',
    fontFamily: 'Mulish',
    color: Color.text,
    fontSize: 16,
  },
  orderTotal: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    //margin: 10,
    justifyContent: "flex-end",
    //textAlign: 'right',
    //fontFamily: 'Mulish',
    //color: Color.text,
    //fontSize: 16,
  },

  
});
