import React, { PureComponent } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import { connect } from 'react-redux';
import { Languages, Color, Tools, Config, withTheme, Icons, Styles } from "@common";
import { color } from "react-native-reanimated";
import { Platform, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
//import style from "components/Search/SearchBar/style";

class TotalCart extends PureComponent {
   constructor(props) {
     super(props)

     this.state = {
      cartTotal: null
    };
   }


  render() {
    const {cartTotal,cartQuantity, navigation } = this.props;
    let currency=null;
    return (
      cartTotal && cartTotal > 0 ? (
      <TouchableOpacity style ={styles.container}   onPress={() => navigation.navigate("CartScreen")}>
       
          <View style={styles.row}>
          <Icon
                  name={Icons.MaterialCommunityIcons.ShoppingCart}
                  size={Styles.IconSize.Inline}
                  color={Color.primary}
                />
          <Text style ={styles.text}> { Languages.seeOrden}: { Tools.getCurrecyFormatted(cartTotal,currency)}</Text>
         </View>
       
            
      </TouchableOpacity>
      ) : (
        <View />
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
    width:"80%",
    height: 40,
    marginLeft: "auto",//
    marginRight:"auto",
    top: -50,
    position: 'absolute',
    justifyContent: 'center',
    left: "10%",
    borderColor: Color.secondary,
    borderWidth: 3
  },
  row: {
    flex: 1,
    flexDirection: "row",
    //justifyContent: "space-between",
    alignItems: "center",
    //borderBottomWidth: 1,
    borderColor: "#F5F5F5",
    //paddingHorizontal: 60,
    height: 60,
    marginLeft: "auto",//
    marginRight:"auto",
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
  
  text: {
    fontWeight: "bold",
    color: Color.primary,
    fontSize:15
  },
  icon: {
    marginRight: 10,
  },
  image:{
    height: 25,
    width: 25,
    //marginRight: 10
    
  },
  imageContainer:{ 
    justifyContent: "flex-start",
    //alignItems: "start",
    marginRight: 10,
    //left: 10,
    marginLeft: 10,
   
  },
  textContainer:{ 
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",

   
  },
  textWithoutImageContainer:{
   /* marginLeft: "auto",
    marginRight: "auto",
    width: "100%"*/
  }
});
/*
TotalCart.defaultProps = {
  totalCart: "0.00"
  
};*/


function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const CartRedux = require('@redux/CartRedux');
  

  return {
    ...ownProps,
    ...stateProps,
    getCartTotal: () => {
      CartRedux.getCartTotal(dispatch);
    },
  };
} 


  const mapStateToProps = ({ carts, user, countries, addresses, currency, products }) => {
    return {
      cartTotal: carts.totalPrice,
      cartQuantity: carts.total
      
    };
  };
  export default connect(
    mapStateToProps,
    undefined,
    mergeProps
  )(withTheme(TotalCart));
//export default TotalCart;

