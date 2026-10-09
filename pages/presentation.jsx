import Head from 'next/head';
import Carousel from '../components/Carousel';
import {useContent} from '../components/Public';
export default function Presentation(){const {data,error}=useContent();const settings=data?.presentation;return <><Head><title>N Square Ventures — Presentation</title><meta name="robots" content="noindex, nofollow"/></Head>{settings?.enabled?<Carousel slides={settings.slides} presentation duration={settings.duration} transition={settings.transition} fit={settings.fit}/>:<main className="ns-screen"><p className="ns-slide-empty">{error||(data?'Presentation is currently disabled.':'Loading presentation…')}</p></main>}</>;}
