/** @format */

import React, { PureComponent } from "react";

import { Color, Styles, withTheme, Languages, Images } from "@common";

import { Categories } from "@containers";
import { Logo, Menu, EmptyView, RightIconWhite } from "./IconNav";

@withTheme
export default class CategoriesScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const dark = navigation.getParam("dark", false);
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );

    return {
      headerTitle: Languages.ProductCategories,
      headerLeft: EmptyView(),
      headerRight: RightIconWhite(Images.IconBell, () => navigation.navigate("NotificationScreen")),//////////aca :S 

      //headerTintColor: Color.headerTintColor,
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
      dark
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
        dark
      });
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Categories
        onViewProductScreen={(item) => navigate("DetailScreen", item)}
        onViewCategory={(item) => {
          navigate("CategoryScreen", item);
        }}
        onViewNotificationScreen={() => navigate("NotificationScreen")}
        navigation={this.props.navigation}
      />
    );
  }
}
