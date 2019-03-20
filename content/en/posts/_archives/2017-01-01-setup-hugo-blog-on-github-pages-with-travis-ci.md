---
title: "Setup Hugo blog on GitHub Pages with Travis CI"
author: haruair
date: "2017-02-04T11:10:12"
type: post
lang: en
slug: setup-hugo-blog-on-github-pages-with-travis-ci
tags:
  - Hugo
  - GitHub
  - Travis CI
---

I don't know much about Go, but I saw so many tweets it's a great language,
performance wise especially. Hugo is a static blog/site generator written by Go.
I feel great with Hugo because of the simplicity. The program is provided as a
single binary file. Other tools require a lot of small settings, installing
language, setting envrionment, handling a package manager, for example. It still
requires some config file, but no worries, it's not that big.

This blog serves on GitHub Pages. If the blog is using Jekyll, GitHub is the
best place to serve the blog because GitHub provides built-in Jekyll serving as
a first citizen. Otherwise, Hugo is in the wild. After writing something new,
it need to render new static pages, then push that files on the repository.
When you publish every single time by hand, it is a huge chore and I will never
use it again. In that case, TravisCI is the solution. It's available to use
it for the rendering after new post pushed.

## [Install Hugo](https://gohugo.io/overview/installing/)

Mac users can install Hugo via [Homebrew](http://brew.sh/) easily.

```bash
$ brew update && brew install hugo
```

The installation is very easy for the most of the platforms. If you are not a
Mac user, check the [Releases page](https://github.com/spf13/hugo/releases).

## Basic Usage

The excerpt of [Quickstart](https://gohugo.io/overview/quickstart/) document is
the below:

```bash
$ hugo new site haruair
$ hugo new post/hello-world.md
$ hugo
```

You can find the result under the `public` directory after `hugo` run.

Hugo provides simple webserver for the local. `--watch` flag is useful for the
editing that the page will refresh every save moment. Also, it's avilable to
build within drafts using `--buildDrafts` or `-D`.

```bash
$ hugo server --watch --buildDrafts
$ hugo server -w -D # same as the above
```

## Initialize a git repository

The strength of static blog is that it don't need any program specific
environment. There are several options, Amazon S3, Dropbox, etc. Even it's
possible to use some abandoned old geocity-ish service. GitHub provides GitHub
Pages for this case and it's free to use.

Create a [GitHub](https://github.com) account if you don't have one. Then,
Create a repository using `<username>.github.io` as a name.

Go to the your hugo directory, and make it as a git repository, then push
it to GitHub.

```bash
$ git init
$ git checkout -b code
$ echo '/public/' >> .gitignore
$ git add .
$ git commit -m "Initial my blog"
$ git remote add origin haruair.github.io
```

I used `code` branch for the original source, the static file in `public`
directory will goes into the `master` branch as an orphan branch.

```bash
$ hugo
$ export HUGO_TEMP_DIR=$(mktemp -d)
$ cp public/* $HUGO_TEMP_DIR
$ git checkout --orphan master
```

## Add a deploy script

If you build the site manually, it's just boring. Travis CI allows us to add a
deploy script after build the static pages. I found
[the script](https://github.com/rcoedo/rcoedo.github.io/blob/source/scripts/deploy.sh)
from [rcoedo.com](http://rcoedo.com/post/hugo-static-site-generator/), I just
put my script below, just in case.

```bash
$ mkdir scripts && cd scripts
$ wget https://raw.githubusercontent.com/haruair/haruair.github.io/code/scripts/deploy.sh
$ git add deploy.sh && git commit -m "Add deploy script"
```

## Create a `.travis.yml` file

I do love pre-config file. The config is
[here](https://github.com/haruair/haruair.github.io/blob/code/.travis.yml).
This config need to update as own details.

The important part is `before_install` part. Delete this section from the yml
file, then add it back with your ssh key. Yes, your ssh key!

Before add the key into the repository, it will encrypt using `travis`. Please
be aware, do not add the original private key into the repository.

### Install `travis`

Travis CI provides a CIL tool for the work. Let's install this tool, first.
It's using Ruby, therefore, you can install it via gem.

```bash
$ gem install travis --no-rdoc -no-ri
```

If you don't have Ruby on your machine, please check
[the document from Travis CI](https://github.com/travis-ci/travis.rb#updating-your-ruby).

### Create a new ssh key and encrypt it

It's available to use an existing key, however, creating new one for Travis CI
is good for the security. Make sure that `ssh-keygen` can be overriding a
default key `id_rsa`, be careful before type the enter.

```bash
$ ssh-keygen
```

I created the ssh key named `travis_key`. The result of this commend is the
pair of the key: `travis_key` and `travis_key.pub`. The first one is a private
key, the other file is a public one.

Now, we can add `travis_key` into Travis using the commend below:

```bash
$ travis encrypt-file travis_key
```

If you are not logged in Travis before, you may need to run `travis login`
first.

After then, travis add encrypt file and set the environment variable for the
encrypt file. Make sure all files are included in git repository and push it
to GitHub. Also, do not commit the "unencrypt key" into your repository.

### Register the new key in GitHub

In GitHub setting page, go to the ssh section and add `travis_key.pub` for the
deploy. [More informations here](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/).

### Enable a repository on Travis CI

Go to [the profile page of Travis CI](https://travis-ci.org/profile), Find out
the repository, then turn on the switch. It will do the build and will push back
to GitHub `master` branch.

----

All done. Just add new post using Hugo, push to GitHub, Travis will handle all
build problem.

The quickest and the easiest way is here. Clone my repository
[haruair.github.io](http://github.com/haruair/haruair.github.io), clean up
all details and configurations, and use it. Please make sure that the credential
is correct.

It's a quite long description than I thought. Tools support the writing, however,
the key of writing is based on all own ideas. Keep sharpening your idea using
awesome writing tool Hugo.

