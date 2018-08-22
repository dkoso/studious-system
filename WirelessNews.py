#!/usr/bin/env python
import requests
import json
import time
import serial
from unidecode import unidecode

### Access news headlines from a web api and send via serial port to a microcontroller with 2.4Ghz radio ###

### Select URL from web api, NBC news is always at the top of list :) ###
i = 0
counter = 0

def selectURL():
	global i, counter
	counter += 1
	if i > 6:
		i = 0
	urlLst = [['https://newsapi.org/v2/top-headlines?sources=nbc-news&apiKey=##########'],
			  ['https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=##########'],
			  ['https://newsapi.org/v2/top-headlines?sources=associated-press&apiKey=##########'],
			  ['https://newsapi.org/v2/top-headlines?country=us&category=science&apiKey=##########'],
			  ['https://newsapi.org/v2/top-headlines?sources=the-new-york-times&apiKey=##########'],
			  ['https://newsapi.org/v2/top-headlines?sources=axios&apiKey=##########'],
			  ['https://newsapi.org/v2/top-headlines?sources=the-washington-post&apiKey=##########']]
	for item in urlLst[i]:
		url = item
		i += 1
	print(str(counter) + " - " + url)
	return url

### Format response for size constraints and ensure character consistency using unidecode ###

def response(url):
	try:
		response = requests.get(url)
		response_data = response.json()
		lst = []
		for item in response_data['articles']:
			lst.append((item['title']))
		textAPI = ' - '.join(x for x in lst)
		textFormAPI = textAPI[:185]
		decode = unidecode(textFormAPI)
		serText = decode.upper().encode()
		return serText
	except Exception:
		pass

### Send to microcontoller via serial port ###

def serSend(serText):
	ser = serial.Serial(
			port='COM3',
			baudrate=115200,
			parity=serial.PARITY_NONE,
			stopbits=serial.STOPBITS_ONE,
			bytesize=serial.EIGHTBITS,
			timeout=1
			)
	line1 = ser.readline()
	time.sleep(5)
	ser.write(serText)

while True:
	url = selectURL()
	response(url)
	serText = response(url)
	serSend(serText)
	time.sleep(120)
