#!/usr/bin/env python
#! coding=utf-8


#
# Python Script to constract main.html page of app
# You should run this script every time you change sub-pages html files
#
#
#


__metaclass__ = type # Make sure we get new style classes

import re 
import os
import time
import json
import codecs

from tempfile import mkstemp
from shutil import move
from os import remove, close


root = "./"
pagePatt  = re.compile('<pyinclude src="([^"]*)">')
locPatt   = re.compile('<pyloc src="(([^.]*).([^"]*))">')

#************************** createMainPage fun **********************#
def createMainPage(tmplt,page):
    
    tmpltFilePath = root+tmplt
    pageFilePath = root+page
    
    newFile = parseContant(tmpltFilePath)
    
    if os.path.exists(pageFilePath):
        #Remove original file
        remove(pageFilePath)
        
    returned = 0
    file = open(pageFilePath,'w')
    if file :
        file.write(newFile)
        print 'file saved: '+pageFilePath
        returned =1
    else: 
        print "can't openfile: "+root+"/"+str(pageNum)
    file.close()
    
    return returned



def parseContant(path):
    #print path
    page = ""
    if not os.path.exists(path):
        print "file not exist: "+path
    else:
        tmpltFile = open(path,'r')
        page = tmpltFile.read()
        tmpltFile.close()
        
        matches = re.findall(pagePatt,page)
        #print matches
        if matches:
            for match in matches:
                #parseContant(root+match)
                matchFile = parseContant(root+match)  #open(root+match).read()
                page = page.replace('<pyinclude src="'+match+'">',matchFile)
                #print "page included: "+match
        #else:
            #print "No pages found to include"

    return page



def localizePage(path,index):
	#jFile = open("./js/LocStatic.js",'r')
	jFile = codecs.open('./js/LocStatic.js', encoding='utf-8')
	loc = json.loads(jFile.read())
	jFile.close()
	
	#print loc["loginPage"]['header'][1]
	
	page = ""
	if not os.path.exists(path):
		print "file not exist: "+path
	else:
		tmpltFile = open(path,'r')
		page = tmpltFile.read()
		tmpltFile.close()
		
		
		matches = re.findall(locPatt,page)
		#print matches
		if matches:
			for match in matches:
				page = page.replace('<pyloc src="'+match[0]+'">',loc[match[1]][match[2]][index])

			if os.path.exists(path):
				#Remove original file
				remove(path)
        
			file = codecs.open(path ,'w' , encoding='utf-8')
			if file :
				file.write(page)
				print 'file saved: '+path
			else: 
				print "can't openfile: "+path
			file.close()
			
			
	
def localizePageAr(path):
	localizePage(path, 1)
	
def localizePageEn(path):
	localizePage(path, 0)
#*****************************************************************#

Creation = createMainPage("tmplt/tmplt.html","index.html")
if Creation:
	print "************* Main Page Created **************"
else:
    print "************* Error in Main Page Creation **************"
	
localizePageEn("./index.html")

Creation = createMainPage("tmplt/tmplt_ar.html","indexAr.html")
if Creation:
    print "************* Main Page Created **************"
else:
    print "************* Error in Main Page Creation **************"
	
localizePageAr("./indexAr.html")

