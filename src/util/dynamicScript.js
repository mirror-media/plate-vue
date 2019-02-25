export const gtm_mirrormedia = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NCH86SP');`

export const gtm_likr = `window.AviviD = window.AviviD || {settings:{},status:{}};
AviviD.web_id = 'mirrormedia';
AviviD.category_id = window.avivid_category_id || '20180905000003';
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl+'&timestamp='+new Date().getTime();f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TV7N2SW');`

export const fb_sdk = `window.fbAsyncInit = function() {
  FB.init({
  appId            : '175313259598308',
  autoLogAppEvents : true,
  xfbml            : true,
  version          : 'v2.9'
  });
  FB.AppEvents.logPageView();
};
(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/zh_TW/sdk.js";
  js.async=true;
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));`

export const scorecardresearch = `var _comscore = _comscore || [];
_comscore.push({ c1: "2", c2: "24318560" });
(function() {
var s = document.createElement("script"), el =
document.getElementsByTagName("script")[0]; s.async = true;
s.src = (document.location.protocol == "https:" ? "https://sb"
: "http://b") + ".scorecardresearch.com/beacon.js";
el.parentNode.insertBefore(s, el);
})();`

export const alexa = `_atrk_opts = { atrk_acct:"JEZvr1zDGU20kU", domain:"mirrormedia.mg",dynamic: true};
(function() { var as = document.createElement('script'); as.type = 'text/javascript'; as.async = true; as.src = "https://certify-js.alexametrics.com/atrk.js"; var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(as, s); })();`