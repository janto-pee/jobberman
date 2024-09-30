# Awesome Project Build with TypeORM

## Table of Contents

1. [What is Gin?](#what-is-nextjs)
1. [Introduction](#introduction)
1. [Project Initialization](#project-setup)
1. [Folder Structure](#folder-structure)
1. [Postgresql Setup](#git-setup)
1. [Database Migration](#code-formatting-and-quality-tools)
1. [What is SQLC](#git-hooks)
1. [SQLC Test](#vs-code-configuration)
1. [API Serverl](#debugging)
1. [Load Env Variables](#directory-structure)
1. [Parameter Validation](#adding-storybook)
1. [Securely Store Password](#creating-a-component-template)
1. [Create and Verify JWT](#using-the-component-template)
1. [Middleware](#adding-a-custom-document)
1. [Package](#adding-layouts)
1. [Create a production DB](#deployment)
1. [Store & Retrieve Production Secret](#next-steps)
1. [Deploy App to Kubernetes](#wrapping-up)

## What is Django Rest Framework?

\_Django REST framework abbreviated as "DRF" is a powerful and flexible toolkit for building Web APIs. Although DRF and Django have a lot of similarities, they are suited for differentpurposes.

Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. Built by experienced developers, it takes care of much of the hassle of web development, so you can focus on writing your app without needing to reinvent the wheel. It’s free and open source

DRF is a powerful and flexible toolkit used to build Web APIs on top of Django. While Django deals with the overall web application, including both frontend and backend components, DRF is used to build RESTful APIs that allow interaction and communication between different software components.

With DRF, it’s easier to design the CRUD operations and use a Django Server as a REST API. Django Rest framework leverages Django’s capabilities to facilitate the development of scalable, maintainable, and secure APIs. It adheres to Django’s principles like DRY (Don’t Repeat Yourself) and emphasizes reusability and modularity.

## Introduction

This project documentation does not replace the official documentation, which is absolutely great. Therefore, I highly encourage you to go through at least the [DRF features](https://www.djangoproject.com/) section before you use this project, so you'll be familiar with the terminology and tools and some of the features they provide that are similar.

Please review the table of contents to get an idea of each of the topics we will be touching in this extensive tutorial.

Now, with all that said, if you are ready, let's jump in!

## Project Initialization

We'll begin by creating a folder for the project.

```bash
mkdir indeedjob
# npx create-next-app --ts nextjs-fullstack-app-template

# cd nextjs-fullstack-app-template
```

Lets install the virtualenv tool to create an isolated Python environments.

```bash
python -m pip install --user virtualenv
python -m virtualenv --help
```

We will create and activate a virtual environment using the installed tool;

```bash
virtualenv env
source env/scriptsactivate
```

we will need to install django, django-rest-framework, django-filters as well as other programs in the requirements.txt

```
django
djangorestframework
djangorestframework-simplejwt
django-storages
django-cors-headers
django-dotenv
django-filter
gunicorn
geocoder
whitenoise
boto3
psycopg2
dj-database-url
```

Now install

```bash
pip install -r requirements.txt
```

## Folder Structure

We would like for this project to host both the frontend and backend of this project.

- `mkdir frontend` - will use typescript, next.js, react, tailwindcss
- `mkdir backend` - Will use python, django-rest-framework

Now lets proceed with the `backend` :

```
cd backend
django-admin startproject backend .
django-admin manage.py startapp job
django-admin manage.py startapp account
```

The `django-admin startproject backend .` helps to auto-generate some code that establishes a Django project – a collection of settings for an instance of Django, including database configuration, Django-specific options and application-specific settings. The `django-admin manage.py startapp job` is a command-line utility for administrative tasks.

## Database (Postgresql) Setup

Make sure you have a postgres database set up already, now go to `backend/settings.py` and add the following

```bash
import os
import dotenv


DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': os.environ.get('DATABASE_NAME'),
        'USER': os.environ.get('DATABASE_USER'),
        'PASSWORD': os.environ.get('DATABASE_PASSWORD'),
        'HOST': os.environ.get('DATABASE_HOST'),
        'PORT': os.environ.get('DATABASE_PORT')
    }
}
```

Now go to the INSTALLED_APPS section and add the `django.contrib.gis` to installed apps.

```
INSTALLED_APPS = [
    some installed apps listed

    'django.contrib.gis'        #the one we just added
]
```

## Configure GDAL

we will use the GDAL library Geocoding feature. The Python GDAL supports geocoding operations, enabling the conversion of addresses or place names into geographic coordinates. The library assists in transforming coordinates between different coordinate reference systems. This feature is valuable when working with datasets that use varying projections.
download the GDAL library; ensure you select theright python version and operating system
now paste the GDAL in the backend and your flder structure should look this

```





```

run pip install GDAL....
Finally add the followingto settigs.py

```python
VIRTUAL_ENV_BASE = os.environ.get('VIRTUAL_ENV')
print(VIRTUAL_ENV_BASE)

GEOS_LIBRARY_PATH = VIRTUAL_ENV_BASE + '/lib/site-packages/osgeo/geos_c.dll'
GDAL_LIBRARY_PATH = VIRTUAL_ENV_BASE + '/lib/site-packages/osgeo/gdal304.dll'
```

now run
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

### Set Environment Variables

Since our application takes its configuration from environment variables, To help with that, we can add Python-dotenv to our application to make it load the configuration from a .env file when it is present (e.g. in development) while remaining configurable via the environment

in settings.py,

```bash
import dotenv
dotenv.read.dotenv()
```

now create .env attheroot level of backend

```json





```

### Create Super User

python manage.py createsuperuser
python manage.py runserver

## Job Model

```python
from datetime import *
from django.db import models
from django.contrib.auth.models import User

import geocoder
import os

from django.contrib.gis.db import models as gismodels
from django.contrib.gis.geos import Point

from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class JobType(models.TextChoices):
    Permanent = 'Permanent'
    Temporary = 'Temporary'
    Intership = 'Intership'

class Education(models.TextChoices):
    Bachelors = 'Bachelors'
    Masters = 'Masters'
    Phd = 'Phd'

class Industry(models.TextChoices):
    Others = 'Others'

class Experience(models.TextChoices):
    NO_EXPERIENCE = 'No Experience'
    ONE_YEAR = '1 Years'
    TWO_YEAR = '2 Years'
    THREE_YEAR_PLUS = '3 Years above'

def return_date_time():
    now = datetime.now()
    return now + timedelta(days=10)

class Job(models.Model):
    title = models.CharField(max_length=200, null=True)
    description = models.TextField(null=True)
    email = models.EmailField(null=True)
    address = models.CharField(max_length=100, null=True)
    jobType = models.CharField(
        max_length=10,
        choices=JobType.choices,
        default=JobType.Permanent
    )
    education = models.CharField(
        max_length=10,
        choices=Education.choices,
        default=Education.Bachelors
    )
    industry = models.CharField(
        max_length=30,
        choices=Industry.choices,
        default=Industry.Business
    )
    experience = models.CharField(
        max_length=20,
        choices=Experience.choices,
        default=Experience.NO_EXPERIENCE
    )
    salary = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(1000000)])
    positions = models.IntegerField(default=1)
    company = models.CharField(max_length=100, null=True)
    point = gismodels.PointField(default=Point(0.0, 0.0))
    lastDate = models.DateTimeField(default=return_date_time)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        g = geocoder.mapquest(self.address, key=os.environ.get('GEOCODER_API'))

        print(g)

        lng = g.lng
        lat = g.lat

        self.point = Point(lng, lat)
        super(Job, self).save(*args, **kwargs)

```

add all installed app req to settings/Installed_Apps

```
rest_framework
django-filters
job.apps.JobConfig'
```

## Job Serializer

T

## Job Views

## Adding Search and Filters

## Adding Pagination

## Setup Account

## Account Serializer & Model

## Add Path to URLs.py

## Testing with Postman











path('jobs/', views.getAllJobs, name='jobs'),

```
{
    title: "DevOps Engineer"
    description: ""
    email: "devops@gmail.com"
    address: "Lagos, Nigeria"
    jobType: "Permanent"
    education: "Bachelors"
    industry: ""
    experience: "THREE_YEAR_PLUS",
    salary: "100,000",
    positions: "Lead SRE"
    company: "Google"
    point: ""
    lastDate: ""
    user: "Ayo"
    createdAt: ""
}
{
    title: "Frontend Developer"
    description: ""
    email: "frontend@gmail.com"
    address: "Port Novo, Benin"
    jobType: "Permanent"
    education: "Bachelors"
    industry: ""
    experience: "THREE_YEAR_PLUS",
    salary: "100,000",
    positions: "Lead Developer"
    company: "Meta"
    point: ""
    lastDate: ""
    user: "Abdou"
    createdAt: ""
}

```
reach out