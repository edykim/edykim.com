---
title: Django Girls 튜토리얼 정리
author: haruair
type: post
date: 2016-01-30T02:09:59+00:00
history:
  - 
    from: https://www.haruair.com/blog/3352
    movedAt: 2018-09-13T22:02:41+00:00
lang: ko
slug: organizing-django-girls-tutorial
headline:
  - DjangoGirls에서 제공하는 django로 블로그 만들기 요약
categories:
  - 개발 이야기
tags:
  - django
  - python

---
이상한모임에서 진행할 사이드 프로젝트에 Django를 사용하게 되었는데 제대로 살펴본 경험이 없어서 그런지 영 익숙해지질 않았다. 이전에 [Django Girls 튜토리얼 – django로 블로그 만들기][1] 포스트를 본 것이 생각나서 살펴보다가 튜토리얼까지 보게 되었다.

이 포스트는 장고걸스 서울에서 번역된 [장고 걸스 튜토리얼][2]을 따라 진행하며 내가 필요한 부분만 정리했기 때문에 빠진 내용이 많다. 튜토리얼은 더 자세하게 세세한 부분까지 설명이 되어 있으니 만약 Django를 학습하려 한다면 꼭 튜토리얼을 살펴볼 것을 추천한다.

* * *

### Django 및 환경 설정하기

    $ python3 -m venv myvenv
    $ source myvenv/bin/activate
    $ pip install django==1.8
    

### 프로젝트 시작하기

    django-admin startproject mysite .
    

생성된 프로젝트 구조는 다음과 같다.

    djangogirls
    ├───manage.py # 사이트 관리 도구
    └───mysite
            settings.py  # 웹사이트 설정
            urls.py      # 라우팅, `urlresolver`를 위한 패턴 목록
            wsgi.py
            __init__.py
    

### 기본 설정하기

`settings.py`를 열어서 `TIME_ZONE`을 수정한다.

    TIME_ZONE = 'Asia/Seoul'
    

정적 파일 경로를 추가하기 위해 파일 끝에 다음 내용을 추가한다.

    STATIC_URL = '/static/'
    STATIC_ROOT = os.path.join(BASE_DIR, 'static')
    

데이터베이스는 기본값으로 sqlite3이 설정되어 있다. 데이터베이스 생성은 `manage.py`를 활용한다.

    $ python manage.py migrate
    

서버를 실행해서 확인한다.

    $ python manage.py runserver 0:8000
    

### 어플리케이션 생성하기

    $ python manage.py startapp blog
    

`mysite/settings.py`를 열어 `INSTALLED_APPS`에 방금 생성한 어플리케이션을 추가한다.

```python
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog',
)
```

### 블로그 글 모델 만들기

```python
from django.db import models
from django.utils import timezone


class Post(models.Model):
    author = models.ForeignKey('auth.User')
    title = models.CharField(max_length=200)
    text = models.TextField()
    created_date = models.DateTimeField(
            default=timezone.now)
    published_date = models.DateTimeField(
            blank=True, null=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title

```

여기서 사용할 수 있는 필드는 [모델 필드 레퍼런스][3]를 참조한다.

생성한 모델을 사용하기 위해 마이그레이션 파일을 생성하고 마이그레이션을 수행한다.

    $ python manage.py makemigrations blog
    $ python manage.py migrate blog
    

### Django 관리자 사용하기

새로 추가한 모델을 관리자 패널에서 접근하기 위해서 `blog/admin.py`에 다음 코드를 추가한다.

```python
from django.contrib import admin
from .models import Post

admin.site.register(Post)
```

관리자 패널에 로그인하기 위한 아이디를 생성한다. 프롬프트에 따라 생성한 후 웹서버를 실행해서 관리자 패널(<http://127.0.0.1:8000/admin/>)에 접속한다.

    $ python manage.py createsuperuser
    $ python manage.py runserver 0:8000
    

테스트를 위해 Posts에 글을 추가한다.

### Git 설정하기

리포지터리를 초기화하고 커밋한다. 튜토리얼은 Github 사용하는 방법이 설명되어 있다. `.gitignore`은 아래처럼 작성할 수 있다.

    *.pyc
    __pycache__
    myvenv
    db.sqlite3
    .DS_Store
    

### PythonAnywhere 설정하기

[PythonAnywhere][4]는 Python을 올려 사용할 수 있는 PaaS 서비스로 개발에 필요한 다양한 서비스를 제공한다.

먼저 서비스에 가입해서 콘솔에 접속한다. Github에 올린 코드를 clone한 다음 가상환경을 설치하고 진행한다.

    $ git clone https://github.com/<your-github-username>/my-first-blog.git
    $ cd my-first-blog
    $ virtualenv --python=python3.4 myvenv
    $ source myvenv/bin/activate
    $ pip install django whitenoise
    

whitenoise는 정적 파일을 CDN처럼 사용할 수 있도록 돕는 패키지다. 먼저 django의 관리자 도구로 모든 패키지에 포함된 정적 파일을 수집한다.

    $ python manage.py collectstatic
    

데이터베이스와 관리자를 생성한다.

    $ python manage.py migrate
    $ python manage.py createsuperuser
    

이제 PythonAnywhere 대시보드에서 web app을 추가하고 manual configuration을 python3.4로 설정한다. 가상환경 경로는 앞서 생성했던 `/home/<your-username>/my-first-blog/myvenv/`로 입력한다.

WSGI 프로토콜도 사용할 수 있는데 Web > Code 섹션을 보면 WSGI 설정 파일 경로가 있다. 경로를 클릭해서 다음처럼 내용을 변경한다.

```python
import os
import sys

path = '/home/<your-username>/my-first-blog'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'mysite.settings'

from django.core.wsgi import get_wsgi_application
from whitenoise.django import DjangoWhiteNoise
application = DjangoWhiteNoise(get_wsgi_application())
```

### URL 작성하기

django는 URL을 위해 정규표현식을 사용한다. 앞서 생성한 blog를 mysite로 다음처럼 불러온다.

```python
from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'', include('blog.urls')),
]
```

`blog/urls.py`를 추가하고 다음 내용을 추가한다.

```python
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.post_list, name='post_list'),
]
```

### View 작성하기

`blog/views.py`를 열고 `post_list`를 생성한다.

```python
from django.shortcuts import render

def post_list(request):
    return render(request, 'blog/post_list.html', {})
```

### 템플릿 작성하기

`blog/templates/blog` 밑에 `post_list.html`을 생성한다. 디렉토리 구조에 유의한다.

### Django ORM과 QuerySets

Django에서의 모델 객체 목록을 [QuerySets][5]이라 하며 데이터를 정렬하거나 처리할 때 사용한다.

콘솔에서 다음 명령어로 쉘에 접근한다.

    $ python manage.py shell
    

모델은 먼저 불러온 다음에 쿼리셋을 사용할 수 있다.

    >>> from blog.models import Post
    >>> Post.objects.all()
    [<Post: Hello World>, <Post: Koala>]
    
    >>> from django.contrib.auth.models import User
    >>> User.objects.all()
    [<User: edward>]
    >>> me = User.objects.get(username='edward')
    
    >>> Post.objects.create(author=me, title='Goodbye my friend', text='bye')
    <Post: Goodbye my friend>
    >>> Post.objects.all()
    [<Post: Hello World>, <Post: Koala>, <Post: Goodbye my friend>]
    

쿼리셋을 다음 방법으로 필터링 할 수 있다.

    >>> Post.objects.filter(author=me)
    [<Post: Hello World>, <Post: Koala>, <Post: Goodbye my friend>]
    >>> Post.objects.filter(title__contains='Koala')
    [<Post: Koala>]
    
    >>> from django.utils import timezone
    >>> Post.objects.filter(published_date__lte=timezone.now())
    []
    >>> post = Post.objects.get(title__contains="Goodbye")
    >>> post.publish()
    >>> Post.objects.filter(published_date__lte=timezone.now())
    [<Post: Goodbye my friend>]
    
    

정렬도 가능하며 체이닝으로 한번에 호출하는 것도 가능하다.

    >>> Post.objects.order_by('created_date')
    [<Post: Hello World>, <Post: Koala>, <Post: Goodbye my friend>]
    >>> Post.objects.order_by('-created_date')
    [<Post: Goodbye my friend>, <Post: Koala>, <Post: Hello World>]
    >>> Post.objects.filter(published_date__lte=timezone.now()).order_by('published_date')
    

### 템플릿에서 동적 데이터 활용하기

`blog/views.py`를 수정한다.

```python
from django.shortcuts import render
from django.utils import timezone
from .models import Post


def post_list(request):
    posts = Post.objects.filter(published_date__lte=timezone.now()).order_by('published_date')
    return render(request, 'blog/post_list.html', {'post': posts})
```

`blog/templates/blog/post_list.html`을 수정한다.

```html
<div>
    <h1><a href="/">Django Girls Blog</a></h1>
</div>

{% for post in posts %}
    <div>
        <p>published: {{ post.published_date }}</p>
        <h1><a href="">{{ post.title }}</a></h1>
        <p>{{ post.text|linebreaks }}</p>
    </div>
{% endfor %}
```

### CSS 추가하기

정적 파일은 `blog/static` 폴더에 넣는다. `blog/static/css/blog.css`를 작성한다.

```css
h1 a {
    color: #FCA205;
}
```

템플릿에 적용한다.

```html
{% load staticfiles %}
<!doctype html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <title>Django Girls Blog</title>
    <link rel="stylesheet" href="{% static 'css/blog.css' %}">
</head>
<body>
  <div>
      <h1><a href="/">Django Girls Blog</a></h1>
  </div>

  {% for post in posts %}
      <div>
          <p>published: {{ post.published_date }}</p>
          <h1><a href="">{{ post.title }}</a></h1>
          <p>{{ post.text|linebreaks }}</p>
      </div>
  {% endfor %}
</body>
</html>
```

### 템플릿 확장하기

`base.html`을 다음과 같이 작성한다.

```html
{% load staticfiles %}
<!doctype html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <title>Django Girls Blog</title>
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="{% static 'css/blog.css' %}">
</head>
<body>
    <div class="page-header">
        <h1><a href="/">Django Girls Blog</a></h1>
    </div>
    <div class="content container">
        <div class="row">
            <div class="col-md-8">
            {% block content %}
            {% endblock %}
            </div>
        </div>
    </div>
</body>
</html>
```

이제 `post_list.html`에서는 위 base 파일을 불러오고 `content` 블럭 안에 내용을 넣을 수 있다.

```html
{% extends 'blog/base.html' %}

{% block content %}
    {% for post in posts %}
        <div class="post">
            <div class="date">
                {{ post.published_date }}
            </div>
            <h1><a href="">{{ post.title }}</a></h1>
            <p>{{ post.text|linebreaks }}</p>
        </div>
    {% endfor %}
{% endblock content %}
```

### post detail 페이지 만들기

이제 블로그 포스트를 볼 수 있는 페이지를 만든다. `blog/templates/blog/post_list.html`의 링크를 수정한다.

```html
<h1><a href="{% url 'post_detail' pk=post.pk %}">{{ post.title }}</a></h1>
```

`blog/urls.py`에 post_detail을 추가한다. 뒤에 입력하는 내용을 모두 pk 변수에 저장한다는 의미다. pk는 `primary key`를 뜻한다.

```python
from django.conf.urls import url
from . import views

urlpatterns = [
  url(r'^$', views.post_list, name='post_list'),
  url(r'^post/(?P<pk>[0-9]+)/$', views.post_detail, name='post_detail'),
]
```

`blog/views.py`에 post_detail을 추가한다. 만약 키가 존재하지 않는다면 404 Not Found 페이지로 넘겨야 하는데 `get_object_or_404` 함수를 사용할 수 있다.

```python
from django.shortcuts import render, get_object_or_404

# ...

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'blog/post_detail.html', {'post': post})
```

이제 `blog/templates/blog/post_detail.html`을 생성한다.

```html
{% extends 'blog/base.html' %}

{% block content %}
    <div class="post">
        {% if post.published_date %}
            <div class="date">
                {{ post.published_date }}
            </div>
        {% endif %}
        <h1>{{ post.title }}</h1>
        <p>{{ post.text|linebreaks }}</p>
    </div>
{% endblock %}
```

### 모델 폼 사용하기

Django는 간단하게 폼을 생성할 수 있는 기능을 제공한다. `blog/forms.py`를 생성한다.

```python
from django import forms

from .models import Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('title', 'text',)
```

`blog/templates/blog/base.html`에 이 폼에 접근하기 위한 링크를 추가한다.

```html
<a href="{% url 'post_new' %}" class="top-menu"><span class="glyphicon glyphicon-plus"></span></a>
```

`blog/urls.py`에 규칙을 추가한다.

```python
    url(r'^post/new/$', views.post_new, name='post_new'),
```

`blog/views.py`에 form과 `post_new` 뷰를 추가한다.

```python
from django.shortcuts import redirect
from .forms import PostForm

#...

def post_new(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.published_date = timezone.now()
            post.save()
            return redirect('blog.views.post_detail', pk=post.pk)
    else:
        form = PostForm()
    return render(request, 'blog/post_edit.html', {'form': form})

```

`blog/templates/blog/post_edit.html`을 추가한다.

```html
{% extends 'blog/base.html' %}

{% block content %}
    <h1>New post</h1>
    <form method="POST" class="post-form">{% csrf_token %}
        {{ form.as_p }}
        <button type="submit" class="save btn btn-default">Save</button>
    </form>
{% endblock %}
```

### 수정 페이지 추가하기

`blog/templates/blog/post_detail.html`에 다음 링크를 추가한다.

```html
<a class="btn btn-default" href="{% url 'post_edit' pk=post.pk %}"><span class="glyphicon glyphicon-pencil"></span></a>
```

`blog/urls.py`에 다음 코드를 추가한다.

```python
    url(r'^post/(?P<pk>[0-9]+)/edit/$', views.post_edit, name='post_edit'),
```

`blog/views.py`에 post_edit 뷰를 추가한다.

```python
def post_edit(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == "POST":
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.published_date = timezone.now()
            post.save()
            return redirect('blog.views.post_detail', pk=pk)
    else:
        form = PostForm(instance=post)
    return render(request, 'blog/post_edit.html', {'form': form})
```

`PostForm()`에서 instance를 추가하는 것으로 내용을 미리 초기화한다.

### 보안

템플릿에서 사용자 권한이 있는 경우만 확인할 수 있도록 작성할 수 있다. `blog/templates/blog/base.html`에서 새 포스트 링크를 다음과 같이 변경한다.

```html
{% if user.is_authenticated %}
    <a href="{% url 'post_new' %}" class="top-menu"><span class="glyphicon glyphicon-plus"></span></a>
{% endif %}
```

* * *

이 튜토리얼 뒤엔 보안을 강화하고 새로운 기능을 추가하는 등의 심화편이 있다. [Django Girls Tutorial: Extensions][6]에서 그 내용을 볼 수 있다.

 [1]: https://milooy.wordpress.com/2015/11/23/django-girls-%ED%8A%9C%ED%86%A0%EB%A6%AC%EC%96%BC-django%EB%A1%9C-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0/
 [2]: http://tutorial.djangogirls.org/ko/
 [3]: https://docs.djangoproject.com/en/1.8/ref/models/fields/#field-types
 [4]: https://www.pythonanywhere.com/
 [5]: https://docs.djangoproject.com/en/1.8/ref/models/querysets/
 [6]: https://www.gitbook.com/book/djangogirls/django-girls-tutorial-extensions/details