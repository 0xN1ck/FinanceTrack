from rest_framework import generics
from rest_framework import viewsets, mixins
from django.db.models import Sum
from datetime import datetime
from rest_framework.response import Response
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView


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


class ExtractsCreateList(generics.ListCreateAPIView):
    queryset = Extracts.objects.all()
    serializer_class = ExtractsSerializer


class ExtractsRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Extracts.objects.all()
    serializer_class = ExtractsSerializer


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


class ExtractsForWorkerList(generics.ListAPIView):
    serializer_class = ExtractsSerializer

    def get_queryset(self):
        worker_id = self.kwargs['user']
        return Extracts.objects.filter(user_id=worker_id)


class ExtractsViewSet(viewsets.GenericViewSet):
    serializer_class = ExtractsSerializer

    def create(self, request):
        data = request.data

        # Получение пользователя по ID
        user_id = data['user_id']
        user = User.objects.get(id=user_id)

        # Расчет суммы для amount_of_consumables
        consumables_sum = Deductions.objects.filter(user=user,
                                                    date__range=[data['date_start'], data['date_end']]).aggregate(
            Sum('cost_of_consumables'))
        amount_of_consumables = consumables_sum['cost_of_consumables__sum'] or 0

        # Расчет суммы для amount_commission_for_deposits
        commission_sum = Deductions.objects.filter(user=user,
                                                   date__range=[data['date_start'], data['date_end']]).aggregate(
            Sum('commission_for_deposits'))
        amount_commission_for_deposits = commission_sum['commission_for_deposits__sum'] or 0

        for i in data.keys():
            if data.get(i) == '':
                data[i] = 0
        # Расчет значения для total
        total = (
                float(data['income']) +
                float(data['expense']) +
                float(amount_of_consumables * -1) +
                float(amount_commission_for_deposits * -1) +
                float(data['debt'])
        )

        # Создание нового объекта Extracts
        extract = Extracts.objects.create(
            user=user,
            date_start=data['date_start'],
            date_end=data['date_end'],
            payment=data['payment'],
            income=data['income'],
            expense=data['expense'],
            amount_of_consumables=amount_of_consumables * -1,
            amount_commission_for_deposits=amount_commission_for_deposits * -1,
            debt=data['debt'],
            total=total,
            user_id=user_id
        )

        serializer = ExtractsSerializer(extract)
        return Response(serializer.data)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
