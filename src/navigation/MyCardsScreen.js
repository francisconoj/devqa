/** @format */

import React, { Component } from "react";
import PropTypes from "prop-types";


import { Color, Styles, Languages, Images } from "@common";
import { MyCards } from "@containers";
import { Back, RightIcon } from "./IconNav";
export default class MyCardsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const dark = navigation.getParam("dark", false);
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );

    return {
      headerTitle: Languages.MyCardsTitle,
      tabBarVisible: false,
      headerLeft: Back(navigation, null, dark),
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
      <MyCards
        navigate={this.props.navigation}
      />
    );
  }
}
