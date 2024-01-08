from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ChatMessage
from .serializers import ChatMessageSerializer

# class ChatMessageView(APIView):
#     def post(self, request, format=None):
#         serializer = ChatMessageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ChatMessageView(APIView):
    def post(self, request, format=None):
        conversationId = request.data.get('conversationId')
        new_response = request.data.get('response')
        chat_message = ChatMessage.objects.filter(conversationId=conversationId).first()
        if chat_message:
            # If a chat message for this user exists, update it
            current_response = chat_message.response
            if type(current_response) is list:
                updated_response = current_response + [new_response]  # append the new response
            else:
                # Handle the case where current_response is not a list
                updated_response = [current_response, new_response]
            request.data['response'] = updated_response  # update the response in the request data
            serializer = ChatMessageSerializer(chat_message, data=request.data)
        else:
            # If no chat message for this user exists, create a new one
            serializer = ChatMessageSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)