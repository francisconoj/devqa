/** @format */

import React, { PureComponent } from "react";

import { Color, Styles, withTheme, Languages, Images } from "@common";
import { AddAddress } from "@containers";
import { Back, EmptyView, RightIcon } from "./IconNav";

@withTheme
export default class EditAddressScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );
    const dark = navigation.getParam("dark", false);

    return {
      headerTitle: Languages.UpdateAddress,
      headerLeft: Back(navigation, null, dark),
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

    return <AddAddress onBack={() => navigation.goBack()} edit={true}/>;
  }
}
