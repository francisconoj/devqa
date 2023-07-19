/** @format */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { connect } from 'react-redux';

class CyberSource extends PureComponent {
  static propTypes = {
    paymentData: PropTypes.object.isRequired,
    onPaymentDataChanged: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      cardNumberError: false,
      expireDateError: false,
      cvvNumberError: false,
      cardHolderNameError: false,
    };
  }

  checkCardNumber(ccnumber) {
    return ccnumber && ccnumber.length === 19;
  }

  onCardNumberChanged(cardNumber) {
    this.setState({
      cardNumberError: !this.checkCardNumber(cardNumber),
    });
    this.props.onPaymentDataChanged({
      ...this.props.paymentData,
      cardNumber,
    });
  }

  onCardHolderChanged(cardHolder) {
    this.setState({
      cardHolderError: !cardHolder,
    });
    this.props.onPaymentDataChanged({
      ...this.props.paymentData,
      cardHolder,
    });
  }

  onCVVNumberChanged(cvvNumber) {
    this.setState({
      cvvNumberError: !cvvNumber,
    });
    this.props.onPaymentDataChanged({
      ...this.props.paymentData,
      cvvNumber,
    });
  }

  onExpireDateChanged(expireDate) {
    this.setState({
      expireDateError: !expireDate,
    });
    this.props.onPaymentDataChanged({
      ...this.props.paymentData,
      expireDate,
    });
  }

  render() {
    const paymentData = this.props.paymentData || {};
    const { cardNumber, expireDate, cvvNumber, cardHolderName } = paymentData;
    const {
      cardNumberError,
      expireDateError,
      cvvNumberError,
      cardHolderNameError,
    } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{'Número de tarjeta'}</Text>
        <TextInputMask
          type="credit-card"
          options={{ obfuscated: false, issuer: 'visa-or-mastercard' }}
          clearButtonMode="while-editing"
          keyboardType="number-pad"
          style={styles.input(cardNumberError)}
          onChangeText={this.onCardNumberChanged.bind(this)}
          placeholder={'#### #### #### ####'}
          value={cardNumber}
          placeholderTextColor={'#C8C8C8'}
        />
        <View style={styles.meta}>
          <View style={styles.expiration}>
            <Text style={styles.label}>{'Fecha de expiración'}</Text>
            <TextInputMask
              type={'custom'}
              options={{ mask: '99/99' }}
              clearButtonMode="while-editing"
              keyboardType="number-pad"
              style={styles.input(expireDateError)}
              onChangeText={this.onExpireDateChanged.bind(this)}
              placeholder={'MM/AA'}
              value={expireDate}
              placeholderTextColor={'#C8C8C8'}
            />
          </View>
          <View style={styles.cvc}>
            <Text style={styles.label}>{'CVV'}</Text>
            <TextInputMask
              type={'custom'}
              options={{ mask: '999' }}
              clearButtonMode="while-editing"
              keyboardType="number-pad"
              style={styles.input(cvvNumberError)}
              onChangeText={this.onCVVNumberChanged.bind(this)}
              placeholder={'###'}
              value={cvvNumber}
              placeholderTextColor={'#C8C8C8'}
            />
          </View>
        </View>
        <Text style={styles.label}>{'Nombre del tarjetabiente'}</Text>
        <TextInput
          clearButtonMode="while-editing"
          keyboardType="default"
          style={styles.input(cardHolderNameError)}
          onChange={this.onCardHolderChanged.bind(this)}
          value={cardHolderName}
          placeholder={'Nombre en la tarjeta'}
          placeholderTextColor={'#C8C8C8'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  label: {
    fontFamily: 'Mulish',
    fontSize: 14,
    color: '#767676',
    paddingLeft: 12,
  },
  input: (error) => ({
    marginTop: 3,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    borderWidth: 1,
    fontFamily: 'Mulish',
    fontSize: 16,
    borderColor: error ? '#ef5350' : '#E3E3E3',
    borderRadius: 4,
  }),
  meta: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  expiration: {
    flex: 4,
    marginRight: 16,
  },
  cvc: {
    flex: 2,
  },
});

const mapStateToProps = ({ currency }) => {
  return {};
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
  };
}

export default connect(mapStateToProps, undefined, mergeProps)(CyberSource);
