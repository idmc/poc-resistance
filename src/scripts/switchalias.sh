#!/bin/bash

INDEX_RECORDS=$(curl -XGET -s 'http://localhost:9200/_cat/indices?h=i' | grep records-)
INDEX_RECORDS_CLEAN="$(echo -e "${INDEX_RECORDS}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
INDEX_OBFUSCATE=$(curl -XGET -s 'http://localhost:9200/_cat/indices?h=i' | grep recordsobfuscate)
INDEX_OBFUSCATE_CLEAN="$(echo -e "${INDEX_OBFUSCATE}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"

ALIAS_POINTER=$(curl -XGET -s 'http://localhost:9200/_cat/aliases/records?h=i')
ALIAS_POINTER_CLEAN="$(echo -e "${ALIAS_POINTER}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"

if [ "$ALIAS_POINTER_CLEAN" = "$INDEX_RECORDS_CLEAN" ]; then
	echo "Switch alias to OBFUSCATE"
	curl -XPOST 'http://localhost:9200/_aliases' -d "
	{
    	\"actions\" : [
        	{ \"add\" : { \"index\" : \"$INDEX_OBFUSCATE_CLEAN\", \"alias\" : \"records\" } },
        	{ \"remove\" : { \"index\" : \"$INDEX_RECORDS_CLEAN\", \"alias\" : \"records\" } }
    	]
	}"
else
	echo "Switch alias to ORIGINAL"
	curl -XPOST 'http://localhost:9200/_aliases' -d "
	{
    	\"actions\" : [
        	{ \"remove\" : { \"index\" : \"$INDEX_OBFUSCATE_CLEAN\", \"alias\" : \"records\" } },
        	{ \"add\" : { \"index\" : \"$INDEX_RECORDS_CLEAN\", \"alias\" : \"records\" } }
    	]
	}"
fi