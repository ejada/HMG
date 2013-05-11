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

from tempfile import mkstemp
from shutil import move
from os import remove, close


root = "./"
pagePatt  = re.compile('<pyinclude src="([^"]*)">')


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

#*****************************************************************#

Creation = createMainPage("tmplt/tmplt.html","index.html")
if Creation:
    print "************* Main Page Created **************"
else:
    print "************* Error in Main Page Creation **************"
