import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import Carousel from './Carousel';
import {useContent,ContactCTA} from './Public';
export default function HomeContent(){
 const {data,error}=useContent();const [mounts,setMounts]=useState({});
 useEffect(()=>setMounts({hero:document.getElementById('homeCarousel'),intro:document.getElementById('homeIntroduction'),cta:document.getElementById('homeContact')}),[]);
 return <>{mounts.hero&&createPortal(data?<Carousel slides={data.home.slides}/>:<p role="status">{error||'Loading images…'}</p>,mounts.hero)}{mounts.intro&&data&&createPortal(data.home.introduction,mounts.intro)}{mounts.cta&&createPortal(<ContactCTA/>,mounts.cta)}</>;
}
