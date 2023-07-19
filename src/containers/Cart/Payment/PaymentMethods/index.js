/** @format */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Color } from '@common';
import { Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import CyberSource from './CyberSource.js';
import styles from './styles';

class PaymentMethods extends PureComponent {
  static propTypes = {
    paymentData: PropTypes.object,
    paymentMethod: PropTypes.object,
    paymentMethods: PropTypes.object.isRequired,
    onPaymentDataChanged: PropTypes.func.isRequired,
    onPaymentMethodChanged: PropTypes.func.isRequired,
  };

  renderPaymentMethodDescription() {
    const { paymentMethod } = this.props;
    if (!paymentMethod.description) {
      return (
        <Text
          style={[
            styles.paymentMethodDescription,
            { color: Color.neutralLight },
          ]}
        >
          {'Selecciona un método de pago.'}
        </Text>
      );
    }
    return (
      <Text style={styles.paymentMethodDescription}>
        {paymentMethod.description}
      </Text>
    );
  }

  renderPaymentMethodSelectBox(paymentMethod, index) {
    const selected = this.props.paymentMethod.id == paymentMethod.id;
    const icon = [
      styles.paymentMethodIcon,
      selected && styles.paymentMethodIconSelected,
    ];
    return (
      <TouchableOpacity
        onPress={() => this.props.onPaymentMethodChanged(paymentMethod)}
        style={styles.paymentMethod}
        key={paymentMethod.id}
      >
        <Text style={icon}>{'\uf058'}</Text>
        <Text style={styles.paymentMethodTitle}>{paymentMethod.title}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const paymentMethods = this.props.paymentMethods.filter(
      (method) => method.enabled
    );
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>{'Método de pago'}</Text>
        <View style={styles.paymentMethods}>
          {paymentMethods.map(this.renderPaymentMethodSelectBox.bind(this))}
        </View>
        {this.renderPaymentMethodDescription()}
        {/*this.props.paymentMethod.id &&
          (() => {
            switch (this.props.paymentMethod.id) {
              case 'cybsawm':
                return (
                  <CyberSource
                    paymentData={this.props.paymentData}
                    paymentMethod={this.props.paymentMethod}
                    onPaymentDataChanged={this.props.onPaymentDataChanged}
                  />
                );
              case 'cod':
              default:
                return null;
            }
          })()*/}
      </View>
    );
  }
}

const mapStateToProps = ({ payments }) => {
  return {};
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
  };
}

export default connect(mapStateToProps, undefined, mergeProps)(PaymentMethods);
