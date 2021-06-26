//Define Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
//Define voice recognition
recognition.lang = 'en-US';
recognition.interimResults = false;
const lang = 'en-GB'
const voiceIndex = 2
var msg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
//Bring DOM elements
var holder = document.getElementById("text-writer");
var talker = document.getElementById("title-talker");
var responser = document.getElementById("response-container")
var wiki = document.getElementById("response-wiki")
//Declare window
var windows = []
//youtube API settings
var key = 'AIzaSyDX6X56zj4m0USxZTS11pPlTXzvY6V90JA';
const maxResults = 5;
//define the tabs opened by bruno
//This function converts 24h time to 12h time
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
//This function sorts worldwide time
const getTime = async(continent, location)=>{
    var data = axios.get(`http://worldtimeapi.org/api/timezone/${continent}/${location}`)
    return data
}
//This function gets Info from our wiki API
const getWikiInfo = (key)=>{
    axios.get(`http://localhost:3000/wiki/info?key=${key}`, {
        key : 'Carl Sagan'
      })
    .then((response) => {
        console.log(response);
    }, (error) => {
        console.log(error);
        speak(`I don't know what is it`)
    });
}
//This function gets a summary from our wiki API
const getWikiSummary = async(key)=>{
    const request = await axios.get(`/wiki/summary?key=${key}`)
    return request
}
const getWikiImage = async(key)=>{
    const request = await axios.get(`/wiki/image?key=${key}`)
    return request
}
//This function filter and cut the text defined to the left or the right side.
function cutToTarget(text, filter, up_down){
    target = text.indexOf(filter);                                             
    if(up_down){                                                             
        p1 = text.slice(0,target)                                           
    }                                                                     
    else{                                                                   
        p1 = text.slice(target)                                             
    }
    p2 = p1.replace(filter, '')
    return p2                                                          
}
function truncateString(string, limit) {
    if (string.length > limit) {
      return string.substring(0, limit) + "..."
    } else {
      return string
    }
  }
//This function cuts the info until there is a . in the text
function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }
//this function only god knows how it works, cause I programmed it at 3:00 am in the morning.
function cutToNumber(text){
    var shortText = truncateString(text, 180);
    target = shortText.indexOf('.' || ',');                                             
    var dot = getPosition(shortText, '.' , 2)
    if(target > 180){
        var dot = getPosition(shortText, '.' , 2)
        p1 = shortText.slice(0, dot)
    }
    else{
        var dot = getPosition(shortText, '.' , 1)
        p1 = shortText.slice(0, dot)
    }
    return p1
}
//This function makes the GET petition to Google's API
function playYoutubeVideo(search_key){
    const api_uri = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${search_key}&key=${key}`; 
    axios.get(api_uri).then((response)=>{
        console.log(response)
        let id = response.data.items[0].id.videoId
        let type  = response.data.items[0].id.kind
        let channel = response.data.items[0].snippet.channelId
        if(type == "youtube#channel"){
            speak(`${response.data.items[0].snippet.channelTitle} is a youtube channel. Enjoy it!`)
            let currentWindow = window.open(`https://www.youtube.com/channel/${channel}`)
            windows.push(currentWindow)
        }
        else{
            let currentWindow = window.open(`https://www.youtube.com/watch?v=${id}`)
            windows.push(currentWindow)
        }
    })
    .catch((err)=>{
        console.log('[getVideoID] ' + err)
    })
}
//This Async function begin the taking process
const speak = async (text) => {
    var talker = document.getElementById("title-talker");
    if (!speechSynthesis) {
      return
    }
    const message = new SpeechSynthesisUtterance(text)
    message.voice = await chooseVoice()
    message.addEventListener('start', ()=>{
        talker.classList.add("title-animated")
    })
    message.addEventListener('end', function () {
        talker.classList.remove("title-animated")
        talker.classList.add(".title-unanimated")
    })
    speechSynthesis.speak(message)
}
//This Async function get the voices from the google API
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
//This Async function chooses the voice that we need to use and also the Lang
const chooseVoice = async () => {
    const voices = (await getVoices()).filter((voice) => voice.lang == lang)

    return new Promise((resolve) => {
        resolve(voices[voiceIndex])
    })
}
/* This function is where our data is sent when 'BRUNO' key is understand 
by the voice recognition program. It executes the commands that we send to BRUNO*/
const speechCommand = (input)=>{
    if (input.includes('play ')||input.includes('reproduce ')){
        input = input.replace('play', '')
        var speech_text = 'Alright I will play '+ input;
        speak(speech_text)
        playYoutubeVideo(String(input))
    }
    else if(input.includes('stop playing')||input.includes('stop it')){
        speak('Alright')
        let current_window = windows[windows.length-1]
        current_window.close()
    }
    else if(input.includes('shut up')){
        var speech_text = 'Alright';
        responser.innerHTML = `<p class="response-text">${speech_text}</p>`
        speak(speech_text)
    }
    else if (input.includes('time is it') || input.includes("what's the time")){
        var date = formatAMPM(new Date)
        responser.innerHTML = `<p class ="response-text">${date}</p>`
        speak(`time is ${date}`).then(()=>{talker.classList.remove("title-animated")})
    }
    else if (input.includes('what is time in')||input.includes('time in')||input.includes(`what's the time in`)){
        var complete_sentence = cutToTarget(input,'in',false).replace(/\s+/, "") 
        var city = cutToTarget(complete_sentence, ' ', false).replace(/\s/g, "").toLowerCase()
        var continent = cutToTarget(complete_sentence,' ', true).replace(/\s/g, "").toLowerCase()
        console.log(location)
        console.log(continent)
        time = getTime(continent, city).then((val)=>{
            var speech_text = `time in ${city} is ${val.data.datetime}`;
            responser.innerHTML = `<p class="response-text">${speech_text}</p>`
            speak(speech_text)
            console.log(`time in ${city} is ${val.data.datetime}`)
        })
    }
    else if(input.includes('who is') || input.includes('who the heck is')||input.includes('what is')||input.includes(`who's`)){
        input = input.replace('who the heck is', '')
        input = input.replace('who is', '') 
        input = input.replace('what is a', '')
        wiki.innerHTML = '' 
        console.log(input)
        getWikiSummary(input).then(val => {
            let text = val.data.Data
            text = cutToNumber(text);
            wiki.insertAdjacentHTML("afterbegin",`<p class="wiki-text">${text}</p>`)
            console.log(text)
            speak(text)
        }).catch((err)=>{
            console.log(err)
            speak('No data found')
        })
        getWikiImage(input).then(val =>{
            let url = val.data.Data
            console.log(url);
            wiki.insertAdjacentHTML('afterbegin',`<img src = "${url}" class="wiki-image"/>`)
        }).catch((err)=>speak('No Images found'))
    }
    else if(input.includes('what can you do')){speak('I can tell you the time. Set a reminder. Open webpages. Search for content and play videos in youtube')}
    else if(input.includes('who are you')){speak('I am a Command Voice Interface  ... or a CVI. I was Built by Mr Juan José Londoño to help people with visual problems and also the serve as a personal assistant')}
    else if(input.includes('open') || input.includes('open')&& input.includes('.com')){
        input = input.replace('open', '')
        input = input.replace('.com', '')
        input = input.toLowerCase()
        console.log(input)
        console.log(input.length)
        if(input.trim() == 'youtube'){
            speak('opening web page')
            window.open('https://www.youtube.com/')
        }
        else if (input.trim() == 'disney' || input.trim() == 'disney plus'){
            speak('opening Disney Plus')
            window.open('https://www.disneyplus.com/home')
        }
        else if (input.trim() == 'netflix' || input.trim() == 'netflix.com'){
            speak('opening netflix')
            window.open('https://www.netflix.com/browse')
        }
        else{
            speak('Page not found')
        }
    }
    else if(input.includes('tell me a joke')){speak('  Why you should never fight a Dinosaur?');speak(`because you'll get jurasskicked`); speak(`hahaha`)}
    else if(input.includes('sleep')){
        window.close()
    }
    else{
        speak('Sorry I did not understand')
    }
    
}
document.getElementsByClassName('listen-button')[0].addEventListener('click', () => {
});
//Begin the recognition
recognition.start();
//Event listener to know if someone is talking to bruno
recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let output = e.results[last][0].transcript;
    let confidence = e.results[0][0].confidence
    console.log('Confidence: ' + confidence);
    console.log(output)
    msg.text = output
    if (output.includes('Bruno')){      //Defines the voice key to make bruno process the Info
        output = output.replace('Bruno', '')
        holder.innerHTML = output
        speechCommand(output.toLocaleLowerCase())
    }
    // We will use the Socket.IO here later…
});
//Restart voice recogntion to be always listening 
recognition.onend = function() {
    recognition.start()
}