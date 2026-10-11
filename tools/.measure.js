const r=require('./lib/render');const P=require('./lib/logo-paths.json');
(async()=>{const html=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141.73 141.73" width="800" height="800">${P.map((p,i)=>`<path id="p${i}" d="${p.d}"/>`).join('')}</svg>`;
const {page,cleanup}=await r.openPage({html,width:800,height:800});
const res=await page.evaluate(()=>{const o=[];document.querySelectorAll('path').forEach(p=>{const b=p.getBBox();o.push([+b.x.toFixed(3),+b.y.toFixed(3),+(b.x+b.width).toFixed(3),+(b.y+b.height).toFixed(3)])});const b=document.querySelector('svg').getBBox();o.push(['ALL',b.x,b.y,b.x+b.width,b.y+b.height]);return o});
console.log(res.map(x=>JSON.stringify(x)).join('\n'));await cleanup();await r.close();})();
