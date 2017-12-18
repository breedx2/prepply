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

* timestamps files after creation
* fix media player in album pages
* page content min-height (like in "misc" page, it's too stubby/short)
* background image too big?  different sizes for viewport size?
* make a landing/splash page.
* fix up lightboxes
* RDF in album pages.
* changing content of a single blog screws paging, just redo them all(?)
* fix up custom css / js in pages
* whataburger tape has <style> css in it
* training of marine - custom title with <br/> in it (needed)
* fix cowstick
* fix iquitsmoking
* make a theme
* directory listings
* convert html resume to markdown
* redirects?
* check for all busted links
* sometimes file change can crash devserver?
* build publication scriptery
* publish on github
* ...

# post-deploy

* verify content-type for rss/atom
* crawl for 404s
* verify feed(s) in feedly
