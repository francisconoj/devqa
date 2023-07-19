/** @format */

import React, { PureComponent } from "react";

import { Images, Color, Styles, withTheme, Languages } from "@common";
import { Address } from "@containers";
import { Back, RightIconWhite } from "./IconNav";

@withTheme
export default class AddressScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );
    const dark = navigation.getParam("dark", false);

    return {
      headerTitle: Languages.Address,
      headerLeft: Back(navigation, null, dark),
      headerRight: RightIconWhite(Images.IconAdd, () => navigation.navigate("AddAddress")),
      
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
    return <Address navigation={navigation} onEditAddress={(item) => {
      navigation.navigate("EditAddress", item);
    }}
    />;
  }
}
