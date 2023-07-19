/** @format */

import React, { PureComponent } from "react";
import { FlatList, Text, View } from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import { NotificationItem, Spinner } from "@components";
import { withTheme } from "@common";
import CustomAPI from "@services/CustomAPI";
import styles from './styles';

class Notifications extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      isloading: false,
    };

  }

  componentDidMount() {
    this.getNotifications();
  }


  render() {

    /*return (
      <Text>hola notifications</Text>
    );*/

    const {
      theme: {
        colors: { background, text },
      },
    } = this.props;
    return (
      <View style={styles.container}>
        {this.state.notifications.length === 0 && <Text style={[{ textAlign: "center" }]}>No tienes Notificaciones.</Text>}
        {this.state.notifications.length > 0 && this.renderList(this.state.notifications)}
        {this.state.isLoading ? <Spinner mode="full" color="black" /> : null}
      </View>
    );
  }

  renderList = (data) => {
    const {
      theme: {
        colors: { background, text },
      },
    } = this.props;
    return (
      <FlatList
        overScrollMode="never"
        style={{ backgroundColor: background }}
        extraData={this.props}
        keyExtractor={(item, index) => `${index}`}
        data={data}
        renderItem={({ item, index }) => (
          <NotificationItem
            onViewProductScreen={(product) => {
              this.onViewProductScreen(product);
            }}
            onViewCategoryScreen={(product) => {
              this.onViewCategoryScreen(product);
            }}
            // onPress={() => this.selectAddress(item)}         
            item={item}
          />
        )}
      />
    );
  }
  onViewProductScreen = (product) => {
    const { navigate } = this.props.navigation;
    navigate("DetailScreen", product);
  }

  onViewCategoryScreen = (category) => {
    const { navigate } = this.props.navigation;
    navigate("CategoryScreen", category);
  }
  getNotifications = () => {
    this.setState({ isLoading: true });
    CustomAPI.GetAllNotifications((notif) => {
      let noticias = notif.notifications.filter(function (notif) {        
        return notif.date !== null && new Date (notif.date) > new Date()
      });
      this.setState({ notifications: noticias });
      this.setState({ isLoading: false });
    });

  }

}



const mapStateToProps = (state) => {
  return {
    list: state.addresses.list,
    reload: state.addresses.reload,
    selectedAddress: state.addresses.selectedAddress,
    user: state.user
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {

  return {
    ...ownProps,
    ...stateProps,

  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(withTheme(Notifications));
