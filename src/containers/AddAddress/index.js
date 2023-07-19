/** @format */

import React, { PureComponent } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { TextInputMask } from "react-native-masked-text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CountryPicker from "react-native-country-picker-modal";
import Tcomb from "tcomb-form-native";
import { cloneDeep } from "lodash";
import CustomAPI from "@services/CustomAPI";
import { toast } from '@app/Omni';

import { Validator, Languages, withTheme, Styles, Color } from "@common";
import styles from "./styles";

const Form = Tcomb.form.Form;
const customStyle = cloneDeep(Tcomb.form.Form.stylesheet);
const customInputStyle = cloneDeep(Tcomb.form.Form.stylesheet);
// const labelStyle = cloneDeep(Tcomb.form.Form.stylesheet);

class AddAddress extends PureComponent {
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
        name_address: "",
        first_name: "",
        last_name: "",
        address_1: "",
        state: "Guatemala",
        city: "Guatemala",
        postcode: "01001",
        country: "",
        email: "",
        phone: "",
        note: "",
      },
      cca2: "GT",
      // countryName: "",
    };

    this.initFormValues();
  }


  setDropList(value) {
    try {
      const Email = Tcomb.refinement(
        Tcomb.String,
        (s) => Validator.checkEmail(s) === undefined
      );
      Email.getValidationErrorMessage = (s) => Validator.checkEmail(s);

      if (this.state.value.state !== value.state && value.state !== 'Guatemala') {
        if (this.props.edit === false) {
          if (value.state === 'Escuintla') {
            value.city = 'Palín';
          }
          else {
            value.city = '';
          }
        }
      }
      else if (this.state.value.state !== value.state && value.state === 'Guatemala') {
        value.city = 'Guatemala';
        value.postcode = "01001";
      }

      if (value.state === 'Guatemala') {
        this.city = Tcomb.enums({
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

        if (value.city === 'Mixco') { value.postcode = '01057'; }
        else if (value.city === 'Amatitlán') { value.postcode = '01063'; }
        else if (value.city === 'Villa Nueva') { value.postcode = '01064'; }
        else if (value.city === 'San José Pinula') { value.postcode = '01052'; }
        else if (value.city === 'San Juan Sacatepéquez') { value.postcode = '01059'; }
        else if (value.city === 'San Miguel Petapa') { value.postcode = '01066'; }
        else if (value.city === 'Santa Catarina Pinula') { value.postcode = "01051"; }
        else if (value.city === 'Fraijanes') { value.postcode = "01062"; }
        else if (this.state.value.city !== value.city && value.city === 'Guatemala') {
          value.postcode = "01001";
        }
      }
      else if (value.state === 'Sacatepéquez') {
        //value.city = '';
        value.postcode = '03000';
      }
      else if (value.state === 'Escuintla') {
        //value.city = '';
        value.postcode = '5011';
        this.city = Tcomb.enums({
          'Palín': 'Palín'
        }, 'city');
      }
      if (value.state === 'Guatemala') {
        if (value.city === 'Guatemala') {
          this.Customer = Tcomb.struct({
            name_address: Tcomb.String,
            first_name: Tcomb.String,
            last_name: Tcomb.String,
            state: this.department,
            city: this.city,
            postcode: this.postCode,
            address_1: Tcomb.String,
            email: Email,
            phone: Tcomb.String,
            note: Tcomb.maybe(Tcomb.String), // maybe = optional
          });
        }
        else {
          this.Customer = Tcomb.struct({
            name_address: Tcomb.String,
            first_name: Tcomb.String,
            last_name: Tcomb.String,
            state: this.department,
            city: this.city,
            address_1: Tcomb.String,
            email: Email,
            phone: Tcomb.String,
            note: Tcomb.maybe(Tcomb.String), // maybe = optional
          });
        }
      } else {
        if (value.state === 'Escuintla') {
          this.Customer = Tcomb.struct({
            name_address: Tcomb.String,
            first_name: Tcomb.String,
            last_name: Tcomb.String,
            state: this.department,
            city: this.city,
            address_1: Tcomb.String,
            email: Email,
            phone: Tcomb.String,
            note: Tcomb.maybe(Tcomb.String), // maybe = optional
          });
        }
        else {
          this.Customer = Tcomb.struct({
            name_address: Tcomb.String,
            first_name: Tcomb.String,
            last_name: Tcomb.String,
            state: this.department,
            city: Tcomb.String,
            address_1: Tcomb.String,
            email: Email,
            phone: Tcomb.String,
            note: Tcomb.maybe(Tcomb.String), // maybe = optional
          });
        }
      }
    }
    catch (e) {
      value.state = 'Guatemala';
      value.city = 'Guatemala';
      value.postcode = '01001';
      this.Customer = Tcomb.struct({
        name_address: Tcomb.String,
        first_name: Tcomb.String,
        last_name: Tcomb.String,
        state: this.department,
        city: this.city,
        postcode: this.postCode,
        address_1: Tcomb.String,
        email: Email,
        phone: Tcomb.String,
        note: Tcomb.maybe(Tcomb.String), // maybe = optional
      });
    }
  }

  /*
    componentDidUpdate(prevProps) {
      if (this.state.value !== prevProps.value) {
        toast("cambio el value");
  
      }
     
        if (this.state.value.state !== value.state) {
        if (value.state === 'Guatemala') {       
          value.city = 'Guatemala';
          value.postcode = '01001';
        }
      }
  
      if (this.state.value.city !== value.city) {
        if (value.city === 'Mixco') { value.postcode = '01057'; }
        else if (value.city === 'Amatitlán') { value.postcode = '01063'; }
        else if (value.city === 'villa Nueva') { value.postcode = '01064'; }
        else if (value.city === 'San Juan Sacatepéquez') { value.postcode = '01059'; }
        else if (value.city === 'San Miguel petapa') { value.postcode = '01066'; }
        else if (value.city === 'Antigua Guatemala') { value.postcode = "03000"; }
        else if (value.city === 'San Lucas') { value.postcode = "03000"; }
        else { value.postcode = '01001'; }
  
      }
      const Email = Tcomb.refinement(
        Tcomb.String,
        (s) => Validator.checkEmail(s) === undefined
      );
      Email.getValidationErrorMessage = (s) => Validator.checkEmail(s);
  
  
  
      if ((this.state.value.state !== value.state) && value.state === 'Guatemala') {
        this.Customer = Tcomb.struct({
          first_name: Tcomb.String,
          last_name: Tcomb.String,
          state: this.department,
          city: this.city,
          postcode: this.postCode,
          address_1: Tcomb.String,
          email: Email,
          phone: Tcomb.String,
          note: Tcomb.maybe(Tcomb.String), // maybe = optional
          
        });
  
        if (value.city !== 'Guatemala') {
          this.Customer = Tcomb.struct({
            first_name: Tcomb.String,
            last_name: Tcomb.String,
            state: this.department,
            city: Tcomb.String,
            address_1: Tcomb.String,
            email: Email,
            phone: Tcomb.String,
            note: Tcomb.maybe(Tcomb.String), // maybe = optional
          });
        }
      } else if (this.state.value.state !== value.state) {
        this.Customer = Tcomb.struct({
          first_name: Tcomb.String,
          last_name: Tcomb.String,
          state: this.department,
          city: Tcomb.String,
          address_1: Tcomb.String,
          email: Email,
          phone: Tcomb.String,
          note: Tcomb.maybe(Tcomb.String), // maybe = optional
        });
        value.city = '';
      }
      
   
  
    }*/

  onChange = (value) => {
    this.setDropList(value);
    this.setState({ value });
  };

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
      paddingHorizontal: 16,
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

  initFormValues = () => {
    const {
      theme: {
        colors: { placeholder },
      },
    } = this.props;
    // const countries = this.props.countries;
    // override the validate method of Tcomb lib for multi validate requirement.
    // const Countries = Tcomb.enums(countries);
    const Email = Tcomb.refinement(
      Tcomb.String,
      (s) => Validator.checkEmail(s) === undefined
    );
    Email.getValidationErrorMessage = (s) => Validator.checkEmail(s);


    // define customer form
    this.Customer = Tcomb.struct({
      name_address: Tcomb.String,
      first_name: Tcomb.String,
      last_name: Tcomb.String,
      // country: Tcomb.String,
      state: this.department,
      city: this.city,
      postcode: this.postCode,
      address_1: Tcomb.String,
      email: Email,
      phone: Tcomb.String,
      note: Tcomb.maybe(Tcomb.String), // maybe = optional
    });

    // form options
    this.options = {
      auto: "none", // we have labels and placeholders as option here (in Engrish, ofcourse).
      // stylesheet: css,
      fields: {
        name_address: {
          label: Languages.NameAddres,
          placeholder: Languages.TypeNameAddress,
          error: Languages.EmptyError, // for simple empty error warning.
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
        },
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
        address_1: {
          label: Languages.Address,
          placeholder: Languages.TypeAddress,
          error: Languages.EmptyError,
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
        },
        city: {
          label: Languages.municipality,
          placeholder: Languages.TypeMunicipality,
          error: Languages.EmptyError,
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
          autoCorrect: false,
        },
        state: {
          label: Languages.State,
          placeholder: Languages.TypeState,
          error: Languages.EmptyError,
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
          autoCorrect: false,
        },
        postcode: {
          label: Languages.zone,
          placeholder: Languages.TypeZone,
          error: Languages.EmptyError,
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
          autoCorrect: false,
        },
        country: {
          label: Languages.TypeCountry,
          placeholder: Languages.Country,
          error: Languages.NotSelectedError,
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
          template: this.renderCountry,
        },
        email: {
          label: Languages.Email,
          placeholder: Languages.TypeEmail,
          underlineColorAndroid: "transparent",
          stylesheet: this._getCustomInputStyle(),
          placeholderTextColor: placeholder,
          autoCorrect: false,
        },
        phone: {
          label: Languages.Phone,
          placeholder: Languages.TypePhone,
          underlineColorAndroid: "transparent",
          error: Languages.EmptyError,
          stylesheet: this._getCustomInputStyle(),
          template: this.renderPhoneInput,
          placeholderTextColor: placeholder,
          autoCorrect: false,
        },
        note: {
          label: Languages.Note,
          placeholder: Languages.TypeNote,
          underlineColorAndroid: "transparent",
          multiline: true,
          stylesheet: this._getCustomStyle(),
          placeholderTextColor: placeholder,
          autoCorrect: false,
        },
      },
    };

  };

  componentDidMount() {
    if (this.props.edit) {
      this.setAddressData();
    }
  }

  setAddressData = () => {
    const editAddress = this.props.editAddress;
    if (editAddress) {
      const addressData = {
        name_address: editAddress.name_address,
        first_name: editAddress.first_name,
        last_name: editAddress.last_name,
        address_1: editAddress.address_1,
        state: editAddress.state,
        city: editAddress.city,
        postcode: editAddress.postcode,
        country: editAddress.country,
        email: editAddress.email,
        phone: editAddress.phone,
        note: editAddress.note,
        selected: editAddress.selected
      }

      this.setDropList(addressData);
      this.setState({
        value: addressData
      });
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
          placeholderTextColor={placeholder}
          value={locals.value}
        />
        {help}
        {error}
      </View>
    );
  };

  renderCountry = (locals) => {
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
        <CountryPicker
          onSelect={(value) => {
            this.setState({ cca2: value.cca2 });
            locals.onChange(value.name);
          }}
          withCountryNameButton
          countryCode={this.state.cca2}
          filterable />
        {help}
        {error}
      </View>
    );
  };

  addAddress = () => {
    let value = this.refs.form.getValue();
    if (value) {
      const valor = {
        name_address: value.name_address,
        first_name: value.first_name,
        last_name: value.last_name,
        address_1: value.address_1,
        state: value.state,
        city: value.city,
        postcode: this.state.value.postcode,
        country: value.country,
        email: value.email,
        phone: value.phone,
        note: value.note,
        user: this.props.user.user.id
      };

      this.props.addAddress(valor);
      this.props.onBack();
    }
  };

  updateAddress = () => {
    let value = this.refs.form.getValue();
    const index = this.props.editAddress.index;
    if (value) {
      const valor = {
        name_address: value.name_address,
        first_name: value.first_name,
        last_name: value.last_name,
        address_1: value.address_1,
        state: value.state,
        city: value.city,
        postcode: this.state.value.postcode,
        country: value.country,
        email: value.email,
        phone: value.phone,
        note: value.note,
        user: this.props.user.user.id,
        selected: this.props.editAddress.selected,
      };

      this.props.updateAddress(valor, index);
      this.props.onBack();
    }
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    const edit = this.props.edit;

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <KeyboardAwareScrollView
          style={styles.form}
          keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <Form
              ref="form"
              type={this.Customer}
              options={this.options}
              value={this.state.value}
              onChange={this.onChange}
            />
            <TouchableOpacity style={styles.btnAdd} onPress={edit ? this.updateAddress : this.addAddress}>
              <Text style={styles.add}>{edit ? Languages.UpdateAddressButton : Languages.AddToAddress}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

AddAddress.defaultProps = {
  countries: [],
};

const mapStateToProps = ({ addresses, countries, user }) => {

  const editAddress = typeof addresses.editAddress === "undefined" ? [] : addresses.editAddress.idAddress;
  return {
    countries: countries.list,
    user: user,
    editAddress: editAddress,
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions, list } = require("@redux/AddressRedux");

  return {
    ...ownProps,
    ...stateProps,
    addAddress: (address) => {
      actions.addAddress(dispatch, address);
    },
    updateAddress: (address, index) => {
      actions.updateAddress(dispatch, address, index);
    },
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(withTheme(AddAddress));
