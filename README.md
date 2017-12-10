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

* make builder handle single files too
* server
* server reload/recompile
* timestamps files after creation
* blogs paging
* blogs tags (+ paging)
* bring over fonts (from jekyl branch?)
* make a theme
* fix up duplicated page headings (title)
* ...
