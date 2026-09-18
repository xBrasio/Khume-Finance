(function(){
  const sb=window.supabase.createClient("https://rlrtleaubhyicvmmjpxh.supabase.co","sb_publishable_jKA6Hp3Zm3x_RRZlpxghwQ_5vIG7bOk");
  const gate=document.getElementById("gate"),app=document.getElementById("app");
  if(!gate||!app)return;
  const card=gate.querySelector(".gate-card");
  card.innerHTML='<div class="eyebrow">Khume Technologies</div><h2>Finance Ledger</h2><p>Enter your authorized company email. We will send a secure sign-in link.</p><input id="authEmail" type="email" placeholder="Work email" autocomplete="email"><div class="error" id="authErr"></div><button class="btn" style="width:100%" id="authSend">Send Sign-In Link</button><button class="btn secondary" style="width:100%;margin-top:8px" id="authSignOut">Sign out</button>';
  const email=document.getElementById("authEmail"),err=document.getElementById("authErr");
  async function check(){
    const r=await sb.auth.getSession();
    if(r.data.session){
      if(sessionStorage.getItem("khume_unlocked")==="1"){gate.style.display="none";app.style.display="grid";}
      else{sessionStorage.setItem("khume_unlocked","1");location.reload();}
    }else{sessionStorage.removeItem("khume_unlocked");gate.style.display="flex";app.style.display="none";}
  }
  document.getElementById("authSend").onclick=async()=>{
    err.textContent="";
    if(!email.value.trim()){err.textContent="Enter your company email.";return}
    const r=await sb.auth.signInWithOtp({email:email.value.trim(),options:{emailRedirectTo:"https://finance.dott-media.org/",shouldCreateUser:false}});
    if(r.error){err.textContent=r.error.message;return}
    err.textContent="Sign-in link sent. Check your email.";
  };
  document.getElementById("authSignOut").onclick=async()=>{await sb.auth.signOut();location.reload()};
  check();
  sb.auth.onAuthStateChange((_event,session)=>{
    if(session){sessionStorage.setItem("khume_unlocked","1");}
    else{sessionStorage.removeItem("khume_unlocked");gate.style.display="flex";app.style.display="none";}
  });
})();