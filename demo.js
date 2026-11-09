
(function(){
  var PAGES = ["/", "/admin", "/admin/announcement", "/admin/approvals", "/admin/complaints", "/admin/complaints/inbox", "/admin/dm/inbox", "/admin/payments", "/admin/rooms", "/admin/settings", "/admin/tenants", "/admin/tenants/10", "/admin/tenants/12", "/admin/tenants/13", "/admin/tenants/16", "/admin/tenants/17", "/admin/tenants/18", "/admin/tenants/19", "/admin/tenants/2", "/admin/tenants/20", "/admin/tenants/21", "/admin/tenants/3", "/admin/tenants/4", "/admin/tenants/5", "/admin/tenants/6", "/admin/tenants/7", "/admin/tenants/8", "/home", "/home/announcement", "/home/calendar", "/home/complaints/inbox", "/home/dm/inbox", "/home/dorm", "/home/location", "/home/marketplace", "/home/marketplace/inbox", "/home/payments", "/home/profile", "/home/rooms", "/home/settings"];
  var FAKE = {ok:true,success:true,status:'ok',demo:true,message:'Demo mode: changes are not saved.',
              messages:[],threads:[],conversations:[],items:[],notifications:[],unread:0,unread_count:0,count:0};
  function toast(msg){
    var t=document.getElementById('demo-toast');
    if(!t){t=document.createElement('div');t.id='demo-toast';
      t.style.cssText='position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#1f2937;color:#fff;padding:12px 20px;border-radius:10px;font:500 14px/1.3 system-ui,sans-serif;z-index:2147483647;box-shadow:0 6px 24px rgba(0,0,0,.3);max-width:90vw;text-align:center;transition:opacity .3s;opacity:0';
      (document.body||document.documentElement).appendChild(t);}
    t.textContent=msg||'Static demo: this action is not available.'; t.style.opacity='1';
    clearTimeout(t._h); t._h=setTimeout(function(){t.style.opacity='0'},2800);
  }
  window.__demoToast=toast;
  var realFetch=window.fetch;
  window.fetch=function(input,init){
    var url=(typeof input==='string')?input:(input&&input.url)||''; var method=((init&&init.method)||(input&&input.method)||'GET').toUpperCase();
    var path=url.replace(location.origin,'').split('?')[0];
    if(method==='GET'){
      if(path==='/home/notifications'||path==='/admin/notifications') return realFetch('/__api'+path+'.json');
      if(PAGES.indexOf(path)>-1) return realFetch(url,init);
      return Promise.resolve(new Response(JSON.stringify(FAKE),{status:200,headers:{'Content-Type':'application/json'}}));
    }
    if(!/read/.test(path)) toast('Demo mode: changes are not saved.');
    return Promise.resolve(new Response(JSON.stringify(FAKE),{status:200,headers:{'Content-Type':'application/json'}}));
  };
  function handleForm(f,ev){
    var a=(f.getAttribute('action')||'').split('?')[0];
    if(ev){ev.preventDefault();ev.stopPropagation();}
    if(/\/login$/.test(a)){var em=(f.querySelector('[name=email]')||{}).value||'';location.href=/admin/i.test(em)?'/admin':'/home';return;}
    if(/\/guest$/.test(a)){location.href='/home';return;}
    if(/\/logout$/.test(a)){location.href='/';return;}
    toast('Demo mode: changes are not saved.');
  }
  document.addEventListener('submit',function(e){handleForm(e.target,e);},true);
  var rs=HTMLFormElement.prototype.submit; HTMLFormElement.prototype.submit=function(){handleForm(this,null);};
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]'); if(!a) return;
    var h=a.getAttribute('href'); if(!h||h[0]==='#'||/^(https?:|mailto:|tel:|javascript:)/.test(h)) return;
    var u=new URL(h,location.href); if(u.origin!==location.origin) return;
    var m=u.pathname==='/admin/tenants'&&u.search.match(/tenant=(\d+)/);
    if(m&&PAGES.indexOf('/admin/tenants/'+m[1])>-1){e.preventDefault();location.href='/admin/tenants/'+m[1];return;}
    var p=u.pathname.replace(/\/$/,'')||'/';
    if(PAGES.indexOf(p)<0 && !/\.(css|js|png|jpg|svg|ico|json)$/.test(p)){e.preventDefault();toast('This page is not included in the static demo.');}
  },true);
  document.addEventListener('DOMContentLoaded',function(){
    var m=location.pathname==='/admin/tenants'&&location.search.match(/tenant=(\d+)/);
    if(m&&PAGES.indexOf('/admin/tenants/'+m[1])>-1) location.replace('/admin/tenants/'+m[1]);
    var b=document.createElement('div');
    b.style.cssText='position:fixed;right:12px;bottom:12px;background:rgba(17,24,39,.85);color:#fff;padding:6px 12px;border-radius:999px;font:600 11px system-ui,sans-serif;z-index:2147483000;pointer-events:none;letter-spacing:.3px';
    b.textContent='STATIC DEMO \u2022 sample data'; document.body.appendChild(b);
    if(location.pathname==='/'){
      var c=document.createElement('div');
      c.style.cssText='position:fixed;right:12px;top:12px;background:#fff;color:#111;padding:12px 14px;border-radius:12px;font:500 13px system-ui,sans-serif;z-index:2147483001;box-shadow:0 8px 30px rgba(0,0,0,.25);max-width:230px';
      c.innerHTML='<div style="font-weight:700;margin-bottom:8px">Static demo</div><div style="margin-bottom:10px;color:#555">Pick a view to explore the site:</div>'+
        '<a href="/home" style="display:block;text-align:center;background:#2563eb;color:#fff;padding:8px;border-radius:8px;text-decoration:none;margin-bottom:6px">View as Tenant</a>'+
        '<a href="/admin" style="display:block;text-align:center;background:#111827;color:#fff;padding:8px;border-radius:8px;text-decoration:none">View as Admin</a>';
      document.body.appendChild(c);
    }
  });
})();
