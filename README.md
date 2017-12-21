Static site gen, my way.

Turns markdown + front matter + config into a static site.

That static site can be published....

...and it's like all the other static gen frameworks, except apparently I hate them all
and want to reinvent everything always.

# build usage

Builds the static site:

```
$ node prepply/prepply.js --indir site --outdir out --clean
```

# dev server usage

Runs a live-reload development server:

```
$ node prepply/dev-server.js --indir site --outdir out
```

# config file


# todo:

* fix media player in album pages
* convert html resume to markdown
* page content min-height (like in "misc" page, it's too stubby/short)
* background image too big?  different sizes for viewport size?
* make a landing/splash page.
* RDF in album pages.
* add github link on computers (and maybe nav?)
* changing content of a single blog screws paging, just redo them all(?)
* dev server _should_ generate blogs and everything on the first go...just no on successive.
* make a theme
* clean up assets js and css dirs
* directory listings
* consider webpacking various js together for publish
* redirects?
* check for all busted links
* sometimes file change can crash devserver?
* build publication scriptery
* publish project on github
* ...

# post-deploy

* verify content-type for rss/atom
* crawl for 404s
* verify feed(s) in feedly

# such future

* all page tag index
* leverage sidebar etc
