from django.urls import path, include
from .views import *

urlpatterns = [
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('tags/', TagsListCreate.as_view()),
    path('deductions/', DeductionsListCreate.as_view()),
    path('deduction/<int:pk>/', DeductionsRetrieveUpdateDestroy.as_view()),
    path('assignee/', AssigneesListCreate.as_view()),
    path('week/<int:pk>/', WeeksRetrieveUpdateDestroy.as_view()),
    path('user/', UserList.as_view()),
    path('worker/', UserWorkerList.as_view()),
]
