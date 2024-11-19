from django.db import models
from django.contrib.auth.models import User

class TODOO(models.Model):
    id=models.AutoField(primary_key=True,auto_created=True)
    title=models.CharField(max_length=100)
    created_time=models.DateTimeField(auto_now_add=True)
    user=models.ForeignKey(on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    