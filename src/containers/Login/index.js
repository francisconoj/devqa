/**
 * Created by InspireUI on 19/02/2017.
 *
 * @format
 */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, Image, TextInput, TouchableOpacity, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { WooWorker } from "api-ecommerce";
import Reactotron from "reactotron-react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Google from "expo-google-app-auth";
import { has, get, trim } from "lodash";
import * as SecureStore from 'expo-secure-store';

import { Icons, Languages, Styles, Color, withTheme, Images, Tools } from "@common";
import { Icon, toast, warn, FacebookAPI } from "@app/Omni";

import { Spinner, ButtonIndex } from "@components";
import WPUserAPI from "@services/WPUserAPI";
import styles from "./styles";
import * as Analytics from 'expo-firebase-analytics';
async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

class LoginScreen extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    isLogout: PropTypes.bool,
    onViewCartScreen: PropTypes.func,
    onViewHomeScreen: PropTypes.func,
    onViewForgotPasswordScreen: PropTypes.func,
    onViewSignUp: PropTypes.func,
    logout: PropTypes.func,
    navigation: PropTypes.object,
    onBack: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isLoading: false,
      logInFB: false,
      phoneNumber: "",
      modalVisible: false,
      showConfirmCode: false,
      verifyCode: "",
      confirmResult: null,
      loadingVerify: false,
      logInGoogle: false,
    };

    this.onUsernameEditHandle = (username) => this.setState({ username });
    this.onPasswordEditHandle = (password) => this.setState({ password });

    this.focusPassword = () => this.password && this.password.focus();
  }

  componentDidMount() {
    const { user, isLogout } = this.props;

    // check case after logout
    if (user && isLogout) {
      this._handleLogout();
    }

  }


  initAsync = async () => {
    this._syncUserWithStateAsync();
  };

  _syncUserWithStateAsync = async () => {
    const username = await GoogleSignIn.signInSilentlyAsync();
    this.setState({ username });
  };


  // handle the logout screen and navigate to cart page if the new user login object exist
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { onViewCartScreen, user: oldUser, onViewHomeScreen } = this.props;

    const { user } = nextProps.user;
    const { params } = nextProps.navigation.state;

    // check case after logout
    if (user) {
      if (nextProps.isLogout) {
        this._handleLogout();
      } else if (!oldUser.user) {
        // check case after login
        this.setState({ isLoading: false });

        if (params && typeof params.onCart !== "undefined") {
          onViewCartScreen();
        } else {
          onViewHomeScreen();
        }

        const displayName =
          has(user, "last_name") && has(user, "first_name")
            ? `${get(user, "last_name")} ${get(user, "first_name")}`
            : get(user, "name");

        toast(`${Languages.welcomeBack} ${displayName}.`);

        this.props.initAddresses(user);
      }
    }
  }

  _handleLogout = () => {
    const { logout, onViewHomeScreen } = this.props;
    logout();
    if (this.state.logInFB) {
      if (FacebookAPI.getAccessToken()) {
        FacebookAPI.logout();
      }
    }
    if (this.state.logInGoogle) {

    }
    onViewHomeScreen();
  };

  _onBack = () => {
    const { onBack, goBack } = this.props;
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  onLoginPressHandle = async () => {
    const { login, netInfo } = this.props;
    const { username, password } = this.state;
    save("typeLogin", "normal");
    if (username == "" || password == "") {
      return;
    }

    if (!netInfo.isConnected) {
      return toast(Languages.noConnection);
    }

    this.setState({ isLoading: true });

    // login the customer via Wordpress API and get the access token
    const json = await WPUserAPI.login(trim(username), password);
    save("userName", trim(username));
    save("token", password);
    if (!json) {
      this.stopAndToast(Languages.GetDataError);
    } else if (json.error || json.message) {
      this.stopAndToast(json.error || json.message);
    } else {
      if (has(json, "user.id")) {
        let customers = await WooWorker.getCustomerById(get(json, "user.id"));

        customers = { ...customers, username, password };

        this.setState({ isLoading: false });

        this._onBack();
        try {
          Analytics.logEvent('LoginApp', {
            customer: JSON.stringify(customers)
          });
        }
        catch (err) {
          console.log(err);
        }
        login(customers, json.cookie);

        return;
      }

      this.stopAndToast(Languages.CanNotLogin);
    }
  };
  onGoogleLoginPressHandle = async () => {

    try {
      // await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        this._syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }

  }

  onFBLoginPressHandle = () => {
    const { login } = this.props;
    this.setState({ isLoading: true });
    save("typeLogin", "fb");
    FacebookAPI.login()
      .then(async (token) => {
        if (token) {
          const json = await WPUserAPI.loginFacebook(token);
          save("token", token);
          warn(["json", json]);
          if (json === undefined) {
            this.stopAndToast(Languages.GetDataError);
          } else if (json.error || json.message) {
            this.stopAndToast(json.error || json.message);
          } else {
            let customers = await WooWorker.getCustomerById(json.wp_user_id);
            customers = { ...customers, token, picture: json.user.picture };
            this._onBack();
            try {
              Analytics.logEvent('LoginFacebook', {
                customer: JSON.stringify(customers),
                Facebook: JSON.stringify(json)
              });
            }
            catch (err) {
              console.log(err);
            }
            login(customers, json.cookie);
          }
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch((err) => {
        warn(err);
        Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(err), method: "onFBLoginPressHandle" });
        this.setState({ isLoading: false });
      });
  };

  onSignUpHandle = () => {
    this.props.onViewSignUp();
  };

  onForgotPasswordHandle = () => {
    this.props.onViewForgotPasswordScreen();
  };

  checkConnection = () => {
    const { netInfo } = this.props;
    if (!netInfo.isConnected) toast(Languages.noConnection);
    return netInfo.isConnected;
  };

  stopAndToast = (msg) => {
    toast(msg);
    this.setState({ isLoading: false });
  };

  setModalVisible(key, visible) {
    this.setState({ [key]: visible });
  }

  render() {
    const { username, password, isLoading } = this.state;
    const {
      theme: {
        colors: { background, text, placeholder },
      },
    } = this.props;
    const disabled = username == "" || password == "";

    const showIOSButton = Platform.OS === 'ios' ? true : false;

    return (
      <KeyboardAwareScrollView
        enableOnAndroid={false}
        style={{ backgroundColor: Color.primary }}
        contentContainerStyle={styles.container}>
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
                color={text}
              />
              <TextInput
                style={styles.input(text)}
                underlineColorAndroid="transparent"
                placeholderTextColor={placeholder}
                ref={(comp) => (this.username = comp)}
                placeholder={Languages.UserOrEmail}
                keyboardType="email-address"
                onChangeText={this.onUsernameEditHandle}
                onSubmitEditing={this.focusPassword}
                returnKeyType="next"
                value={username}
              />
            </View>
            <View style={styles.inputWrap}>
              <Icon
                name={Icons.MaterialCommunityIcons.Lock}
                size={Styles.IconSize.TextInput}
                color={text}
              />
              <TextInput
                style={styles.input(text)}
                underlineColorAndroid="transparent"
                placeholderTextColor={placeholder}
                ref={(comp) => (this.password = comp)}
                placeholder={Languages.password}
                onChangeText={this.onPasswordEditHandle}
                secureTextEntry
                returnKeyType="go"
                value={password}
              />
            </View>
            <ButtonIndex
              text={Languages.Login}
              containerStyle={[
                styles.loginButton,
                disabled && { backgroundColor: "#E3E3E3" }
              ]}
              textStyle={[
                disabled && { color: "#767676" }
              ]}
              onPress={this.onLoginPressHandle}
            />
          </View>
          <View style={styles.separatorWrap}>
            {/* <Text style={styles.separatorText(Color.primary)}>{Languages.Or}</Text> */}
          </View>

          <ButtonIndex
            text={Languages.GoogleLogin}
            imageIcon={Images.Google}
            containerStyle={styles.socialButtons}
            textStyle={styles.socialtext}
            onPress={async () => {
              try {
                Reactotron.log("credential");
                const isAndroid = Platform.OS == "android";
                const { type, user } = await Google.logInAsync({
                  iosClientId: `329143020223-d3btdfihiakog86pagdhr57dackjsfd7.apps.googleusercontent.com`,
                  androidClientId: `329143020223-95uivubvkhponvm181ohiuumgmtcas1s.apps.googleusercontent.com`,
                  clientId: isAndroid ? `800013144201-v3msqvr0q7irv00t50r29arh1mvhttjn.apps.googleusercontent.com`:`800013144201-2bpo26gsbqevugmet016fgrvr17l6cd7.apps.googleusercontent.com`,
                  scopes: ["profile", "email"]
                });

                if (type === "success") {
                  this.googleSignIn(user);
                }

              } catch (e) {
                Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(e), method: "googleSignIn" });

                if (e.code === "ERR_CANCELED") {
                  // handle that the user canceled the sign-in flow
                  // Reactotron.log('credential', e);
                } else {
                  // handle other errors
                  // Reactotron.log('credential', e);
                }
              }
            }}
          />

          <ButtonIndex
            text={Languages.FacebookLogin}
            //icon={Icons.MaterialCommunityIcons.Facebook}
            imageIcon={Images.Facebook}
            containerStyle={styles.socialButtons}
            textStyle={styles.socialtext}
            iconColor="#1821fa"
            onPress={this.onFBLoginPressHandle}
          />

          {/* <ButtonIndex
            text={Languages.SMSLogin.toUpperCase()}
            icon={Icons.MaterialCommunityIcons.SMS}
            containerStyle={styles.smsButton}
            onPress={() => {
              this.setModalVisible('modalVisible', true);
              // this.textPhoneNumber.focus();
            }}
          /> */}

          {/* {SignInWithAppleButton(styles.appleBtn, this.appleSignIn)} */}
          <View style={styles.separatorWrap2}>
            {showIOSButton && (
              <ButtonIndex
                text={Languages.AppleLogin}
                //icon={Icons.MaterialCommunityIcons.Facebook}
                imageIcon={Images.Apple}
                containerStyle={styles.socialButtons}
                textStyle={styles.socialtext}
                iconColor="#1821fa"
                onPress={async () => {
                  try {
                    Reactotron.log("credential");
                    const credential = await AppleAuthentication.signInAsync({
                      requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                      ],
                    });
                    // signed in
                    this.appleSignIn(credential);
                  } catch (e) {
                    if (e.code === "ERR_CANCELED") {
                      // handle that the user canceled the sign-in flow
                      // Reactotron.log('credential', e);
                    } else {
                      // handle other errors
                      // Reactotron.log('credential', e);
                    }
                  }
                }}
              />
            )}
          </View>

          <View>
            <TouchableOpacity
              style={Styles.Common.ColumnCenter}
              onPress={this.onSignUpHandle}>
              <Text style={[styles.signUp, { color: Color.neutralDark }]}>
                {Languages.DontHaveAccount}{" "}
                <Text style={styles.highlight}>{Languages.signup}</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.Common.ColumnCenter}
              onPress={this.onForgotPasswordHandle}>
              <Text style={[styles.forgotPassword, { color: Color.neutralDark }]}>
                {"¿Olvidaste tu contraseña? "}
                <Text style={styles.highlight}>{"Recuperar"}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? <Spinner mode="full" color="black" /> : null}
      </KeyboardAwareScrollView>
    );
  }

  appleSignIn = async (result) => {
    const { login } = this.props;
    save("typeLogin", "apple");

    if (result.email) {
      this.setState({ isLoading: true });
      const fullName = `${result.fullName.givenName} ${result.fullName.familyName}`;
      save("email", result.email);
      save("fullName", fullName);
      save("user", result.email.split("@")[0]);
      const json = await WPUserAPI.appleLogin(
        result.email,
        fullName,
        result.email.split("@")[0]
      );
      if (json === undefined) {
        this.stopAndToast(Languages.GetDataError);
      } else if (json.error) {
        this.stopAndToast(json.error);
      } else {
        let customers = await WooWorker.getCustomerById(json.wp_user_id);
        this._onBack();
        try {
          Analytics.logEvent('LoginApple', {
            customer: JSON.stringify(customers),
            apple: JSON.stringify(result)
          });
        }
        catch (err) {
          console.log(err);
        }
        login(customers, json.cookie);
      }
    } else {
      this.setState({ isLoading: true });
      let email = (await getValueFor("email")).toString();
      let fullName1 = (await getValueFor("fullName")).toString();
      let user = (await getValueFor("user")).toString();
      if (email) {
        const json = await WPUserAPI.appleLogin(
          email,
          fullName1,
          user
        );
        if (json === undefined) {
          this.stopAndToast(Languages.GetDataError);
        } else if (json.error) {
          this.stopAndToast(json.error);
        } else {
          let customers = await WooWorker.getCustomerById(json.wp_user_id);
          this._onBack();
          try {
            Analytics.logEvent('LoginApple', {
              customer: JSON.stringify(customers),
              google: JSON.stringify(result)
            });
          }
          catch (err) {
            console.log(err);
          }
          login(customers, json.cookie);
        }
      }
      else {
        this.stopAndToast("No fue posible ingresar con apple.");
      }
    }
  };


  googleSignIn = async (result) => {
    const { login } = this.props;
    this.setState({ isLoading: true });
    const fullName = result.name;//`${result.fullName.givenName} ${result.fullName.familyName}`;
    save("typeLogin", "google");
    save("emailG", result.email);
    save("fullNameG", fullName);
    save("userG", result.email.split("@")[0]);

    const json = await WPUserAPI.appleLogin(
      result.email,
      fullName,
      result.email.split("@")[0]
    );
    if (json === undefined) {
      this.stopAndToast(Languages.GetDataError);
    } else if (json.error) {
      this.stopAndToast(json.error);
    } else {
      let customers = await WooWorker.getCustomerById(json.wp_user_id);
      this._onBack();
      try {
        Analytics.logEvent('LoginGoogle', {
          customer: JSON.stringify(customers),
          google: JSON.stringify(result)
        });
      }
      catch (err) {
        console.log(err);
      }

      login(customers, json.cookie);


    }

  };
}

LoginScreen.propTypes = {
  netInfo: PropTypes.object,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = ({ netInfo, user }) => ({ netInfo, user });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require("@redux/UserRedux");
  const AddressRedux = require("@redux/AddressRedux");

  return {
    login: (user, token) => dispatch(actions.login(user, token)),
    logout: () => dispatch(actions.logout()),
    initAddresses: (customerInfo) => {
      AddressRedux.actions.initAddresses(dispatch, customerInfo);
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(LoginScreen));
