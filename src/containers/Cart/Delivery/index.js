/** @format */

import React, { PureComponent } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Tcomb from 'tcomb-form-native';
import { cloneDeep, get, size, findKey } from 'lodash';
import { TextInputMask } from 'react-native-masked-text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CountryPicker from 'react-native-country-picker-modal';

import Buttons from '@cart/Buttons';
import { ShippingMethod } from '@components';
import { Config, Validator, Languages, withTheme, Color, Icons, Images } from '@common';
import { toast, BlockTimer } from '@app/Omni';
import styles from './styles';
import CustomAPI from "@services/CustomAPI";
import { LinearGradient } from "@expo";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const Form = Tcomb.form.Form;

const customInputStyle = cloneDeep(Tcomb.form.Form.stylesheet);
const customStyle = cloneDeep(Tcomb.form.Form.stylesheet);

class Delivery extends PureComponent {
  department = Tcomb.enums({
    'Guatemala': 'Guatemala',
    'Sacatepéquez': 'Sacatepéquez',
    'Escuintla': 'Escuintla'
  }, 'department');


  postCode = Tcomb.enums({
    '01001': 'Zona 1',
    '01002': 'Zona 2',
    '01003': 'Zona 3',
    '01004': 'Zona 4',
    '01005': 'Zona 5',
    '01006': 'Zona 6',
    '01007': 'Zona 7',
    '01008': 'Zona 8',
    '01009': 'Zona 9',
    '01010': 'Zona 10',
    '01011': 'Zona 11',
    '01012': 'Zona 12',
    '01013': 'Zona 13',
    '01014': 'Zona 14',
    '01015': 'Zona 15',
    '01016': 'Zona 16',
    '01017': 'Zona 17',
    '01018': 'Zona 18',
    '01019': 'Zona 19',
    '01021': 'Zona 21'
  });
  ;
  city = Tcomb.enums({
    'Guatemala': 'Guatemala',
    'Mixco': 'Mixco',
    'Amatitlán': 'Amatitlán',
    'Villa Nueva': 'Villa Nueva',
    'San José Pinula': 'San José Pinula',
    'San Juan Sacatepéquez': 'San Juan Sacatepéquez',
    'San Miguel Petapa': 'San Miguel Petapa',
    'Santa Catarina Pinula': 'Santa Catarina Pinula',
    'Fraijanes': 'Fraijanes'
  }, 'city');

  constructor(props) {
    super(props);
    this.state = {
      value: {
        first_name: '',
        last_name: '',
        address_1: '',
        state: 'Guatemala',
        postcode: '01001',
        city: 'Guatemala',
        country: '',
        email: '',
        phone: '',
        note: '',
      },
      value3: {
        address: ''
      },
      value2: {
        billingName: '',
        billingNit: '',
        billingAddress: '',
      },
    };
    this.selectedAddress1;

    this.initFormValues();
  }
  /*
    componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
      //if (this.props.selectedAddress !== prevProps.selectedAddress)
        
      //this.state.value.city = this.props.selectedAddress.city;
    this.setDropList(this.state.value);
       
  
    }
  */

  componentDidMount() {
    const { getShippingMethod } = this.props;

    this.fetchCustomer(this.props);

    getShippingMethod(Config.shipping.zoneId);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.initAddressList();
    if (nextProps.user !== this.props.user) {
      this.fetchCustomer(nextProps);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.initAddressList();
  }


  _getCustomStyle = () => {
    const {
      theme: {
        colors: { text },
      },
    } = this.props;
    // Customize Form Stylesheet
    customStyle.textbox.normal = {
      ...customStyle.textbox.normal,
      color: Color.neutralDark,
      borderWidth: 1,
      borderColor: '#E3E3E3',
      borderRadius: 4,
      marginHorizontal: 15,
      paddingVertical: 12,
      height: 150,
      textAlign: 'left',
      fontFamily: 'Mulish',
      fontSize: 16,
    };
    customStyle.controlLabel.normal = {
      ...customStyle.controlLabel.normal,
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

    return customStyle;
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
      paddingHorizontal: 16,
      paddingVertical: 12,
      height: 44,
      textAlign: 'left',
      fontFamily: 'Mulish',
      fontSize: 16,
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

  selectAddress = (item) => {
    this.props.addressList.forEach(element => {
      if (element === item) {
        element.selected = "true";
      }
      else {
        element.selected = "false";
      }

    });
    this.props.selectAddress(item, this.props.user.user.id);
  };


  onChangeAddress = (value) => {
    this.setState({ value3: value });
    this.props.addressList.forEach(element => {
      if (element.index == value.address) {
        this.selectAddress(element);
        this.setState({ value: element });
      }
    });
  };

  onChange = (value) => {
    this.setState({ value });
  };

  onChange2 = (value) => this.setState({ value2: value });

  onPress = () => this.refs.form.getValue();

  initAddressList = () => {

    this.state.value3.address = this.props.selectedAddress.index;
    let index = 0;
    this.props.addressList.forEach(element => {
      element.index = index;
      index++;
    });


    let convertedResult = this.props.addressList.reduce(function (result, current) {
      result[current.index] = current.name_address ? current.name_address : (current.first_name + " " + current.last_name);
      return result;
    }, {});

    this.addressCustom = Tcomb.struct({
      address: Tcomb.enums(convertedResult, 'address')
    });
    if (this.props.selectedAddress) {
      const Email = Tcomb.refinement(
        Tcomb.String,
        (s) => Validator.checkEmail(s) === undefined
      );
      Email.getValidationErrorMessage = (s) => Validator.checkEmail(s);
      if (this.props.selectedAddress.state === 'Guatemala' && this.props.selectedAddress.city === 'Guatemala') {
        this.Customer = Tcomb.struct({
          first_name: Tcomb.String,
          last_name: Tcomb.String,
          ...(Config.DefaultCountry.hideCountryList
            ? {}
            : { country: Tcomb.String }),
          state: Tcomb.String,
          city: Tcomb.String,
          postcode: Tcomb.String,
          address_1: Tcomb.String,
          email: Email,
          phone: Tcomb.String,
          note: Tcomb.maybe(Tcomb.String), // maybe = optional
        });
      }
      else {
        this.Customer = Tcomb.struct({
          first_name: Tcomb.String,
          last_name: Tcomb.String,
          ...(Config.DefaultCountry.hideCountryList
            ? {}
            : { country: Tcomb.String }),
          state: Tcomb.String,
          city: Tcomb.String,
          address_1: Tcomb.String,
          email: Email,
          phone: Tcomb.String,
          note: Tcomb.maybe(Tcomb.String), // maybe = optional
        });

      }
    }

  }


  initFormValues = () => {
    const placeholder = '#C8C8C8';
    // const countries = this.props.countries;
    // override the validate method of Tcomb lib for multi validate requirement.
    // const Countries = Tcomb.enums(countries);
    const Email = Tcomb.refinement(
      Tcomb.String,
      (s) => Validator.checkEmail(s) === undefined
    );
    Email.getValidationErrorMessage = (s) => Validator.checkEmail(s);

    const Phone = Tcomb.refinement(
      Tcomb.String,
      (s) => Validator.checkPhone(s) === undefined
    );
    Phone.getValidationErrorMessage = (s) => Validator.checkPhone(s);

    // define customer form
    this.Customer = Tcomb.struct({
      first_name: Tcomb.String,
      last_name: Tcomb.String,
      ...(Config.DefaultCountry.hideCountryList
        ? {}
        : { country: Tcomb.String }),
      state: Tcomb.String,
      city: Tcomb.String,
      postcode: Tcomb.String,
      address_1: Tcomb.String,
      email: Email,
      phone: Tcomb.String,
      note: Tcomb.maybe(Tcomb.String), // maybe = optional
    });

    this.BillingForm = Tcomb.struct({
      billingName: Tcomb.String,
      billingNit: Tcomb.String,
      billingAddress: Tcomb.String,
      ...(Config.DefaultCountry.hideCountryList
        ? {}
        : { country: Tcomb.String }),
    });

    this.billingOptions = {
      auto: 'none', // we have labels and placeholders as option here (in Engrish, ofcourse).
      // stylesheet: css,
      fields: {
        billingName: {
          label: Languages.FirstName,
          placeholder: Languages.TypeFirstName,
          error: Languages.EmptyError, // for simple empty error warning.
          underlineColorAndroid: 'transparent',
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
        },
        billingNit: {
          label: Languages.nit,
          placeholder: Languages.TypeNit,
          error: Languages.EmptyError,
          underlineColorAndroid: 'transparent',
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
        },
        billingAddress: {
          label: Languages.Address,
          placeholder: Languages.TypeAddress,
          error: Languages.EmptyError,
          underlineColorAndroid: 'transparent',
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
        },
      },
    };

    this.initAddressList();

    // this.addressCustom = Tcomb.enums(convertedResult, 'address');
    // form select address

    this.optionsAddress = {
      auto: 'none', // we have labels and placeholders as option here (in Engrish, ofcourse).
      // stylesheet: css,
      fields: {
        address: {
          label: Languages.Address,
          placeholder: Languages.TypeAddress,
          error: Languages.EmptyError,
          underlineColorAndroid: 'transparent',
          stylesheet: this._getCustomInputStyle(),
          autoCorrect: false,
          placeholderTextColor: placeholder,
        },
      },
    };
    // form options
    this.options = {
      auto: 'none', // we have labels and placeholders as option here (in Engrish, ofcourse).
      // stylesheet: css,
      fields: {
        first_name: {
          label: Languages.FirstName,
          placeholder: Languages.TypeFirstName,
          error: Languages.EmptyError, // for simple empty error warning.
          underlineColorAndroid: 'transparent',
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
          editable: false,
        },
        last_name: {
          label: Languages.LastName,
          placeholder: Languages.TypeLastName,
          error: Languages.EmptyError,
          underlineColorAndroid: 'transparent',
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
          editable: false,
        },
        address_1: {
          label: Languages.Address,
          placeholder: Languages.TypeAddress,
          error: Languages.EmptyError,
          underlineColorAndroid: 'transparent',
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
          editable: false,
        },
        ...(Config.DefaultCountry.hideCountryList
          ? {}
          : {
            country: {
              label: Languages.TypeCountry,
              placeholder: Languages.Country,
              error: Languages.NotSelectedError,
              stylesheet: this._getCustomInputStyle(),
              template: this.renderCountry,
              placeholderTextColor: placeholder,
              editable: false,
            },
          }),
        state: {
          label: Languages.State,
          placeholder: Languages.TypeState,
          error: Languages.EmptyError,
          underlineColorAndroid: 'transparent',
          stylesheet: this._getCustomInputStyle(),
          autoCorrect: false,
          placeholderTextColor: placeholder,
          editable: false,
          enable: false,
          desable: true

        },
        city: {
          label: Languages.municipality,
          placeholder: Languages.TypeMunicipality,
          error: Languages.EmptyError,
          underlineColorAndroid: 'transparent',
          stylesheet: this._getCustomInputStyle(),
          autoCorrect: false,
          placeholderTextColor: placeholder,
          editable: false,
        },
        postcode: {
          label: Languages.zone,
          placeholder: Languages.TypeZone,
          error: Languages.EmptyError,
          underlineColorAndroid: 'transparent',
          stylesheet: this._getCustomInputStyle(),
          autoCorrect: false,
          placeholderTextColor: placeholder,
          editable: false,
        },
        email: {
          label: Languages.Email,
          placeholder: Languages.TypeEmail,
          underlineColorAndroid: 'transparent',
          stylesheet: this._getCustomInputStyle(),
          autoCorrect: false,
          placeholderTextColor: placeholder,
          editable: false,
        },
        phone: {
          label: Languages.Phone,
          placeholder: Languages.TypePhone,
          underlineColorAndroid: 'transparent',
          error: Languages.EmptyError,
          stylesheet: this._getCustomInputStyle(),
          //    template: this.renderPhoneInput,
          autoCorrect: false,
          placeholderTextColor: placeholder,
          editable: false,
        },
        note: {
          label: Languages.Note,
          placeholder: Languages.TypeNote,
          underlineColorAndroid: 'transparent',
          multiline: true,
          stylesheet: this._getCustomStyle(),
          autoCorrect: false,
          placeholderTextColor: placeholder,
          editable: false,
        },
      },
    };
  };

  renderPhoneInput = (locals) => {
    const {
      theme: {
        colors: { placeholder },
      },
    } = this.props;
    const stylesheet = locals.stylesheet;
    let formGroupStyle = stylesheet.formGroup.normal;
    let controlLabelStyle = stylesheet.controlLabel.normal;
    let textboxStyle = stylesheet.textbox.normal;
    let helpBlockStyle = stylesheet.helpBlock.normal;
    const errorBlockStyle = stylesheet.errorBlock;

    if (locals.hasError) {
      formGroupStyle = stylesheet.formGroup.error;
      controlLabelStyle = stylesheet.controlLabel.error;
      textboxStyle = stylesheet.textbox.error;
      helpBlockStyle = stylesheet.helpBlock.error;
    }

    const label = locals.label ? (
      <Text style={controlLabelStyle}>{locals.label}</Text>
    ) : null;
    const help = locals.help ? (
      <Text style={helpBlockStyle}>{locals.help}</Text>
    ) : null;
    const error =
      locals.hasError && locals.error ? (
        <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
          {locals.error}
        </Text>
      ) : null;

    return (
      <View style={formGroupStyle}>
        {label}
        <TextInputMask
          type="cel-phone"
          options={{
            maskType: 'international',
            withDDD: false,
          }}
          style={textboxStyle}
          onChangeText={(value) => locals.onChange(value)}
          onChange={locals.onChangeNative}
          placeholder={locals.placeholder}
          value={locals.value}
          placeholderTextColor={placeholder}
        />
        {help}
        {error}
      </View>
    );
  };

  renderCountry = (locals) => {
    const stylesheet = locals.stylesheet;
    let formGroupStyle = stylesheet.formGroup.normal;
    let controlLabelStyle = stylesheet.controlLabel.normal;
    // eslint-disable-next-line no-unused-vars
    let textboxStyle = stylesheet.textbox.normal;
    let helpBlockStyle = stylesheet.helpBlock.normal;
    const errorBlockStyle = stylesheet.errorBlock;

    if (locals.hasError) {
      formGroupStyle = stylesheet.formGroup.error;
      controlLabelStyle = stylesheet.controlLabel.error;
      textboxStyle = stylesheet.textbox.error;
      helpBlockStyle = stylesheet.helpBlock.error;
    }

    const label = locals.label ? (
      <Text style={controlLabelStyle}>{locals.label}</Text>
    ) : null;
    const help = locals.help ? (
      <Text style={helpBlockStyle}>{locals.help}</Text>
    ) : null;
    const error =
      locals.hasError && locals.error ? (
        <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
          {locals.error}
        </Text>
      ) : null;

    return (
      <View style={formGroupStyle}>
        {label}
        <CountryPicker
          onSelect={(value) => {
            this.setState({
              value: {
                ...this.state.value,
                country: value.cca2,
              },
            });

            locals.onChange(value.name);
          }}
          cca2={this.state.value.country}
          countryCode={this.state.value.country}
          filterable
          withCountryNameButton
        />
        {help}
        {error}
      </View>
    );
  };



  validAddress = (address) => {
    if (address.state !== 'Guatemala' && address.state !== 'Sacatepéquez' && address.state !== 'Escuintla') {
      address.state = 'Guatemala';
      address.city = 'Guatemala';
      address.postcode = '01001';
    }
    return address;
  }
  fetchCustomer = async (props) => {
    const { selectedAddress } = props;
    const { user: customer } = props.user;
    let value;
    if (selectedAddress !== this.selectedAddress1) {
      this.validAddress(selectedAddress);
      //this.setDropList(selectedAddress);
      this.initAddressList();
      value = selectedAddress;

      this.selectedAddress1 = selectedAddress;
    }
    value.country = Config.DefaultCountry.countryCode;
    // this.getZone(value);
    this.state.value = value;
  };

  getZone = (value) => {
    if (value.state === 'Guatemala' && value.city === 'Guatemala') {
      switch (value.postcode) {
        case '01001': return ', Zona 1'; break;
        case '01002': return ', Zona 2'; break;
        case '01003': return ', Zona 3'; break;
        case '01004': return ', Zona 4'; break;
        case '01005': return ', Zona 5'; break;
        case '01006': return ', Zona 6'; break;
        case '01007': return ', Zona 7'; break;
        case '01008': return ', Zona 8'; break;
        case '01009': return ', Zona 9'; break;
        case '01010': return ', Zona 10'; break;
        case '01011': return ', Zona 11'; break;
        case '01012': return ', Zona 12'; break;
        case '01013': return ', Zona 13'; break;
        case '01014': return ', Zona 14'; break;
        case '01015': return ', Zona 15'; break;
        case '01016': return ', Zona 16'; break;
        case '01017': return ', Zona 17'; break;
        case '01018': return ', Zona 18'; break;
        case '01019': return ', Zona 19'; break;
        case '01021': return ', Zona 21'; break;
      }
    }
    return "";

  }
  getPostCode = (value) => {
    if (value.state === 'Guatemala') {
      if (value.city === 'Guatemala') {
        switch (value.postcode) {
          case 'Zona 1': value.postcode = '01001'; break;
          case 'Zona 2': value.postcode = '01002'; break;
          case 'Zona 3': value.postcode = '01003'; break;
          case 'Zona 4': value.postcode = '01004'; break;
          case 'Zona 5': value.postcode = '01005'; break;
          case 'Zona 6': value.postcode = '01006'; break;
          case 'Zona 7': value.postcode = '01007'; break;
          case 'Zona 8': value.postcode = '01008'; break;
          case 'Zona 9': value.postcode = '01009'; break;
          case 'Zona 10': value.postcode = '01010'; break;
          case 'Zona 11': value.postcode = '01011'; break;
          case 'Zona 12': value.postcode = '01012'; break;
          case 'Zona 13': value.postcode = '01013'; break;
          case 'Zona 14': value.postcode = '01014'; break;
          case 'Zona 15': value.postcode = '01015'; break;
          case 'Zona 16': value.postcode = '01016'; break;
          case 'Zona 17': value.postcode = '01017'; break;
          case 'Zona 18': value.postcode = '01018'; break;
          case 'Zona 19': value.postcode = '01019'; break;
          case 'Zona 21': value.postcode = '01021'; break;
        }
      }
      else if (value.city === 'Mixco') { value.postcode = '01057'; }
      else if (value.city === 'Amatitlán') { value.postcode = '01063'; }
      else if (value.city === 'Villa Nueva') { value.postcode = '01064'; }
      else if (value.city === 'San José Pinula') { value.postcode = '01052'; }
      else if (value.city === 'San Juan Sacatepéquez') { value.postcode = '01059'; }
      else if (value.city === 'San Miguel Petapa') { value.postcode = '01066'; }
      else if (value.city === 'Santa Catarina Pinula') { value.postcode = "01051"; }
      else if (value.city === 'Fraijanes') { value.postcode = "01062"; }
    }
    else if (value.state === 'Sacatepéquez') {
      value.postcode = '03000';
    }
    else if (value.state === 'Escuintla') {
      value.postcode = '5011';
     
    }

  }



  validateCustomer = async (customerInfo) => {
    await this.props.validateCustomerInfo(customerInfo);

    if (this.props.type === 'INVALIDATE_CUSTOMER_INFO') {
      toast(this.props.message);
      return false;
    }
    this.props.onNext();
  };

  saveUserData = async (userInfo) => {
    this.props.updateSelectedAddress(userInfo);

    try {
      await AsyncStorage.setItem('@userInfo', JSON.stringify(userInfo));
    } catch (error) { }
  };

  selectShippingMethod = (item) => {
    this.props.selectShippingMethod(item);
  };

  getCodeFromCountry = (value) => {
    const { countries } = this.props;
    const country = get(value, 'country');

    return findKey(countries, (c) => c.toLowerCase() === country.toLowerCase());
  };

  nextStep = () => {
    const value = this.refs.form.getValue();

    console.log('Luyx: C: Delivery, F: nextStep, L 429 value(): ', value);

    if (value) {
      let country = '';
      if (Config.DefaultCountry.hideCountryList) {
        country = Config.DefaultCountry.countryCode.toUpperCase();
      } else {
        // Woocommerce only using cca2 to checkout
        country = this.getCodeFromCountry(value);
      }

      console.log('Luyx: C: Delivery, F: nextStep, L 466 country(): ', country);

      // if validation fails, value will be null

      this.getPostCode(this.state.value);

      this.props.onNext({ ...this.state.value, country, ...this.state.value2 });

      // save user info for next use
      this.saveUserData({ ...this.state.value, country });
    }
  };

  editAddress = () => {
    const { setSelectedAddress } = this.props;

    this.getPostCode(this.props.selectedAddress);

    let modAddress = this.props.selectedAddress;
    modAddress["index"] = this.props.selectedAddress.index;
    //  this.getPostCode(modAddress);
    //this.getPostCode(this.props.selectedAddress);
    BlockTimer.execute(() => {
      setSelectedAddress({ idAddress: modAddress });
      this.props.navigation.navigate("EditAddress", { editAddress: this.props.selectedAddress });
    }, 500);
  }

  addAddress = () => {
    this.props.navigation.navigate("AddAddress");

  }
  //navigation.navigate("AddAddress")




  render() {
    const { shippings, shippingMethod, freeShipping } = this.props;/////////////////////////////////////////////aca validar!!
    const isShippingEmpty = typeof shippingMethod.id === 'undefined';
    const hasFreeShipping = freeShipping === undefined ? false : freeShipping;
    const { currency } = this.props;
    let colors = [Color.primary, Color.primary, Color.primary];
    this.props.selectShippingMethod(shippings[0]);
    this.fetchCustomer(this.props);
    this.initAddressList();
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView style={styles.form} enableOnAndroid>
          {Config.shipping.visible && shippings.length > 0 && (
            <View>
              <Text style={[styles.formTitle]}>{Languages.ShippingType}</Text>
              <ScrollView contentContainerStyle={styles.shippingMethod}>
                {!hasFreeShipping && (shippings.map((item, index) => (
                  <ShippingMethod
                    item={item}
                    currency={currency}
                    key={`${index}shipping`}
                    onPress={this.selectShippingMethod}
                    selected={
                      (index === 0 && isShippingEmpty) ||
                      item.id === shippingMethod.id
                    }
                  />
                )))}
                {hasFreeShipping && (
                  <LinearGradient
                    colors={colors}
                    style={[
                      styles.content,
                      styles.shadow,
                    ]}>
                    <Text style={[styles.money, { color: "white" }]}>
                      {"costo: Q0.00"}
                    </Text>
                    <Text style={[styles.type, { color: "white" }]}>
                      {"Envio Gratis"}
                    </Text>
                    {/* <Text style={[styles.time, selected && { color: "white" }]}>
                    {time}
                  </Text> */}
                  </LinearGradient>

                )

                }
              </ScrollView>
            </View>
          )}
          {/*  <View>
            <View style={[styles.formTitleBorder]}>
              <Text style={styles.formTitle}>{Languages.BillingDetail}</Text>
            </View>
            <View style={styles.formContainer}>
              <Form
                ref="form"
                type={this.BillingForm}
                options={this.billingOptions}
                value={this.state.value2}
                onChange={this.onChange2}
              />
                  </View>
          </View>*/}

          <View style={[styles.formTitleBorder]}>
            <Text style={styles.formTitle}>{Languages.YourDeliveryInfo}</Text>
          </View>

          <View style={styles.buttons}>
            {  /*<TouchableOpacity onPress={this.editAddress}>
              <Icon
                style={[styles.iconEdit]}
                name={Icons.MaterialCommunityIcons.UpdateAddress}
                // size={styles.IconSize.Inline}
                color={Color.primary}
              />
            </TouchableOpacity>*/
            }

            <TouchableOpacity onPress={this.addAddress}>
              <Icon
                style={[styles.iconEdit]}
                name={"plus"}
                size={25}
                color={Color.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.formContainer,]}>

            <Form
              ref="form"
              type={this.addressCustom}
              options={this.optionsAddress}
              value={this.state.value3}
              onChange={this.onChangeAddress}
            />
          </View>
          <View style={[styles.formContainer, { marginBottom: 120 }]}>

            <View style={styles.contentAddreess}>
              <View style={styles.content2}>
                <Text style={[styles.name, { color: "black" }]}>{this.state.value.name_address ? this.state.value.name_address : this.state.value.first_name + " " + this.state.value.last_name}</Text>
                {this.state.value.name_address && <Text style={[styles.text, { color: "black" }]}>{this.state.value.first_name + " " + this.state.value.last_name}</Text>}
                <Text style={[styles.text, { color: "black" }]}>{this.state.value.email}</Text>
                <Text style={[styles.text, { color: "black" }]}>{this.state.value.phone}</Text>
                <Text style={[styles.text, { color: "black" }]}>{this.state.value.state + ", " + this.state.value.city + this.getZone(this.state.value)}</Text>
                {/* <Text style={[styles.text, {color: text}]}>{item.postcode}</Text> */}
                <Text style={[styles.text, { color: "black" }]}>{this.state.value.address_1}</Text>
              </View>
              <View style={styles.buttons2}>
                <TouchableOpacity onPress={this.editAddress}>
                  <Icon
                    style={[styles.iconEdit2]}
                    name={Icons.MaterialCommunityIcons.UpdateAddress}

                    color={Color.primary}
                  />
                </TouchableOpacity>

              </View>
            </View>


          </View>
        </KeyboardAwareScrollView>

        <Buttons
          isAbsolute
          onPrevious={this.props.onPrevious}
          onNext={this.nextStep}
        />
      </View>
    );
  }
}

Delivery.defaultProps = {
  shippings: [],
  shippingMethod: {},
  selectedAddress: {},
};

const mapStateToProps = ({ carts, user, countries, addresses, currency, products }) => {
  return {
    user,
    customerInfo: carts.customerInfo,
    message: carts.message,
    type: carts.type,
    isFetching: carts.isFetching,
    shippings: carts.shippings,
    shippingMethod: carts.shippingMethod,
    countries: countries.list,
    selectedAddress: addresses.selectedAddress,
    addressList: addresses.list,
    currency,
    freeShipping: products.coupon && products.coupon.freeShipping
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const CartRedux = require('@redux/CartRedux');
  const AddressRedux = require('@redux/AddressRedux');

  return {
    ...ownProps,
    ...stateProps,
    validateCustomerInfo: (customerInfo) => {
      CartRedux.actions.validateCustomerInfo(dispatch, customerInfo);
    },
    getShippingMethod: (zoneId) => {
      CartRedux.actions.getShippingMethod(dispatch, zoneId);
    },
    selectShippingMethod: (shippingMethod) => {
      CartRedux.actions.selectShippingMethod(dispatch, shippingMethod);
    },
    updateSelectedAddress: (address) => {
      AddressRedux.actions.updateSelectedAddress(dispatch, address);
    },
    selectAddress: (address, userId) => {
      AddressRedux.actions.selectAddress(dispatch, address, userId);
    },
    setSelectedAddress: (idAddress) => {
      AddressRedux.actions.setEditAddress(dispatch, idAddress);
    },
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(withTheme(Delivery));
