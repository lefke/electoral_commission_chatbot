# Create your models here.
from django.db import models

class ChatMessage(models.Model):
    conversationId = models.CharField(max_length=36)
    response = models.JSONField()
    history = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)