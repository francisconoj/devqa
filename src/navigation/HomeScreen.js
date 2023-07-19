/** @format */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Color, Styles, withTheme, Languages } from "@common";
import { Home } from "@containers";
import { Menu, NavBarLogo, HeaderHomeRight, EmptyView } from "./IconNav";

@withTheme
export default class HomeScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );
    const dark = navigation.getParam("dark", false);

    return {
      headerTitle: Languages.Home,
      headerLeft: EmptyView(),
      headerRight: EmptyView(),

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

  UNSAFE_componentWillReceiveProps(nextProps) {
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
    const { navigate } = this.props.navigation;

    return (
      <Home
        onShowAll={(config, index) =>
          navigate("ListAllScreen", { config, index })
        }
        showCategoriesScreen={() => navigate("CategoriesScreen")}
        onViewProductScreen={(item) => {
          this.props.navigation.tabBarVisible = false;
          navigate("DetailScreen", item);
        }}
      />
    );
  }
}
