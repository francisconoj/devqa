/** @format */

import React, { PureComponent } from "react";

import { Color, Styles, withTheme, Languages, Images } from "@common";
import { UserProfile } from "@containers";
import { Logo, Menu, EmptyView, RightIcon } from "./IconNav";

@withTheme
export default class UserProfileScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const dark = navigation.getParam("dark", false);
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );

    return {
      headerTitle: Languages.UserProfile,
      headerLeft: EmptyView(),
      headerRight: RightIcon(Images.IconDevola, null),

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
    const { navigation } = this.props;

    return <UserProfile navigation={navigation} />;
  }
}
