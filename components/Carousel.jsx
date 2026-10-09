import {useEffect,useState,useRef} from 'react';

export default function Carousel({slides=[],presentation=false,controls=true,duration=7,transition=0.8,fit='cover'}){
  const [index,setIndex]=useState(0), [reduced,setReduced]=useState(false), [failed,setFailed]=useState([]);
  const start=useRef(null);
  const items=slides.filter(s=>s.image&&!failed.includes(s.image));
  const current=items[index % Math.max(1,items.length)];
  useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)'); const change=()=>setReduced(m.matches); change();m.addEventListener('change',change);return()=>m.removeEventListener('change',change);},[]);
  const advance=delta=>setIndex(i=>(i+delta+items.length)%Math.max(1,items.length));
  useEffect(()=>{if(items.length<2||(!presentation&&reduced))return;const timer=setInterval(()=>setIndex(i=>(i+1)%items.length),Math.max(2,duration)*1000);return()=>clearInterval(timer);},[items.length,reduced,presentation,duration]);
  useEffect(()=>{if(items.length>1){const img=new Image();img.src=items[(index+1)%items.length].image;}},[index,items.map(s=>s.image).join('|')]);
  return <div className={`ns-carousel ${presentation?'ns-screen':''}`} role="region" aria-label="Project slideshow" onTouchStart={e=>{start.current=e.changedTouches[0].clientX;}} onTouchEnd={e=>{if(start.current!==null){const dx=e.changedTouches[0].clientX-start.current;if(Math.abs(dx)>45)advance(dx<0?1:-1);start.current=null;}}}>
    {current ? <img key={current.image} src={current.image} alt={current.alt||''} fetchPriority="high" onError={()=>setFailed(f=>[...f,current.image])} style={{objectFit:fit,objectPosition:current.position||'center',animationDuration:reduced?'0s':`${transition}s`}}/> : <p className="ns-slide-empty">{presentation?'No presentation images available.':'Project imagery coming soon.'}</p>}
    {!presentation && controls && items.length>1 && <div className="ns-carousel-controls"><button onClick={()=>advance(-1)} aria-label="Previous slide">←</button><span aria-live="off">{String(index%items.length+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span><button onClick={()=>advance(1)} aria-label="Next slide">→</button></div>}
  </div>;
}
