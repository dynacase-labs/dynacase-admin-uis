export utildir

SUBDIR = $(filter-out Makefile, $(wildcard */))

include $(utildir)/PubRule


$(pubdir)/$(appname)/Data:
	mkdir -p $@

$(pubdir)/$(appname)/Data/%.csv: %.csv $(pubdir)/$(appname)/Data
	cp $< $@

publish: $(pubdir)/$(appname)/Data/Init.csv $(pubdir)/$(appname)/Data/Update.csv

DISTFILES = $(SUBDIR) Makefile