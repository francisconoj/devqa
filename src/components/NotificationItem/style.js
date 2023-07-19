import { StyleSheet, Platform } from 'react-native'
import { Color } from '@common'
import { color } from 'react-native-reanimated'

export default StyleSheet.create({
  container: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: Color.neutralDark,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1
        },
      },
      android: {
        elevation: 2
      }
    }),
   
    padding: 10,
  },
  content1: {
    //flex: 0.5,
    borderRadius: 5,
    backgroundColor: Color.primary,    
    flexDirection: 'row'
  },
  content: {
   // flex: 0.5,
  // flexDirection: 'row',
   alignItems:"center", 
   justifyContent: "center",
  },
  name: {
    fontWeight: 'bold',
    fontSize: 13,
    flexDirection: 'row',
    fontFamily: 'Mulish'
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#ffffff',
    fontFamily: 'Mulish',
    flex: 1,
    flexDirection:'row'
  },
  text2: {
    fontSize: 13,
    color: Color.primary,
    fontFamily: 'Mulish',
  //  flexDirection: 'row',
   
  },
  buttons: {
    justifyContent: 'space-between'
  },
  icon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    margin: 10
  },
  iconEdit: {
    margin: 10
  }
})
