from rest_framework import generics
from rest_framework import viewsets
from datetime import datetime, timedelta
from django.db.models import Sum, F
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticatedOrReadOnly


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
    queryset = Extracts.objects.all().order_by(F('id')).reverse()
    serializer_class = ExtractsSerializer
    pagination_class = PageNumberPagination
    pagination_class.page_size = 10

    def get_queryset(self):
        queryset = super().get_queryset()
        page_size = self.request.query_params.get('page_size')
        if page_size:
            self.pagination_class.page_size = int(page_size)
        return queryset


class ExtractsGetTotalPagesSerializer(generics.RetrieveAPIView):
    serializer_class = ExtractsGetTotalPagesSerializer
    page_size = 10

    def get_object(self):
        total_items = Extracts.objects.count()
        total_pages = (total_items + self.page_size - 1) // self.page_size
        return {'total_pages': total_pages}


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
    queryset = Deductions.objects.all()
    serializer_class = DeductionsSerializer
    pagination_class = PageNumberPagination
    pagination_class.page_size = 10

    def get_queryset(self):
        worker_id = self.kwargs['user']
        queryset = Deductions.objects.filter(user_id=worker_id).order_by(F('id')).reverse()
        page_size = self.request.query_params.get('page_size')
        if page_size:
            self.pagination_class.page_size = int(page_size)
        return queryset


class DeductionsGetTotalPagesSerializer(generics.RetrieveAPIView):
    serializer_class = DeductionsGetTotalPagesSerializer
    page_size = 10

    def get_object(self):
        worker_id = self.kwargs['user']
        total_items = Deductions.objects.filter(user_id=worker_id).count()
        total_pages = (total_items + self.page_size - 1) // self.page_size
        return {'total_pages': total_pages}


class ExtractsForWorkerList(generics.ListAPIView):
    serializer_class = ExtractsSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

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

        date_start = datetime.strptime(data['date_start'], '%Y-%m-%d')
        date_end = datetime.strptime(data['date_end'], '%Y-%m-%d') + timedelta(days=1)
        consumables_sum = Deductions.objects.filter(user=user,
                                                    date__range=[date_start, date_end]).aggregate(
            Sum('cost_of_consumables'))
        amount_of_consumables = consumables_sum['cost_of_consumables__sum'] or 0

        # Расчет суммы для amount_commission_for_deposits
        temp = Deductions.objects.filter(user=user, date__range=[date_start, date_end])
        for _ in temp:
            print(_.commission_for_deposits, _.date)
        commission_sum = Deductions.objects.filter(user=user,
                                                   date__range=[date_start, date_end]).aggregate(
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
