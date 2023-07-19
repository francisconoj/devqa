import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { WooWorker } from 'api-ecommerce';
import { has, get, trim } from 'lodash';
import { Icons, Languages, Styles, Color, withTheme, Images } from '@common';
import { Icon, toast, warn, FacebookAPI } from '@app/Omni';
import { Spinner, ButtonIndex } from '@components';
import CustomAPI from '@services/CustomAPI';
import styles from './styles';

class ForgotPasswordScreen extends PureComponent {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      userEmailAddress: '',
      isBusy: false,
    };
  }

  onBackPressed() {
    this.props.onBack();
  }

  onRecoverPasswordPressed() {
    this.setState({isBusy: true});
    const params = {user_email_address: this.state.userEmailAddress};
    CustomAPI.recoverPassword(params, response => {
      toast(`Te hemos enviado un correo para recuperar tu contraseña.`);
      this.setState({isBusy: false});
    });
  }

  onUserEmailAddressChanged(userEmailAddress) {
    this.setState({ userEmailAddress });
  }

  render() {
    const { userEmailAddress, isBusy } = this.state;
    const { theme } = this.props;
    const disabled = userEmailAddress == '';
    return (
      <KeyboardAwareScrollView
        enableOnAndroid={false}
        style={{ backgroundColor: Color.primary }}
        contentContainerStyle={styles.container}
      >
        <View style={styles.logoWrap}>
          <Image
            source={Images.LogoGreen}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.subContain}>
          <View style={styles.loginForm}>
            <View style={styles.inputWrap}>
              <Icon
                name={Icons.MaterialCommunityIcons.Email}
                size={Styles.IconSize.TextInput}
                color={theme.colors.text}
              />
              <TextInput
                style={styles.input(theme.colors.text)}
                underlineColorAndroid="transparent"
                placeholderTextColor={theme.colors.placeholder}
                placeholder="Tu dirección de correo"
                keyboardType="email-address"
                onChangeText={this.onUserEmailAddressChanged.bind(this)}
                returnKeyType="next"
                value={userEmailAddress}
              />
            </View>
            <ButtonIndex
              text="Recuperar contraseña"
              containerStyle={[
                styles.loginButton,
                disabled && { backgroundColor: '#E3E3E3' },
              ]}
              textStyle={[disabled && { color: '#767676' }]}
              onPress={this.onRecoverPasswordPressed.bind(this)}
            />
          </View>
          <TouchableOpacity
            style={[Styles.Common.ColumnCenter, { marginTop: 16 }]}
            onPress={this.onBackPressed.bind(this)}
          >
            <Text style={styles.highlight}>Regresar</Text>
          </TouchableOpacity>
        </View>

        {isBusy ? <Spinner mode="overlay" /> : null}
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({ netInfo, user }) => ({ netInfo, user });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux/UserRedux');
  return {
    login: (user, token) => dispatch(actions.login(user, token)),
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(ForgotPasswordScreen));
