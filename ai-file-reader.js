/* JEE AI File Reader — local-first, chunked retrieval for PDFs/text files. */
(function(){
  const DB='jee-ai-file-index-v1', STORE='documents', CHUNK=1800;
  let dbp;
  function db(){ if(dbp) return dbp; dbp=new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}); return dbp; }
  async function put(v){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction(STORE,'readwrite');tx.objectStore(STORE).put(v);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)})}
  async function all(){const d=await db();return new Promise((res,rej)=>{const r=d.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error)})}
  async function remove(id){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(id);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)})}
  async function pdfText(file){
    const mod=await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs');
    const pdf=await (mod.default||mod).getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
    let out=[];
    for(let p=1;p<=pdf.numPages;p++){const page=await pdf.getPage(p);const tc=await page.getTextContent();out.push(`\n[PAGE ${p}]\n`+tc.items.map(x=>x.str||'').join(' '));}
    return out.join('\n');
  }
  function textFile(file){return file.text()}
  function normalize(s){return String(s||'').replace(/\s+/g,' ').trim()}
  function chunks(text){const t=normalize(text);const a=[];for(let i=0;i<t.length;i+=CHUNK)a.push(t.slice(i,i+CHUNK));return a}
  async function indexFile(file){
    const ext=(file.name.split('.').pop()||'').toLowerCase();
    if(!['pdf','txt','md','csv','json'].includes(ext)) throw Error(`${file.name}: supported formats are PDF, TXT, MD, CSV or JSON.`);
    const text=ext==='pdf'?await pdfText(file):await textFile(file); const cs=chunks(text);
    let id=file.name+'-'+file.size+'-'+file.lastModified; try{if(window.crypto?.subtle){id=await crypto.subtle.digest('SHA-256',await file.arrayBuffer()).then(b=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''))}}catch(e){}
    await put({id,name:file.name,size:file.size,type:file.type||ext,updatedAt:new Date().toISOString(),pages:(text.match(/\[PAGE \d+\]/g)||[]).length,chunks:cs});
    return {id,name:file.name,chunks:cs.length,pages:(text.match(/\[PAGE \d+\]/g)||[]).length};
  }
  function score(c,q){const terms=normalize(q).toLowerCase().split(/[^a-z0-9+.-]+/).filter(x=>x.length>2);const s=c.toLowerCase();let n=0;for(const t of terms){let i=0;while((i=s.indexOf(t,i))>=0){n++;i+=t.length}}return n}
  async function search(query,limit=8){const docs=await all();const hits=[];for(const d of docs)for(let i=0;i<d.chunks.length;i++){const sc=score(d.chunks[i],query);if(sc)hits.push({score:sc,name:d.name,chunk:i+1,text:d.chunks[i]})}return hits.sort((a,b)=>b.score-a.score).slice(0,limit)}
  async function list(){return (await all()).map(d=>({id:d.id,name:d.name,size:d.size,chunks:d.chunks.length,pages:d.pages,updatedAt:d.updatedAt}))}
  async function clear(id){if(id) await remove(id);else for(const d of await all()) await remove(d.id)}
  window.JEEAIFileIndex={indexFile,search,list,clear};
})();
