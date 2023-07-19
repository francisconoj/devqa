/** @format */

import { Constants, Styles, Color } from "@common";
import { Platform, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export default {
  fill: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    overflow: "hidden",
    height: Constants.Window.headerHeight,
  },
  backgroundImage: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    width: null,
    height:
      Platform.OS === "ios"
        ? Constants.Window.headerHeight
        : Constants.Window.headerHeight + 100,
  },
  scrollView: {
    paddingTop: 6,
  },
  scrollViewContent: {
    position: "relative",
    marginBottom: 100,
  },

  image: {
    marginRight: 16,
    width: "65%",
    height: "100%",
    overflow: 'hidden',
    resizeMode: 'contain',
  },
  icon: {
    width: 40,
    height: 40,
    overflow: 'hidden',
    resizeMode: 'contain',
  },
  questionInit: {
    width: width - 50,
    overflow: 'hidden',
    resizeMode: 'contain',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: "MulishBold",
    marginBottom: 8
  },
  textHeaderQuestion: {
    fontWeight: 'bold',
    color: Color.primary,
    textAlign: 'center',
    fontFamily: "MulishBold",
    marginBottom: 8,
    marginTop: 15
  },
  textQuestion: {
    color: "#B3B4BC",
    textAlign: 'center',
    fontFamily: "MulishBold"
  },
  inputCommentText: {
    marginTop: 10,
    height: 60,
    width: 280,
    fontSize: 15,
    color: Color.title,
    borderRadius: 5,
    borderColor: "#CED7DD",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    color: 'grey',
    textAlign: 'center'

  },
  dim_layout: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',
    backgroundColor: "rgba(0,0,0,0.3)",
    height: Styles.width / 2 - 60,
    width: width
  },
  mainCategoryText: {
    color: Color.primary,
    fontSize: 22,
    textAlign: 'left',
    fontFamily: "MulishBold",
  },
  numberOfProductsText: {
    color: Color.primary,
    fontSize: 12,
    fontFamily: Constants.fontFamily,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalView: {
    backgroundColor: Color.secondary,
    borderRadius: 20,
    padding: 10,
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
  modalViewMenu: {
    width:width-40,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CED7DD",
    padding: 10,
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
    backgroundColor: Color.primary,
    borderRadius: 20,
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
    fontSize: 20
  },
  textStyleMenu: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20
  },
  closeButtonMenu: {
    flexDirection: 'column',
    paddingTop: 1,
    marginRight: 1,
    borderRadius: 20,
    alignSelf: 'flex-end'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  boxComment: {
    position: "absolute",
    top: 20,
    bottom: 40,
    width: 30,
    height: 40,
    flex: 1,
    backgroundColor: "#FFF",
    zIndex: 999,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
  },

  survey: {

    color: Color.primary,
    fontFamily: Constants.fontFamily,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: "MulishBold",
    paddingBottom: "3%"

  },
  survey2: {
    color: 'white',
    fontFamily: Constants.fontFamily,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: "MulishBold",
    paddingBottom: "3%"

  },
  btnAcept: {
    fontFamily: Constants.fontHeader,
    width: 100,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.secondary,
    alignSelf: 'center',
    marginBottom: 10,
    fontWeight: "bold",
    marginTop: 25
  },
  btnAdd: {
    fontFamily: Constants.fontHeader,
    width: 300,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.secondary,
    alignSelf: 'center',
    marginBottom: 10,
    fontWeight: "bold"
  },
  btnCancel: {
    fontFamily: Constants.fontFamily,
    width: 300,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "white",
    alignSelf: 'center',
  },
  add: {
    fontFamily: Constants.fontHeader,
    textAlign: "center",
    color: '#fff'

  },
  cancel: {
    fontFamily: Constants.fontFamily,
    textAlign: "center",
    color: Color.primary
  },
  imageView2: {
    width: width - 30,
    marginLeft: 15,
    height: 126,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: "white",
    borderColor: Color.primary,
    borderWidth: 1
  },
  input: {
    width: width - 60,
    height: 126,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
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
  overlay2: {
    // alignItems: 'left',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    flex: 1,
    top: 0,
    bottom: 0,
    width: "30%",
    marginLeft: 16
  },

  overlayDark: {
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  containerStyle: {
    // shadowColor: "#000",
    backgroundColor: "transparent",
    // shadowOpacity: 0.4,
    // shadowRadius: 8,
    // shadowOffset: { width: 0, height: 12 },
    // elevation: 10,
    paddingBottom: 10,
    position: "relative",
  },
  containerStyle2: {
    backgroundColor: "transparent",
    paddingBottom: 10,
    position: "relative",
    height: 400,
    marginBottom: 20
  },
  fab: {
    position: "absolute",
    overflow: "hidden",
    bottom: 15,
    right: 12,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, .85)",

    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  imageView: {
    width: width - 30,
    marginLeft: 15,
    height: 126,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: "white"
  },
  questionConteiner: {

    width: width - 60,
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12

  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: "45%"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: "#CED7DD",
  },
  label2: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: 'MulishBold',
    fontSize: 14,
    color: Color.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop:"5%"
  },
  centenedViewVersion: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalViewVersion: {
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
  modalViewVersion2: {
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
  surveyVersion: {

    color: Color.neutralDark,
    fontFamily: Constants.fontFamily,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: "MulishBold",
    marginBottom: "10%",
    marginHorizontal: "5%"

  },
  btnAcceptVersion: {
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
  versionAccept: {
    fontFamily: Constants.fontHeader,
    textAlign: "center",
    color: Color.neutralDark

  },
  imageThumbnail: {
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    resizeMode: 'stretch',

  },
  text_list: {
    marginTop: 10,
    marginBottom: 8,
    color: Color.primary,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "MulishBold",
  },
  text_list2: {
    marginTop: 10,
    marginBottom: 8,
    color: Color.Text,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "MulishBold",
  },
  category_conteiner: {
    backgroundColor: "white", // invisible color
    paddingBottom: 12,
    paddingTop: 12,
    // marginHorizontal: Styles.width / 20,
    marginHorizontal: 5,
    marginTop: 12,

    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d4dce1",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  item: {
    backgroundColor: '#4D243D',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / 3, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
};
