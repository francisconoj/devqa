/** @format */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import { Color, Styles, withTheme, Languages, Images } from "@common";
import { OrderDetail } from "@containers";
import { Logo, Back, EmptyView, RightIcon } from "./IconNav";

@withTheme
export default class OrderDetailScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const dark = navigation.getParam("dark", false);
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );

    return {
      headerTitle: `Orden #${navigation.state.params.id}`,
      tabBarVisible: false,
      headerLeft: Back(navigation, null, dark),
      headerRight: RightIcon(Images.IconDevola, null),
      headerTintColor: Color.headerTintColor,
      headerStyle,
      headerTitleStyle: Styles.Common.headerStyle,
    };
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
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
    const id = navigation.getParam("id", null);

    if (!id) return null;

    return <OrderDetail navigation={navigation} id={id} />;
  }
}
