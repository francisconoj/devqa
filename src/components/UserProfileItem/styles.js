/** @format */

import { StyleSheet,I18nManager } from "react-native";
import { Color, Styles } from "@common";


export default StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#F5F5F5",
    paddingHorizontal: 20,
    height: 60,
  },
  leftText: {
    fontSize: 16,
    color: "#9B9B9B",
    flex: 0.5
  },
  rightText: (textColor) => ({
    fontSize: 16,
    color: textColor,
    fontWeight: "300",
    alignSelf: "flex-start",
  }),
  rightContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  formInputContainer: {
    /*flex: 1, flexDirection: 'row', 
    borderWidth: 1, borderColor: '#adb4bc', 
    borderRadius: 20,
    height: 50, width: '90%',*/
    margin: 10,
    padding: 10,
    marginLeft: 68,
    color: Color.neutralDark,
      flex: 1, flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#E3E3E3',
      borderRadius: 4,
      //paddingHorizontal: 2,
      paddingVertical: 12,
      height: 44,
      textAlign: 'left',
      fontFamily: 'Mulish',
      fontSize: 13,
  },

  formLabelError: {
   // ...customInputStyle.errorBlock,
    color: '#ef5350',
    textAlign: 'left',
    fontFamily: 'Mulish',
    fontSize: 12,
    //paddingHorizontal: 16,
    
  },

  formInputError:{
    margin: 10,
    padding: 10,

    color: Color.neutralDark,
      flex: 1, flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 4,
      //paddingHorizontal: 2,
      paddingVertical: 12,
      height: 44,
      textAlign: 'left',
      fontFamily: 'Mulish',
      fontSize: 13,
    borderColor: '#ef5350',
  },
  expandText: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  editform:{
    width:"100%",
    height:"100%",
    
  },
  editformMain:{
    width:"100%",
    height:"100%"
  }
});
