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

* add site footer
* timestamps files after creation
* add --nowatch to devserver
* page content min-height (like in "misc" page, it's too stubby/short)
* background image too big?  different sizes for viewport size?
* only compile sass for custom.scss (not blog, fonts, etc)
* blogs tags (+ paging)
* rss feed
* make a theme
* fix up lightboxes
* changing content of a single blog screws paging, just redo them all(?)
* fix up custom css / js in pages
* whataburger tape has <style> css in it
* training of marine - custom title with <br/> in it (needed)
* fix linkpile
* fix cowstick
* fix iquitsmoking
* p5glove could use some love -- around code blocks
* check for all busted links
* ...
