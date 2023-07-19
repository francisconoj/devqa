/** @format */

import React, { PureComponent } from "react";

import { Cart } from "@containers";

export default class CartScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Cart
        onMustLogin={() => {
          navigate("LoginScreen", { onCart: true });
        }}
        onBack={() => navigate("CategoriesScreen")}
        onFinishOrder={() => navigate("MyOrders")}
        onViewHome={() => navigate("CategoriesScreen")}
        onViewProduct={(product) => navigate("Detail", product)}
        navigation={this.props.navigation}
      />
    );
  }
}
