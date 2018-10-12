---
title: "column `user_id` cannot be null on django admin"
author: haruair
date: "2017-01-24T19:11:45+11:00"
type: post
lang: en
slug: column-user_id-cannot-be-null-on-django-admin
tags:
  - django
---

I've got an IntegrityError when I remove the user from django-admin. I uses custom `User` model,
but I didn't change that much rather than `AbrstractUser` from `django.contrib.auth.models`. The
error was like this:

```
IntegrityError: (1048, "Column 'user_id' cannot be null")
```

I couldn't find the case at all. I asussemed that the error occurs from MySQL, I checked all table
schema one by one and finally found the reason.

One of the model includes User `ForeignKey` with `on_delete=models.SET_DEFAULTS` which is fine
because when remove the user, it will set the default value, `None` in this case. This model is the
record for the signing policy so it also includes Policy `ForeignKey`. Then these fields sets as
`unique_together` that the database create a unique key based on these two fields. When removed
the user, the field followed `on_delete` action and tried to remove `user_id`, then the update failed
because of the `unique_together`.

I should be more careful when I use `unique_together`, Django is too easy to create this kind of
relationship on the code, especially. With great power comes great responsibility!

