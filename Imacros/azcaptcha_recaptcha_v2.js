//AZcaptcha API key
var captcha_key='xxxxxxxxxxxxxxxxxxxxxxx';
//website submit button
var submit_button="TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:recaptcha-demo-form ATTR=ID:recaptcha-demo-submit";

var macro = "CODE:";
macro += "SET !EXTRACT_TEST_POPUP NO" + "\n";
macro += "SET !ERRORIGNORE YES" + "\n";
macro += "SET !TIMEOUT_PAGE 1" + "\n";
macro += "'SET !TIMEOUT_STEP 1" + "\n";
macro += "URL GOTO=javascript:((function(){var%20a=window.content.document.getElementsByTagName('iframe');%20%20var%20k='';%20%20for(var%20x=0;x<a.length;x++)%20%20{%20%20%20if(a[x].src.includes('https://www.google.com/recaptcha/api2/anchor?k'))%20%20%20{%20%20%20%20k=a[x].src.split('?k=')[1].split('&')[0];%20%20%20%20a[x].setAttribute(\"name\",\"I0_myownid\");%20%20%20%20window.content.document.getElementById('g-recaptcha-response').style.display='';%20%20%20%20break;%20%20%20}%20%20}%20%20window.content.document.getElementById('g-recaptcha-response').textContent=k;}))();" + "\n";
macro += "SET !TIMEOUT_PAGE 60" + "\n";
macro += "TAG POS=1 TYPE=TEXTAREA FORM=ID:* ATTR=ID:g-recaptcha-response EXTRACT=TXT" + "\n";
macro += "SET k {{!EXTRACT}}" + "\n";
macro += "SET !EXTRACT NULL" + "\n";
macro += "TAB OPEN" + "\n";
macro += "TAB T=2" + "\n";
macro += "URL GOTO=http://azcaptcha.com/in.php?key={{captcha_key}}&method=userrecaptcha&googlekey={{k}}&pageurl={{!URLCURRENT}}&soft_id=1607" + "\n";
macro += "WAIT SECONDS=1" + "\n";
macro += "TAG POS=1 TYPE=* ATTR=TXT:* EXTRACT=TXT" + "\n";
macro += "SET captid EVAL(\"var s=\\\"{{!EXTRACT}}\\\"; s.split(' ')[0].split('|')[1]\")" + "\n";
macro += "SET !EXTRACT NULL" + "\n";
macro += "URL GOTO= http://azcaptcha.com/res.php?key={{captcha_key}}&action=get&id={{captid}}" + "\n";

var macro2 = "CODE:";
macro2 += "TAG POS=1 TYPE=* ATTR=TXT:* EXTRACT=TXT" + "\n";
macro2 += "SET answer EVAL(\"var s=\\\"{{!EXTRACT}}\\\"; s.split(' ')[0]\")" + "\n";
macro2 += "SET !EXTRACT {{answer}}" + "\n";

var macro3 = "CODE:";
macro3 += "TAG POS=1 TYPE=* ATTR=TXT:* EXTRACT=TXT" + "\n";
macro3 += "SET answer EVAL(\"var s=\\\"{{!EXTRACT}}\\\"; s.split(' ')[0].split('|')[1]\")" + "\n";
macro3 += "SET !EXTRACT {{answer}}" + "\n";
macro3 += "TAB CLOSE" + "\n";
macro3 += "WAIT SECONDS=0.3" + "\n";
macro3 += "TAG POS=1 TYPE=TEXTAREA FORM=ID:* ATTR=ID:g-recaptcha-response CONTENT={{answer}}" + "\n";
macro3 += submit_button + "\n";

iimSet("captcha_key",captcha_key);
iimPlay(macro);
iimPlay(macro2);
var answer=iimGetLastExtract();

while(answer=="CAPCHA_NOT_READY")
{
	iimPlay(macro2);
	var answer=iimGetLastExtract();
	iimPlay("CODE:WAIT SECONDS=5");
	iimPlay("CODE:REFRESH");
}
iimPlay(macro3);
