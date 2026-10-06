const mode=document.getElementById('mode');
mode.addEventListener('change',()=>{const group=mode.value==='Grupal';document.getElementById('groupFields').hidden=!group;for(const id of ['groupName','members']){const e=document.getElementById(id);e.disabled=!group;e.required=group;}});
const snow=document.getElementById('snow');
for(let i=0;i<32;i++){const flake=document.createElement('span');flake.className='flake';flake.textContent=i%4===0?'❄':'·';flake.style.left=((i*31)%100)+'%';flake.style.fontSize=(i%4===0?12+i%8:16+i%10)+'px';flake.style.animationDuration=(14+i%13)+'s';flake.style.animationDelay=(-i*1.7)+'s';snow.append(flake);}
const form=document.getElementById('registrationForm');
const status=document.getElementById('formStatus');
const sendButton=form.querySelector('button[type="submit"]');
let sending=false;
form.addEventListener('submit',async event=>{
 event.preventDefault();
 if(sending||!form.reportValidity())return;
 if(!/^https?:$/.test(location.protocol)){
  status.textContent='Para enviar tu inscripción, abre el enlace publicado del concurso. El archivo descargado solo permite revisar la página.';
  status.dataset.state='error';return;
 }
 sending=true;sendButton.disabled=true;sendButton.textContent='Enviando inscripción…';
 status.textContent='Estamos enviando tu ficha. Espera la confirmación antes de cerrar esta página.';
 status.dataset.state='pending';
 const data=Object.fromEntries(new FormData(form));
 data._url=location.origin+location.pathname;
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),25000);
 try{
  const response=await fetch('https://formsubmit.co/ajax/diego.aguirre@interstaff.com.gt',{
   method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
   body:JSON.stringify(data),signal:controller.signal
  });
  const result=await response.json();
  if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('service_rejected');
  const activation=/activat|confirm.*email/i.test(String(result.message||''));
  status.textContent=activation
   ?'El servicio recibió la ficha, pero el correo de la organización está pendiente de activación. Comunícate con diego.aguirre@interstaff.com.gt para confirmar tu inscripción.'
   :'Tu ficha fue aceptada por el servicio de envío. La organización confirmará la recepción y los siguientes pasos por los datos de contacto que proporcionaste.';
  status.dataset.state=activation?'pending':'success';
  sendButton.textContent='Ficha enviada';
 }catch(error){
  status.textContent='No pudimos confirmar el envío. Tus datos siguen en el formulario. Antes de reenviarlo, consulta a diego.aguirre@interstaff.com.gt para evitar duplicados.';
  status.dataset.state='error';sendButton.disabled=false;sendButton.textContent='Reintentar envío';sending=false;
 }finally{clearTimeout(timeout);}
});
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'mostrar_bases_concurso',title:'Mostrar bases del concurso',description:'Abre las bases propuestas en la página para su lectura. No envía datos ni inscripciones.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||Object.keys(input).length)throw new Error('No se admiten parámetros.');document.querySelectorAll('#ruleList details').forEach(d=>d.open=true);document.getElementById('bases').scrollIntoView();return{estado:'bases_visibles',version:'Propuesta 1',inscripcion_enviada:false};}})).catch(()=>{});}catch{}}
