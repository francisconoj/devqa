/** @format */

import { StyleSheet,Dimensions } from 'react-native';
import { Color } from '@common';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    width: width-25,
    marginTop: 16,
    paddingLeft:8,
    paddingTop: 16,
    borderTopColor: '#E3E3E3',
    borderTopWidth: 1,
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: 1,
  },
  propertyContainer: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 0,
  },
  propertyName: {
    flex: 1,
    textAlign: 'left',
    fontFamily: 'Mulish',
    fontSize: 14,
    color: Color.neutralDark,
  },
  propertyValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'MulishBold',
    fontSize: 16,
    color: Color.neutralDark,
  },
  totalContainer: {
    paddingTop: 13,
    marginTop: 13,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
});
