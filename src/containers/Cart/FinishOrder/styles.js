/** @format */

import { StyleSheet } from "react-native";
import { Constants, Color } from "@common";

export default StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "white",
  },
  title: {
    fontFamily:"MulishBold",
    textAlign: "center",
    fontSize: 25,
    marginTop: 40,
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  message: {
    fontFamily: "Mulish",
    textAlign: "center",
    fontSize: 15,
    color: "gray",
    lineHeight: 25,
    margin: 20,
  },
  orderNoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  orderNo: {
    height: 40,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 0.5,
    borderColor: "#cccccc",
    textAlign: "center",
    fontSize: 17,
    borderRadius: 20,
  },
  btnNextContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },

  button: {
    height: 40,
    width: 160,
    borderRadius: 20,
    backgroundColor: Color.primary,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: Constants.fontHeader,
  },
});
