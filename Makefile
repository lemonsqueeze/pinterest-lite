
DIR=extension
EXT=pinterest_lite-$(VERSION).oex
INCLUDES=$(shell echo $(DIR)/includes/*.js)
#VERS_MAG=$(shell cat ../scriptweeder.js | grep 'var version' | sed -e "s|.*v\([0-9.]\+\)'.*|\1|")
VERSION=1.217

all: $(EXT)

$(EXT): $(DIR)/config.xml $(DIR)/index.html $(INCLUDES)
	@echo Generating $@
	@-cd $(DIR) && rm *~ */*~ > /dev/null 2>&1
	@cd $(DIR) && zip -r ../$@ *

# add version
$(DIR)/config.xml: Makefile
	@echo Generating $@
	@cat $(DIR)/config.xml | sed -e 's|^\(<widget .*\)version="[^"]*"|\1version="$(VERSION)"|' > $(DIR)/config.xml.tmp
	@mv $(DIR)/config.xml.tmp $(DIR)/config.xml



clean:
	-rm *.oex *~ $(DIR)/includes/scriptweeder.js

FORCE:
