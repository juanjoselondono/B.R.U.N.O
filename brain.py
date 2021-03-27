import speech_recognition as sr
import pyttsx3
import sys 
import pywhatkit
import datetime
import wikipedia
listener = sr.Recognizer()
engine = pyttsx3.init()
voices = engine.getProperty('voices')
#stephen hawking voice is 11
def talk(text):    
    engine.setProperty('voice', voices[7].id)
    engine.say(text)
    engine.runAndWait()
def listen():
    with sr.Microphone() as source:
        print('Listening ...')
        voice = listener.listen(source)
        command = listener.recognize_google(voice)
        command = command.lower()
        return command

def run_command():
    command = listen()
    print(command)
    song = command.replace('play', '')
    thing = command.replace('search', '')
    if 'play' in command:
        talk('Alright ... I will play ' + song)
        pywhatkit.playonyt(song)
    elif 'time' in command:
        time = datetime.datetime.now().strftime('%I:%M %p')
        print()
        talk('Current time is ' + time)
        print(time)
    elif 'who the heck is' in command:
        person = command.replace('who the heck is', '')
        info = wikipedia.summary(person, 1)
        talk(info)
    elif 'search for':
        thing = command.replace('search for', '')
        info = wikipedia.summary(thing, 2)
        talk(info)
    elif 'send message' in command:
        try:
            with sr.Microphone() as source:
                talk('At what time do you want the message to be sent?')
                print('Listening ...')
                voice = listener.listen(source)
                command = listener.recognize_google(voice)
                command = command.lower()
                print(int(command))
                pywhatkit.sendwhatmsg("+573054293966","This is a message",24,00)
        except:
            talk('There was an error sending the message')
    else:
        talk("I didn't understand, please try again")

 
run_command()

#make a