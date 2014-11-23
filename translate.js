var translateMap = {
  "en-US": "en",
  "zh-CN": "zh"
}

var recognition = new webkitSpeechRecognition();
var started = false;
function beginTranslate(sourceLang, destLang) {
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = sourceLang;
  var final_transcript = '';

  recognition.onstart = function() {
    console.log("Recognition onStart");
    final_transcript = '';
  };

  recognition.onerror = function(event) {
    console.error("recognition error:");
    console.error(event);
    return;

    if (event.error == 'no-speech') {
      start_img.src = 'mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    console.log("recognition stopped");
    beginTranslate(sourceLang, destLang);
  };

  recognition.onresult = function(event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        translated = event.results[i][0].transcript;
      }
    }
    console.log("repsonse: ", translated);
    var url = "https://www.googleapis.com/language/translate/v2?key=AIzaSyBPPtGtiBSGYWPUFcBHXg-7afORDsgE7F4&q=" + encodeURIComponent(translated) + "&source=" + translateMap[sourceLang] + "&target=" + translateMap[destLang];
    $.get(url, function( data ) {
      console.log(data);
      var translated = data.data.translations[0].translatedText;
      var msg = new SpeechSynthesisUtterance(translated);
      msg.lang = destLang;
      speechSynthesis.speak(msg);
    });
  };

    recognition.start();
    window.setTimeout(function() { recognition.stop(); }, 2000);
}
