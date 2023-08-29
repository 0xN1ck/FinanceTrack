from rest_framework import generics
from .serializers import *


class TagsListCreate(generics.ListCreateAPIView):
    queryset = Tags.objects.all()
    serializer_class = TagsSerializer


class AssigneesListCreate(generics.ListCreateAPIView):
    queryset = Assignees.objects.all()
    serializer_class = AssigneesSerializer


class DeductionsListCreate(generics.ListCreateAPIView):
    queryset = Deductions.objects.all()
    serializer_class = DeductionsSerializer


class DeductionsRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Deductions.objects.all()
    serializer_class = DeductionsSerializer


class WeeksListCreate(generics.ListCreateAPIView):
    queryset = Weeks.objects.all()
    serializer_class = WeeksSerializer


class WeeksRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Weeks.objects.all()
    serializer_class = WeeksSerializer


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    
class UserWorkerList(generics.ListAPIView):
    queryset = User.objects.filter(is_superuser=False)
    serializer_class = UserSerializer
    
    
class DeductionsForWorkerList(generics.ListAPIView):
    serializer_class = DeductionsSerializer
    
    def get_queryset(self):
        worker_id = self.kwargs['user']
        return Deductions.objects.filter(user_id=worker_id)