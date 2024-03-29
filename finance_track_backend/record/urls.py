from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('login/', MyTokenObtainPairView.as_view()),
    path('tags/', TagsListCreate.as_view()),
    path('tag/<int:pk>/', TagsRetrieveUpdateDestroy.as_view()),
    path('deductions/', DeductionsListCreate.as_view()),
    path('deduction/<int:pk>/', DeductionsRetrieveUpdateDestroy.as_view()),
    path('deduction/worker/<int:user>/', DeductionsForWorkerList.as_view()),
    path('deduction/worker/<int:user>/get-total-pages/', DeductionsGetTotalPagesSerializer.as_view()),  # test
    path('assignee/', AssigneesListCreate.as_view()),
    path('extracts/', ExtractsCreateList.as_view()),
    path('extracts/get-total-pages/', ExtractsGetTotalPages.as_view()),  # test
    path('extracts/get-total-pages/<int:user_id>/', UserExtractsTotalPagesUser.as_view()),  # test
    path('extract/<int:pk>/', ExtractsRetrieveUpdateDestroy.as_view()),
    path('extract/worker/<int:user>/', ExtractsForWorkerList.as_view()),
    path('statistics/', GetStatsAll.as_view(), name='user-statistics'),
    path('statistics/<int:user_id>/', GetStats.as_view(), name='user-statistics'),
    path('user/', UserList.as_view()),
    path('worker/', UserWorkerList.as_view()),
    path('worker/<int:id>/', UserWorkerDetail.as_view()),
    path('extract-create/', ExtractsViewSet.as_view({'post': 'create'})),
]
