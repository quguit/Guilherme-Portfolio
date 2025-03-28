from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

# Create your views here.

class NoteListCreate(generics.ListCreateAPIView):
    """
    API view to list all notes or create a new note.
    """
    
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Returns a queryset of notes belonging to the current user.
        """
        user = self.request.user
        return Note.objects.filter(autor=user)
    
    def perform_create(self, serializer):
        """
    Overwrites the default create method to set the autor of the note to the current user.
        """
        if serializer.is_valid():
            serializer.save(autor=self.request.user)
        else:
            print(serializer.errors)
    
class NoteDelete(generics.DestroyAPIView):
    """
    API view to delete a note.
    """
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(autor=user)
    
class CreateUserView(generics.CreateAPIView):
    """
    API view to create a new user.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]