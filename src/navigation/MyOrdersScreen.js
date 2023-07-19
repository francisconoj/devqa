/** @format */

import React, { Component } from "react";
import PropTypes from "prop-types";


import { Color, Styles, Languages, Images } from "@common";
import { MyOrders } from "@containers";
import { EmptyView, RightIcon } from "./IconNav";

export default class MyOrdersScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const dark = navigation.getParam("dark", false);
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );

    return {
      headerTitle: Languages.MyOrdersTitle,
      tabBarVisible: false,
      headerLeft: EmptyView(),
      headerRight: RightIcon(Images.IconDevola, null),

      headerTintColor: Color.headerTintColor,
      headerStyle,
      headerTitleStyle: Styles.Common.headerStyle,
    };
  };

  static propTypes = {
    navigation: PropTypes.object,
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <MyOrders
        navigate={this.props.navigation}
        onViewHomeScreen={() => navigate("CategoriesScreen")}
        onViewOrderDetail={(id) => navigate("OrderDetailScreen", { id })}
      />
    );
  }
}
