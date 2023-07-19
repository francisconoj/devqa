/** @format */

import React, { PureComponent } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ScrollView, Text, Switch, I18nManager, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";

import {
  UserProfileHeader,
  UserProfileItem,
  ModalBox,
  CurrencyPicker,
} from "@components";
import { Languages, Color, Tools, Config, withTheme, Icons, Styles } from "@common";
import { getNotification } from "@app/Omni";

import styles from "./styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from 'moment';
import { TextInputMask } from "react-native-masked-text";
import RNPickerSelect from 'react-native-picker-select';
import Tcomb from "tcomb-form-native";
import { cloneDeep } from "lodash";
import CustomAPI from "@services/CustomAPI";
import * as Constants1 from 'expo-constants';

const customInputStyle = cloneDeep(Tcomb.form.Form.stylesheet);
const Form = Tcomb.form.Form;
class UserProfile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: {
        firstName: "",
        lastName: "",
        nacimiento: "",
        sexo: "",
        nit: "",
        correo2: ""
      },
      pushNotification: false,
      edit: false,
      editButtons: false,
      editName: "",
      editLastName: "",
      error: "",
      errorMsg: "",
      sexo: null,
      nacimiento: "",
      nit: "",
      correo2: ""
    };

    this.initFormValues();


    this._handlerSubmitEdit = this._handlerSubmitEdit.bind(this);
  }

  initFormValues = () => {
    const {
      theme: {
        colors: { placeholder },
      },
    } = this.props;



    const sexoEnum = Tcomb.enums({
      '0': 'Masculino',
      '1': 'Femenino',
    }, 'sexo');
    // define customer form
    const Email = Tcomb.refinement(
      Tcomb.String,
      (s) => Validator.checkEmail(s) === undefined
    );
    Email.getValidationErrorMessage = (s) => Validator.checkEmail(s);
    this.Customer = Tcomb.struct({
      first_name: Tcomb.String,
      last_name: Tcomb.String,
      nacimiento: Tcomb.Date,
      sexo: sexoEnum,
      correo2: Email,
      nit: Tcomb.String,
    });

    // form options
    this.options = {
      auto: "none", // we have labels and placeholders as option here (in Engrish, ofcourse).
      // stylesheet: css,
      fields: {
        first_name: {
          label: Languages.FirstName,
          placeholder: Languages.TypeFirstName,
          error: Languages.EmptyError, // for simple empty error warning.
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
        },
        last_name: {
          label: Languages.LastName,
          placeholder: Languages.TypeLastName,
          error: Languages.EmptyError,
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
        },
        sexo: {
          label: "Género",
          placeholder: Languages.TypeMunicipality,
          error: Languages.EmptyError,
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
          autoCorrect: false,
        },
        nacimiento: {
          label: "Fecha de Nacimiento",
          placeholder: Languages.TypeAddress,
          error: Languages.EmptyError,
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
          mode: 'date',
          config: {
            format: (date) => moment(date).format('DD-MM-YYYY'),
          },
        },
        correo2: {
          label: Languages.correoAlterno,
          placeholder: Languages.TypeEmail,
          error: Languages.EmptyError,
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
        },
        nit: {
          label: Languages.nit,
          placeholder: Languages.TypeNit,
          error: Languages.EmptyError,
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
        },
      },
    };



  };


  _getCustomInputStyle = () => {
    customInputStyle.controlLabel.normal = {
      ...customInputStyle.controlLabel.normal,
      fontSize: 14,
      color: Color.neutralDark,
      marginTop: 0,
      paddingTop: 0,
      marginBottom: 4,
      flex: 1,
      fontFamily: 'Mulish',
      color: '#767676',
      paddingHorizontal: 16,
      textAlign: 'left',
    };
    customInputStyle.controlLabel.error = {
      ...customInputStyle.controlLabel.normal,
      color: '#ef5350',
    };
    customInputStyle.textbox.normal = {
      ...customInputStyle.textbox.normal,
      color: Color.neutralDark,
      borderWidth: 1,
      borderColor: '#E3E3E3',
      borderRadius: 4,
      paddingHorizontal: 2,
      paddingVertical: 12,
      height: 44,
      textAlign: 'left',
      fontFamily: 'Mulish',
      fontSize: 13,
    };
    customInputStyle.textbox.error = {
      ...customInputStyle.textbox.normal,
      borderColor: '#ef5350',
    };
    customInputStyle.formGroup.normal = {
      ...customInputStyle.formGroup.normal,
      marginBottom: 12,
      marginHorizontal: 16,
    };
    customInputStyle.formGroup.error = {
      ...customInputStyle.formGroup.normal,
      marginBottom: 12,
      marginHorizontal: 16,
    };
    customInputStyle.errorBlock = {
      ...customInputStyle.errorBlock,
      color: '#ef5350',
      textAlign: 'left',
      fontFamily: 'Mulish',
      fontSize: 12,
      paddingHorizontal: 16,
    };

    return customInputStyle;
  };


  UNSAFE_componentWillMount() {
    this._handleSwitchNotification(true);
  }

  componentDidMount() {
    this._getNotificationStatus();
  }

  _getNotificationStatus = async () => {
    const notification = await getNotification();

    this.setState({ pushNotification: notification || false });
  };

  /**
   * TODO: refactor to config.js file
   */
  _getListItem = () => {
    const { currency, wishListTotal, userProfile, isDarkTheme } = this.props;
    const listItem = [...Config.ProfileSettings];
    const items = [];
    let index = 0;

    for (let i = 0; i < listItem.length; i++) {
      const item = listItem[i];
      if (item.label === "PushNotification") {
        item.icon = () => (
          <Switch
            onValueChange={this._handleSwitchNotification}
            value={this.state.pushNotification}
            trackColor={Color.blackDivide}
          />
        );
      }
      if (item.label === "DarkTheme") {
        item.icon = () => (
          <Switch
            onValueChange={this._onToggleDarkTheme}
            value={isDarkTheme}
            trackColor={Color.blackDivide}
          />
        );
      }
      if (item.label === "Currency") {
        item.value = currency.code;
      }

      if (item.label === "WishList") {
        items.push({
          ...item,
          label: `${Languages.WishList} (${wishListTotal})`,
        });
      } else {
        items.push({ ...item, label: Languages[item.label] });
      }
    }

    if (!userProfile.user) {
      index = _.findIndex(items, (item) => item.label === Languages.Address);
      if (index > -1) {
        items.splice(index, 1);
      }
    }
    if (!userProfile.user) {
      index = _.findIndex(items, (item) => item.label === Languages.MyCards);
      if (index > -1) {
        items.splice(index, 1);
      }
    }

    if (!userProfile.user || Config.Affiliate.enable) {
      index = _.findIndex(items, (item) => item.label === Languages.MyOrder);
      if (index > -1) {
        items.splice(index, 1);
      }
    }
    return items;
  };

  _onToggleDarkTheme = () => {
    this.props.toggleDarkTheme();
  };

  _handleSwitchNotification = (value) => {
    AsyncStorage.setItem("@notification", JSON.stringify(value), () => {
      this.setState({
        pushNotification: value,
      });
    });
  };

  _handlePress = (item) => {
    const { navigation } = this.props;
    const { routeName, isActionSheet } = item;

    if (routeName && !isActionSheet) {
      navigation.navigate(routeName, item.params);
    }

    if (isActionSheet) {
      this.currencyPicker.openModal();
    }
  };

  _editProfile = (valueEdit) => {
    let nac;
    let sex;
    let nit;
    let correo2;
    let exist = false;
    if (this.props.userProfile.user) {
      this.props.userProfile.user.meta_data.forEach(element => {
        if (element.key === "nacimiento") {
          nac = element.value;
          exist = true;
        }
        if (element.key === "sexo") {
          sex = element.value;
        }
        if (element.key === "nit") {
          nit = element.value;
        }
        if (element.key === "correo_alterno") {
          correo2 = element.value;
        }
      });

    }
    else {
      nac = '01-01-1970';
      sex = 0;
    }
    var date = nac ? new Date(nac) : new Date();
    date.setDate(date.getDate());
    let value = {
      first_name: this.props.userProfile.user.first_name,
      last_name: this.props.userProfile.user.last_name,
      nacimiento: date,
      sexo: sex,
      nit: nit,
      correo2: correo2
    };
    this.setState({
      value,
      edit: valueEdit,
      editButtons: valueEdit,
      error: false,
      errorMsg: ""
    });


  }

  _handlerSubmitEdit = (value, key) => {
    switch (key) {
      case "Name":
        this.setState({ editName: value });

        if (value.length === 0) {
          this.setState({
            error: true,
            errorMsg: Languages.EmptyError
          });
        } else {
          this.setState({
            error: false,
            errorMsg: ""
          });
        }

        break;
      case "lastName": this.setState({ editLastName: value }); break;
      // case "nacimiento": this.setState({ editLastName: value }); break;
    }



  }

  _cancelEdit = () => {
    this._editProfile(false);
  }
  _saveEdit = async () => {

    let firstName = this.state.value.first_name;
    let lastName = this.state.value.last_name;
    if (firstName.length === 0) {
      this.setState({
        error: true,
        errorMsg: Languages.EmptyError
      });
    } else {

      const profile = {
        first_name: firstName,
        last_name: lastName,
        user_id: this.props.userProfile.user.id,

      }
      this.setState({ sexo: this.state.value.sexo });
      this.setState({ nacimiento: moment(this.state.value.nacimiento).format('DD-MM-YYYY') });
      this.setState({ nit: this.state.value.nit });
      this.setState({ correo2: this.state.value.correo2 });

      let exist = false;
      let existNit = false;
      let existEmail2 = false;
      this.props.userProfile.user.meta_data.forEach(element => {
        if (element.key === "nacimiento") {
          element.value = this.state.value.nacimiento;
          exist = true;
        }
        if (element.key === "sexo") {
          element.value = this.state.value.sexo;
        }
        if (element.key === "nit") {
          element.value = this.state.value.nit;
          existNit = true;
        }
        if (element.key === "correo_alterno") {
          element.value = this.state.value.correo2;
          existEmail2 = true;
        }
      });
      if (!exist) {
        this.props.userProfile.user.meta_data.push({ key: "nacimiento", value: this.state.value.nacimiento });
        this.props.userProfile.user.meta_data.push({ key: "sexo", value: this.state.value.sexo });

      }
      if (!existNit) {
        this.props.userProfile.user.meta_data.push({ key: "nit", value: this.state.value.nit });

      }
      if (!existEmail2) {
        this.props.userProfile.user.meta_data.push({ key: "correo_alterno", value: this.state.value.correo2 });

      }
      const userUpdate = {
        user_id: this.props.userProfile.user.id,
        user_nac: new Date(this.state.value.nacimiento - 1),
        user_sex: this.state.value.sexo,
        user_correo2: this.state.value.correo2,
        user_nit : this.state.value.nit
      };
      const updateUser = await CustomAPI.setMetaUser(userUpdate, (userUpdate) => {
      });

      this._editProfile(false);
      this.props.updateProfile(profile);
      // 
      //    this.setState({ sexo: this.state.value.sexo });

    }
  }

  onChange = (value) => {
    this.setState({ value });
  };


  render() {
    const { userProfile, navigation, currency, changeCurrency, selectedAddress } = this.props;

    //if () dataprofile  = userProfile.user; 

    const user = userProfile.user || {};
    const dataprofile = typeof profile === 'undefined' ? user : profile;
    const address = selectedAddress || {};
    const name = Tools.getName(user);
    const listItem = this._getListItem();
    const first_name = /*profile!== null || profile !== "undefined" ? profile.first_name : ""*/ user.first_name || "";
    const last_name =/*profile!== null || profile !== "undefined" ? profile.last_name : ""*/ user.last_name || "";
    try {
      if (userProfile.user) {
        userProfile.user.meta_data.forEach(element => {
          if (element.key === "nacimiento") {
            this.setState({ nacimiento: moment(element.value).format('DD-MM-YYYY') });
          }
          if (element.key === "sexo") {
            this.setState({ sexo: element.value });
          }
          if (element.key === "nit") {
            this.setState({ nit: element.value });
          }
          if (element.key === "correo_alterno") {
            this.setState({ correo2: element.value });
          }
        });
      }
      else {
        this.setState({ nacimiento: moment(new Date('01-01-1970')).format('DD-MM-YYYY') });
        this.setState({ sexo: '0' });
      }
    }
    catch (error) {
      this.setState({ nacimiento: moment(new Date('01-01-1970')).format('DD-MM-YYYY') });
      this.setState({ sexo: '0' });
    }
    const {
      theme: {
        colors: { background },
        dark,
      },
    } = this.props;

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <ScrollView ref="scrollView">
          <UserProfileHeader
            onLogin={() => navigation.navigate("LoginScreen")}
            onLogout={() =>
              navigation.navigate("LoginScreen", { isLogout: true })
            }
            user={{
              ...user,
              name,
            }}
          />

          {userProfile.user && (
            <View style={[styles.profileSection(dark)]}>
              <View style={[styles.row]}>
                <Text style={[styles.headerSection, styles.rightContainer]}>
                  {Languages.AccountInformations.toUpperCase()}
                </Text>
                <View style={styles.rightContainer}>
                  <Icon
                    name={Icons.MaterialCommunityIcons.Edit}
                    size={Styles.IconSize.Inline}
                    color={Color.primary}
                    onPress={() => this._editProfile(true)}
                  />
                </View>
              </View>
              {!this.state.editButtons &&
                <View>
                  <UserProfileItem
                    label={Languages.Name}
                    value={name}
                    _handlerSubmitEdit={this._handlerSubmitEdit}
                  />
                  <UserProfileItem
                    label={"Fecha de nacimiento"}
                    value={this.state.nacimiento}
                    _handlerSubmitEdit={this._handlerSubmitEdit}
                  />
                  <UserProfileItem
                    label={"Género"}
                    value={this.state.sexo === '0' ? "Masculino" : this.state.sexo === '1' ? "Femenino" : ''}
                    _handlerSubmitEdit={this._handlerSubmitEdit}
                  />
                </View>
              }



              {(() => {
                if (this.state.editButtons) {
                  return (
                    <View>
                      <Form
                        ref="form"
                        type={this.Customer}
                        options={this.options}
                        value={this.state.value}
                        onChange={this.onChange}
                      />

                      <View style={[styles.row]}>
                        <TouchableOpacity style={styles.btnCancel} onPress={this._cancelEdit} >
                          <Text style={styles.cancel}>{Languages.Cancel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnSave} onPress={this._saveEdit} >
                          <Text style={styles.add}>{Languages.Confirm}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }
              })()}
              <UserProfileItem label={Languages.Email} value={user.email} />
              <UserProfileItem label={Languages.Phone} value={address.phone} />
              <UserProfileItem
                label={Languages.correoAlterno}
                value={this.state.correo2}
                _handlerSubmitEdit={this._handlerSubmitEdit}
              />
              <UserProfileItem
                label={Languages.nit}
                value={this.state.nit}
                _handlerSubmitEdit={this._handlerSubmitEdit}
              />

              {/* <UserProfileItem label={Languages.Address} value={user.address} /> */}

            </View>
          )}

          <View style={[styles.profileSection(dark)]}>
            {listItem.map((item, index) => {
              return (
                item && (
                  <UserProfileItem
                    icon
                    key={index.toString()}
                    onPress={() => this._handlePress(item)}
                    {...item}
                  />
                )
              );
            })}
          </View>
          <View style={[styles.profileSection(dark)]}>
            <UserProfileItem label={"Versión"} value={Constants1.default.manifest.version} />
          </View>
        </ScrollView>

        <ModalBox ref={(c) => (this.currencyPicker = c)}>
          <CurrencyPicker currency={currency} changeCurrency={changeCurrency} />
        </ModalBox>
      </View>
    );
  }
}

const mapStateToProps = ({ addresses, user, language, currency, wishList, app }) => ({
  userProfile: user,
  language,
  currency,
  wishListTotal: wishList.wishListItems.length,
  isDarkTheme: app.isDarkTheme,
  selectedAddress: addresses.selectedAddress,
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions: CurrencyActions } = require("@redux/CurrencyRedux");
  const { actions: updateProfileActions } = require("@redux/UserRedux");
  const { toggleDarkTheme } = require("@redux/AppRedux");
  return {
    ...ownProps,
    ...stateProps,
    changeCurrency: (currency) =>
      CurrencyActions.changeCurrency(dispatch, currency),
    updateProfile: (profile) => {
      updateProfileActions.updateProfile(dispatch, profile);
    },
    toggleDarkTheme: () => {
      dispatch(toggleDarkTheme());
    },
  };
}

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(withTheme(UserProfile));
