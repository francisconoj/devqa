import { StyleSheet } from "react-native";
import { Color, Styles, Constants } from "@common";

const styles = StyleSheet.create({
  //main
  listView: {
    alignItems: "flex-start",
    paddingBottom: Styles.navBarHeight + 10,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Color.background,
  },
  flipText: {
    width: 90,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  flipCard: {

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    backfaceVisibility: 'hidden',
  },
  flipCardBack: {
    position: "absolute",
    top: 0,
  },
  //ProductRows
  container_product: {
    backgroundColor: "#0000", // invisible color
    paddingBottom: 12,
    paddingTop: 12,
    // marginHorizontal: Styles.width / 20,
    marginHorizontal: 16,
    marginTop: 12,

    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  container_list: {
    width: Styles.width * 0.9,
    marginLeft: Styles.width * 0.05,
    marginRight: Styles.width * 0.05,
    marginTop: Styles.width * 0.05,
  },
  container_grid: {
    width: (Styles.width * 0.9) / 2,
    marginLeft: (Styles.width * 0.1) / 3,
    marginRight: 0,
    marginTop: (Styles.width * 0.1) / 3,
  },
  image: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: "auto",
    marginRight: "auto"
  },
  image_list: {
    width: Styles.width * 0.9 - 2,
    height: Styles.width * 0.9 * Styles.thumbnailRatio,
  },
  image_grid: {
    width: Styles.width * 0.24 - 2,
    height: Styles.width * 0.24 * Styles.thumbnailRatio,
  },
  text_list: {
    color: Color.black,
    fontSize: Styles.FontSize.medium,
    fontFamily: "MulishBold",
  },
  text_grid: {
    color: Color.primary,
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 16,
    fontFamily: "MulishBold",
  },
  textRating: {
    fontSize: Styles.FontSize.small,
  },
  price_wrapper: {
    ...Styles.Common.Row,
    top: 0,
  },
  cardWraper: {
    flexDirection: "column",
  },
  sale_price: {
    textDecorationLine: "line-through",
    color: "#C8C8C8",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 1,
    fontSize: 14,
    fontFamily: "MulishRegular"
  },
  cardPriceSale: {
    fontSize: 15,
    marginTop: 2,
    fontFamily: Constants.fontFamily,
  },
  price: {
    color: Color.black,
    fontSize: 16,
    color: "#767676",
    fontFamily: "MulishRegular"
  },
  saleWrap: {
    zIndex: 1000,
    position: 'absolute',
    right: 2,
    bottom: 20,
    borderRadius: 5,
    backgroundColor: Color.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    // marginLeft: 5,
  },
  sale_off: {
    color: Color.lightTextPrimary,
    fontSize: Styles.FontSize.small,
  },
  cardText: {
    fontSize: 20,
    textAlign: "center",
  },
  cardPrice: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: Constants.fontFamily,
  },
  btnWishList: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  quantity2: {
    justifyContent: "center",
    alignItems: "center",
  },
  container2: {
    width: 42,
    backgroundColor: "#f7f8fa",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d4dce1",
    borderRadius: 15,
  },
  btnAdd: {
    width: 150,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: Color.primary,
    alignSelf: 'center'
  },
  add: {
    textAlign: "center",
    color: '#fff'
  },
  textBackFlip: {
    marginRight:"5%",
    marginLeft:"5%",
    color: Color.primary,
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 12,
    fontFamily: "MulishBold",
  },
  icon: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginLeft: 125,
    width: 25,
    height: 25,
    borderRadius: 40,
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
});

export default styles;