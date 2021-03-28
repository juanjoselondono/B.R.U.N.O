const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
var msg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
var holder = document.getElementById('text-writer');


const lang = 'en-GB'
const voiceIndex = 2

const speak = async (text) => {
    if (!speechSynthesis) {
      return
    }
    const message = new SpeechSynthesisUtterance(text)
    message.voice = await chooseVoice()
    speechSynthesis.speak(message)
}

const getVoices = () => {
    return new Promise((resolve) => {
        let voices = speechSynthesis.getVoices()
        if (voices.length) {
        resolve(voices)
        return
        }
        speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices()
        resolve(voices)
        }
    })
}

const chooseVoice = async () => {
    const voices = (await getVoices()).filter((voice) => voice.lang == lang)

    return new Promise((resolve) => {
        resolve(voices[voiceIndex])
    })
}
const speechCommand = (input)=>{
    if (input.includes('play ')){
        input = input.replace('play', '')
        speak('Alright I will play '+ input)
    }
}
document.getElementsByClassName('listen-button')[0].addEventListener('click', () => {
    recognition.start();
});
recognition.start();

recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let output = e.results[last][0].transcript;
    console.log('Confidence: ' + e.results[0][0].confidence);
    console.log('text:  ' + output)
    msg.text = output
    if (output.includes('Bruno')){
        output = output.replace('Bruno', '')
        holder.innerHTML = output
        speechCommand(output)
    }
    //window.open("https://www.youtube.com/watch?v=lw2d7JvPz_U");
    // We will use the Socket.IO here later…
});
recognition.onend = ()=>{
    recognition.start()
}
