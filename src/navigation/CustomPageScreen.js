/** @format */

import React, { PureComponent } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { Color, Styles, withTheme, Languages } from "@common";
import { CustomPage } from "@containers";
import { Menu, NavBarLogo, Back, EmptyView } from "./IconNav";

@withTheme
export default class CustomPageScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );
    const dark = navigation.getParam("dark", false);
    const isBack = navigation.getParam("isBack", false);
    const title = navigation.getParam("label", "");
    return {
      headerTitle: title,
      // tabBarVisible: false,
      headerLeft: Back(navigation, null, dark),
      headerRight: EmptyView(),

      headerTintColor: Color.headerTintColor,
      headerStyle,
      headerTitleStyle: Styles.Common.headerStyle,
    };
  };

  UNSAFE_componentWillMount() {
    const {
      theme: {
        colors: { background },
        dark,
      },
    } = this.props;

    this.props.navigation.setParams({
      headerStyle: Styles.Common.toolbar(background, dark),
      dark,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.theme.dark !== nextProps.theme.dark) {
      const {
        theme: {
          colors: { background },
          dark,
        },
      } = nextProps;
      this.props.navigation.setParams({
        headerStyle: Styles.Common.toolbar(background, dark),
        dark,
      });
    }
  }

  render() {
    const { state } = this.props.navigation;
    if (typeof state.params === "undefined") {
      return <View />;
    }

    if (typeof state.params.url !== "undefined") {
      return (
        <View style={{ flex: 1 }}>
          <WebView startInLoadingState source={{ uri: state.params.url }} />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <CustomPage id={state.params.id} />
      </View>
    );
  }
}
