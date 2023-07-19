/** @format */

import React, { PureComponent } from 'react';
import {
  Animated,
  Platform,
  RefreshControl,
  FlatList,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { AnimatedHeader } from '@components';
import { Languages, withTheme } from '@common';
import styles from './styles';
import OrderEmpty from './Empty';
import OrderItem from './OrderItem';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class MyOrders extends PureComponent {
  state = { scrollY: new Animated.Value(0) };

  componentDidMount() {
    this.fetchProductsData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.carts.cartItems != nextProps.carts.cartItems) {
      this.fetchProductsData();
    }
  }

  fetchProductsData = () => {
    const { user } = this.props.user;
    if (typeof user !== 'undefined' && user !== null) {
      this.props.fetchMyOrder(user);
    }
  };

  renderError(error) {
    return (
      <OrderEmpty
        text={error}
        onReload={this.fetchProductsData}
        onViewHome={this.props.onViewHomeScreen}
      />
    );
  }

  renderRow({ item, index }) {
    return (
      <OrderItem
        key={index.toString()}
        order={item}
        theme={this.props.theme}
        onViewOrderDetail={this.props.onViewOrderDetail}
      />
    );
  }

  render() {
    let data = this.props.carts.myOrders;

  

    if (typeof data === 'undefined' || data.length == 0) {
      return (
        <OrderEmpty
          text={Languages.NoOrder}
          onReload={this.fetchProductsData}
          onViewHome={this.props.onViewHomeScreen}
        />
      );
    }
    if(typeof data !== 'undefined' &&  data !== null && data.length > 0) {
      data = data.filter(item => item.status.toUpperCase() !== 'FAILED');
      }

    return (
      <View style={styles.container}>
        <AnimatedFlatList
          data={data}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: Platform.OS !== 'android' }
          )}
          scrollEventThrottle={1}
          keyExtractor={(item, index) => `${item.id} || ${index}`}
          contentContainerStyle={styles.flatlist}
          ListEmptyComponent={() => null}
          renderItem={this.renderRow.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={this.props.carts.isFetching}
              onRefresh={this.fetchProductsData}
            />
          }
        />
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
export default connect(mapStateToProps, null, mergeProps)(withTheme(MyOrders));
