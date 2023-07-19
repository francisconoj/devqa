/** @format */

import { StyleSheet, Dimensions } from 'react-native';
import { Color } from '@common';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    width: width,
    marginTop: 16,
    paddingTop: 16,
    borderTopColor: '#E3E3E3',
    borderTopWidth: 1,
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: 1,
  },
  titleText: {
    fontFamily: 'Mulish',
    fontSize: 14,
    color: '#767676',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  paymentMethods: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
  },
  paymentMethod: {
    marginRight: 16,
    flex: 1,
    height: 36,
    borderRadius: 18,
    paddingLeft: 12,
    paddingRight: 16,
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  paymentMethodTitle: {
    flex: 1,
    lineHeight: 14,
    fontSize: 12,
    fontFamily: 'Futura',
    color: Color.neutralDark,
  },
  paymentMethodIcon: {
    width: 20,
    marginRight: 6,
    fontSize: 20,
    fontFamily: 'FontAwesome',
    color: Color.neutralLight,
  },
  paymentMethodIconSelected: {
    color: '#18EDBF',
  },
  paymentMethodDescription: {
    fontFamily: 'Mulish',
    fontSize: 14,
    color: Color.neutralDark,
    marginHorizontal: 16,
    marginBottom: 16,
  },
});
