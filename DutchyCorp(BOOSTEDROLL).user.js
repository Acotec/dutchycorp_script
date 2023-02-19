$('#claim_boosted').show();
let a=Array.from(document.getElementsByTagName("form")).pop()
let script = Array.from(a.querySelectorAll('script')).pop()
let value = script.innerText.match(/btn\.value.+=.+;/)[0].replace(/\s|btn\.value.+=|[";]/ig,'').trim()
let btn = document.querySelector('#claim_boosted');
btn.value=value;
$('.progress').hide();
$('#sec').hide();
