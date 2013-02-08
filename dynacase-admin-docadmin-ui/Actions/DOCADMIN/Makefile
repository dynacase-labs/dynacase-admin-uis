# get the new appname (basename in uppercase)
appname = $(shell basename `pwd` | tr [a-z] [A-Z])

export appname
pages_html = $(patsubst %.html,$(pubdir)/$(style)/$(appname)/Layout/%.html,$(filter-out $(pages_not_html),$(wildcard *.html)))

include $(utildir)/PubRule
publish:  $(pages_html)

$(pubdir)/$(style)/$(appname)/Layout/%.html : %.html $(pubdir)/$(style)/$(appname)/Layout
	$(installcp) $< $@