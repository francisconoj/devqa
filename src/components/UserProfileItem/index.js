/** @format */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, I18nManager } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import _ from "lodash";
import { withTheme, Config } from "@common";

import styles from "./styles";
import { TextInput } from "react-native-gesture-handler";

@withTheme
export default class UserProfileItem extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
        value: this.props.value,
    }
  }
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    icon: PropTypes.any,
    editmode: PropTypes.bool,
    field: PropTypes.string,
  };

  static defaultProps = {
    icon: false,
  };
  
  
  _handlerChange = (val,type) => {
    this.setState({
      value: val
    })
    //this.props.Editvalue = val;
     //this.props.submitEdit.bind(val,type);
  }

  render() {
    const { label, value, onPress, icon, editmode, field, _handlerSubmitEdit,error,errorMsg } = this.props;
    const {
      theme: {
        colors: { lineColor, text },
        dark,
      },
    } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.row, dark && { borderColor: lineColor }]}>
        <Text style={styles.leftText}>{label}</Text>
        <View style={styles.rightContainer}>
          
        {(() => {
          if (!editmode) {
            return <Text style={styles.rightText(text)}>{value}</Text>;
          }
          else { 
            return <View style={styles.editformMain}>
              <View style={styles.editform}>
              <TextInput 
                        style={error ? styles.formInputError: styles.formInputContainer}
                        editable={true}
                        value={this.state.value} 
                        onChangeText=//{(val) => this._handlerChange(val,type)}
                        {(val) => {
                          _handlerSubmitEdit(val,field);
                          this.setState({ value: val });
                        }}
                    />
                    </View>
                    <View style={styles.row}>
                      <Text accessibilityLiveRegion="polite" style={styles.formLabelError}>
                        {errorMsg}
                      </Text>
                      </View>
                  </View>
          }
        })()}
        
     
          {icon && _.isBoolean(icon) && (
            <Icon
              style={[
                styles.icon,
                I18nManager.isRTL && {
                  transform: [{ rotate: "180deg" }],
                },
              ]}
              color="#CCCCCC"
              size={22}
              name="chevron-small-right"
            />
          )}
          {icon && !_.isBoolean(icon) && icon()}
        </View>
      </TouchableOpacity>
    );
  }
}

