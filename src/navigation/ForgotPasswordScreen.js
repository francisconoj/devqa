/** @format */

import React, { PureComponent } from "react";

import { ForgotPassword } from "@containers";
import { Color, Styles, withTheme } from "@common";
import { Back, EmptyView, Logo } from "./IconNav";

@withTheme
export default class ForgotPasswordScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const dark = navigation.getParam("dark", false);
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );

    return {
      headerLeft: EmptyView(),
      headerRight: EmptyView(),
      headerTitle: EmptyView(),
      headerTintColor: Color.headerTintColor,
      headerStyle,
      headerTitleStyle: Styles.Common.headerStyle,
    };
  };

  render() {
    const { navigate, state, goBack } = this.props.navigation;
    const isLogout = state.params ? state.params.isLogout : false;

    return (
      <ForgotPassword
        statusBar
        navigation={this.props.navigation}
        onBack={goBack}
      />
    );
  }
}
