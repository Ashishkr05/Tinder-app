import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function Button({ title, onPress, variant='primary' }:{title:string; onPress:()=>void; variant?:'primary'|'ghost'}) {
  return (
    <Pressable onPress={onPress} style={[styles.btn, variant==='ghost' && styles.ghost]}>
      <Text style={[styles.txt, variant==='ghost' && styles.ghostTxt]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor:'#0ea5e9', paddingVertical:12, paddingHorizontal:16, borderRadius:12, alignItems:'center' },
  ghost: { backgroundColor:'transparent', borderWidth:1, borderColor:'#0ea5e9' },
  txt: { color:'#fff', fontWeight:'600' },
  ghostTxt: { color:'#0ea5e9' }
});
