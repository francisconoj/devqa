/** @format */

import React, { PureComponent } from 'react';
import {
  Animated,
  Platform,
  RefreshControl,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { AnimatedHeader, Spinner, TouchableScale, } from '@components';
import { Languages, withTheme } from '@common';
import styles from './styles';
import CustomAPI from "@services/CustomAPI";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class MyCards extends PureComponent {
  state = {
    scrollY: new Animated.Value(0),
    cards: [],
    isLoading: false
  };

  componentDidMount() {
    this.getCards();
  }

  getCards = () => {
    this.setState({ isLoading: true });
    CustomAPI.GetPaymentMethods({ user_id: this.props.user.user.id }, (response) => {
      this.setState({ cards: response.payments });

      this.setState({ isLoading: false });
      //  this.forceUpdate();
    });
  }

  componentWillReceiveProps(nextProps) {

  }
  deleteCard = (category) => {
    this.setState({ isLoading: true });
    CustomAPI.deleteCard({ token_id: category.token_id }, (response) => {
      // this.setState({ cards: response.payments });

      this.setState({ isLoading: false });
      //  this.forceUpdate();
      this.getCards();
    });
  };


  render() {
    return (
      <View style={styles.container}>

        {this.state.cards.length === 0 && <Text style={[{ textAlign: "center" }]}>No tienes tarjetas guardadas.</Text>}
        {this.state.cards.length > 0 &&
          this.state.cards.map((category, index) => {


            const imageCategory =
              category.card_type.toString().toUpperCase() === "VISA"
                ? "VISA"
                : "MASTER";
            //const imageCategory = Images.IconDevola;

            return (
              <TouchableOpacity
                style={styles.order}
              // onPress={this.onOrderPressed.bind(this)}
              >
                <View style={styles.orderHeaderRow}>
                  <Text style={styles.orderId}> {"**** **** **** " + category.last4}
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.deleteCard(category)}
                  >
                    <Image
                      source={require("@images/ic_trash.png")}
                      style={[styles.icon, { tintColor: "#767676" }]}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.orderHeaderRow}>
                  <Text style={styles.orderShippingAddress}>
                    {"Vence " + category.expiry_month + "/" + category.expiry_year}
                  </Text>

                  {imageCategory === 'VISA' && <Image style={styles.orderTotal} source={require("@images/visa.png")} />}
                  {imageCategory === 'MASTER' && <Image style={styles.orderTotal} source={require("@images/master.png")} />}
                </View>

              </TouchableOpacity>
            );
          })}


        {this.state.isLoading ? <Spinner mode="full" color="black" /> : null}

      </View>
    );
  }
}
const mapStateToProps = ({ user, carts }) => ({ user, carts });
function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require('@redux/CartRedux');
  return {
    ...ownProps,
    ...stateProps,
    fetchMyOrder: (user) => {
      actions.fetchMyOrder(dispatch, user);
    },
  };
}
export default connect(mapStateToProps, null, mergeProps)(withTheme(MyCards));
