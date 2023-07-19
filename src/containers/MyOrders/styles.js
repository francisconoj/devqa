/** @format */

import { StyleSheet } from 'react-native';
import { Color } from '@common';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  order: {
    flexDirection: 'column',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },
  orderHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  orderId: {
    flex: 1,
    textAlign: 'left',
    fontFamily: 'MulishBold',
    color: Color.primary,
    fontSize: 16,
  },
  orderDateCreated: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Mulish',
    color: Color.text,
    fontSize: 16,
  },
  orderShippingAddress: {
    flex: 1,
    textAlign: 'left',
    fontFamily: 'Mulish',
    color: Color.text,
    fontSize: 16,
  },
  orderTotal: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Mulish',
    color: Color.text,
    fontSize: 16,
  },
  orderStatus: {
    borderTopColor: '#E3E3E3',
    borderTopWidth: 1,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderStatusText: {
    flex: 1,
    width: '100%',
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'FuturaBold',
    color: Color.neutralDark,
  },
  orderStatusIcon: {
    flex: 0,
    marginRight: 16,
  },
  orderStatusIconColor: {
    backgroundColor: '#1C7C54',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  orderStatusIconText: {
    fontFamily: 'FontAwesome',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 36,
    color: '#ffffff',
  },
});
