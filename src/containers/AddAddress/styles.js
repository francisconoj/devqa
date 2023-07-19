/** @format */

import { StyleSheet, Platform, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { Color, Config, Constants } from "@common";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  formContainer:{
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10
  },
  btnAdd:{
    width: 150,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: Color.secondary,
    alignSelf: 'center',
    marginVertical: 20
  },
  add:{
    textAlign:"center",
    color: '#fff'
  }
});
