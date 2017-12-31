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

* ensure nginx logs are good (including 404, error log, etc)
* improve landing/splash page.
* make a theme
* dev server _should_ generate blogs and everything on the first go...just no on successive.
* script for quick-posting an image with some text (including via credit)
* sometimes file change can crash devserver?
* background image too big?  different sizes for viewport size?
* build publication scriptery
* publish project on github
* ...

# post-deploy

* verify content-type for rss/atom
* crawl for 404s
* verify feed(s) in feedly

# bugs

* BUG: changing content of a single blog screws paging, just redo them all(?)

# such future

* all page tag index
* leverage sidebar etc
* consider webpacking various js together for publish
* RDF in album pages.
