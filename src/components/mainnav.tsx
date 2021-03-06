import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import DashNav from './dash/dashnav'
import ContactsNav from './contacts/contactsNav'
import Profile from './profile/profile'
import DrawerContent from './menu/drawer'
import {useStores} from '../store'
import Modals from './modals'
import {setTint} from './utils/statusBar'

const Drawer = createDrawerNavigator()

export default function MainNav() {
  const {details} = useStores()
  function dash(){
    setTint('dark')
    details.getBalance()
  }
  function profile(){
    setTint('light')
    details.getBalance()
  }
  function contacts(){
    setTint('light')
  }
  return (<>
    <Drawer.Navigator initialRouteName="Dashboard" 
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Dashboard" component={DashNav} 
        listeners={{focus:dash}} 
      />
      <Drawer.Screen name="Contacts" component={ContactsNav} 
        listeners={{focus:contacts}} 
      />
      <Drawer.Screen name="Profile" component={Profile} 
        listeners={{focus:profile}} 
      />
    </Drawer.Navigator>

    <Modals />
  </>)
}
