/** @format */

import { StyleSheet } from "react-native";
import { Color, Config, Constants } from "@common";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: (dark) => ({
    borderTopWidth: 10,
    borderColor: dark ? "#101425" : "#F5F5F5",
  }),

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
    flexDirection: "column",
    width: 100,
    paddingLeft: 18
  },
  input: (text) => ({
    /*flex: 1, flexDirection: 'row', 
     borderWidth: 1, borderColor: '#adb4bc', 
     borderRadius: 20,
     height: 50, width: '90%',*/

    color: Color.neutralDark,
    flex: 0.5,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 4,
    //paddingHorizontal: 2,
    marginRight: 30,
    paddingVertical: 12,
    height: 44,
    textAlign: 'left',
    fontFamily: 'Mulish',
    fontSize: 13,
    width:120
  }),
  headerSection: {
    //paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 13,
    color: "#4A4A4A",
    fontWeight: "600",
  },
  rightContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  rightText: (textColor) => ({
    fontSize: 16,
    color: textColor,
    fontWeight: "300",
    alignSelf: "flex-start",
  }),

  btnSave: {
    width: 150,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: Color.secondary,
    alignSelf: 'center',
    marginVertical: 20
  },
  btnCancel: {
    width: 150,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: Color.primary,
    alignSelf: 'center',
    marginVertical: 20
  },

  formInputContainer: {
    flex: 1, flexDirection: 'row',
    borderWidth: 1, borderColor: '#adb4bc',
    borderRadius: 20,
    height: 50, width: '100%'

  },
  add: {
    textAlign: "center",
    color: '#fff'
  },
  cancel: {
    textAlign: "center",
    color: '#fff'
  }
});
