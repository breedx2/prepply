Static site gen, my way.

Turns markdown + front matter + config + sass into a static site.

That static site can be published....

...and it's like all the other static gen frameworks, except apparently I hate them all
and want to reinvent everything always because I'm probably stupid.

I'm using prepply to build https://noisybox.net/

Maybe you could find it useful too.

# features

* a "live dev" server
* flat pages
* a paged blog
* blog rss/atom feeds
* blog tags
* blog tags atom/rss feeds
* support for audio playlists
* support for fancybox galleries
* assumes external assets, but supports in-site assets just in case

Seems to be reasonably fast (generates 1700+ files on my site in under 2.5s).

# build usage

Builds the static site:

```
$ node prepply/prepply.js --indir ../site --outdir ../out \
    --clean --config ../site/config.yml
```

This will process the content in the `site` dir, turning markdown into
html and copying over assets, resulting in a new `out` dir.  Any exising `out` dir
will be removed (the `--clean` option does this).

If your configuration file is correct, then you can use this npm shortcut:
```
$ npm run build
```

# dev server usage

Runs a live-reload development server:

```
$ node dev-server.js --indir ../site --outdir ../out \
    --config ../site/config.yml --static ../site-assets
```

of if your configuration is correct, just do
```
$ npm run dev-server
```

# config file

need to document this

# bugs

* changing content of a single blog screws paging, just redo them all(?)
* dev server _should_ generate blogs and everything on the first go...just no on successive.
* sometimes file change can crash devserver? maybe it's read before write finishes?

# such future

* um, maybe I should write some tests at some point. :)
* make themeing / skinning a little more straightforward
*
* create tag pages for regular pages too
* leverage sidebar etc
* consider webpacking various js together for publish
* support for rdf, like in album pages (do people still care about rdf?)
