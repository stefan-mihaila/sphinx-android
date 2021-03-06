import React, {useState, useEffect} from 'react'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '../../store'
import {View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Image} from 'react-native'
import { useNavigation, DrawerActions } from '@react-navigation/native'
import { Appbar, Dialog, Button, Portal, ActivityIndicator } from 'react-native-paper'
import { Card, Title } from 'react-native-paper'
import Icon from 'react-native-vector-icons/AntDesign'
import {me} from '../form/schemas'
import Form from '../form'
import Cam from '../utils/cam'
import ImgSrcDialog from '../utils/imgSrcDialog'
import {createContactPic, usePicSrc} from '../utils/picSrc'

// no contact_id!
// http://x.x.x.x/static/uploads/undefined_profile_picture.jpeg

export default function Profile() {
  const { details, user, contacts } = useStores()
  const [uploading, setUploading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [takingPhoto, setTakingPhoto] = useState(false)

  async function tookPic(img){
    setDialogOpen(false)
    setTakingPhoto(false)
    console.log("TOOK PIC")
    setUploading(true)
    try {
      await createContactPic(1, img.uri)
      contacts.updatePhotoURI(1, img.uri)
      // await contacts.uploadProfilePic(img, {
      //   contact_id:1,
      // })
    }catch(e){
      console.log(e)
    }
    setUploading(false)
  }

  const meContact = contacts.contacts.find(c=> c.id===1)
  const imgURI = usePicSrc(meContact)

  return useObserver(() =>
    <View style={styles.wrap}>
      <Header />
      <View style={styles.userInfoSection}>
        <View >
          <TouchableOpacity onPress={()=>setDialogOpen(true)}
            style={styles.userPic}>
            <Image resizeMode="cover" 
              source={imgURI?{uri:'file://'+imgURI}:require('../../../assets/avatar.png')}
              style={{width:60,height:60,borderRadius:30}}
            />
            {uploading && <ActivityIndicator animating={true} color="#55D1A9" style={styles.spinner} />}
          </TouchableOpacity>
        </View>
        <View style={styles.userInfo}>
          <Title style={styles.title}>{user.alias}</Title>  
          <View style={styles.userBalance}>
            <Text>{details.balance}</Text>
            <Text style={{marginLeft:10,marginRight:10,color:'#c0c0c0'}}>sat</Text>
            <Icon name="wallet" color="#d0d0d0" size={20} />
          </View>
        </View>
      </View>
      <Card>
        <Card.Content style={{height:250}}>
          <Form schema={me}
            displayOnly
            initialValues={{
              alias: user.alias,
              public_key: user.publicKey
            }}
          />
        </Card.Content>
      </Card>

      <ImgSrcDialog 
        open={dialogOpen} onClose={()=>setDialogOpen(false)}
        onPick={res=> tookPic(res)}
        onChooseCam={()=> setTakingPhoto(true)}
      />

      {takingPhoto && <Portal>
        <Cam onCancel={()=>setTakingPhoto(false)} 
          onSnap={pic=> tookPic(pic)}
        />
      </Portal>}

    </View>
  )
}

function Header() {
  const navigation = useNavigation()
  return (
    <Appbar.Header style={{width:'100%',backgroundColor:'white'}}>
      <Appbar.Action icon="menu" onPress={()=>navigation.dispatch(DrawerActions.openDrawer())} />
      <Appbar.Content title="Profile" />
    </Appbar.Header>
  )
}

const styles = StyleSheet.create({
  wrap:{
    flex:1,
  },
  content:{
    flex:1,
    width:'100%',
    marginTop:10,
    alignItems:'center',
  },
  userInfoSection: {
    paddingLeft: 20,
    marginBottom:25,
    marginTop:25,
    flexDirection:'row'
  },
  drawerSection: {
    marginTop: 25,
  },
  userPic:{
    flexDirection:'row',
    alignItems:'center',
    minHeight:62,minWidth:62,
    height:62,width:62,
    flexShrink:0,
    borderColor:'#ddd',
    borderWidth:1,
    borderRadius:31,
    position:'relative'
  },
  userInfo:{
    display:'flex',
    flexDirection:'column',
    alignItems:'flex-start',
    justifyContent:'flex-start',
    marginLeft:15
  },
  title: {
    fontWeight: 'bold',
    flexDirection:'row',
    alignItems:'center',
  },
  userBalance:{
    flexDirection:'row',
    alignItems:'center',
  },
  img:{
    height:50,
    width:50,
    borderRadius:25,
  },
  spinner:{
    position:'absolute',
    left:19,
    top:19
  }
})
