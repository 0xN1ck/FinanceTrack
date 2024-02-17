from rest_framework import generics
from rest_framework import viewsets
from datetime import datetime, timedelta
from django.db.models import Sum, F
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework import status
from rest_framework.exceptions import APIException
from django.utils import timezone


class UnauthorizedAccess(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'У вас нет разрешения на доступ к этому ресурсу.'
    default_code = 'unauthorized_access'


class TagsListCreate(generics.ListCreateAPIView):
    queryset = Tags.objects.all()
    serializer_class = TagsSerializer


class TagsRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
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


class ExtractsCreateList(generics.ListCreateAPIView):
    queryset = Extracts.objects.all().order_by(F('id')).reverse()
    serializer_class = ExtractsSerializer
    pagination_class = PageNumberPagination
    pagination_class.page_size = 12

    def get_queryset(self):
        queryset = super().get_queryset()
        page_size = self.request.query_params.get('page_size')
        if page_size:
            self.pagination_class.page_size = int(page_size)
        return queryset


class ExtractsGetTotalPages(generics.RetrieveAPIView):
    serializer_class = ExtractsGetTotalPagesSerializer
    page_size = 12

    def get_object(self):
        total_items = Extracts.objects.count()
        total_pages = (total_items + self.page_size - 1) // self.page_size
        return {'total_pages': total_pages}


class UserExtractsTotalPagesUser(generics.RetrieveAPIView):
    serializer_class = ExtractsGetTotalPagesUserSerializer
    page_size = 12

    def get_object(self):
        user_id = int(self.kwargs.get('user_id'))  # Получаем идентификатор пользователя из URL
        total_items = Extracts.objects.filter(user_id=user_id).count()
        total_pages = (total_items + self.page_size - 1) // self.page_size
        return {'total_pages': total_pages}


class ExtractsRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Extracts.objects.all()
    serializer_class = ExtractsSerializer

    def perform_update(self, serializer):
        data = self.request.data

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

        payment = 0.0
        if total > 0:
            payment = float(total * 0.3)

        # Обновление данных в объекте Extracts
        serializer.save(
            user=user,
            amount_of_consumables=amount_of_consumables * -1,
            amount_commission_for_deposits=amount_commission_for_deposits * -1,
            total=total,
            payment=payment
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class ExtractsForWorkerList(generics.ListAPIView):
    serializer_class = ExtractsSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    pagination_class = PageNumberPagination
    pagination_class.page_size = 12

    def get_queryset(self):
        page_size = self.request.query_params.get('page_size')
        if page_size:
            self.pagination_class.page_size = int(page_size)
        worker_id = self.kwargs['user']
        queryset = Extracts.objects.filter(user_id=worker_id).order_by('-id')
        return queryset


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

        payment = 0.0
        if total > 0:
            payment = float(total * 0.3)

        # Создание нового объекта Extracts
        extract = Extracts.objects.create(
            user=user,
            date_start=data['date_start'],
            date_end=data['date_end'],
            payment=payment,
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


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserWorkerList(generics.ListAPIView):
    queryset = User.objects.filter(is_superuser=False)
    serializer_class = UserSerializer


class UserWorkerDetail(generics.RetrieveAPIView):
    queryset = User.objects.filter(is_superuser=False)
    serializer_class = UserSerializer
    lookup_field = 'id'


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class GetStats(generics.RetrieveAPIView):
    serializer_class = GetStatsSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Extracts.objects.filter(user_id=user_id)

    def get_object(self):
        queryset = self.get_queryset()
        total = queryset.aggregate(
            total_income=Sum('income'),
            total_expense=Sum('expense'),
            total_amount_of_consumables=Sum('amount_of_consumables'),
            total_amount_commission_for_deposits=Sum('amount_commission_for_deposits'),
            total_debt=Sum('debt'),
            total=Sum('total')
        )
        return total

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user_id = self.kwargs['user_id']
        if not request.user.is_superuser and int(user_id) != request.user.id:
            raise UnauthorizedAccess()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class GetStatsAll(generics.ListAPIView):
    serializer_class = GetStatsSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Extracts.objects.all()

    def list(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            raise UnauthorizedAccess()

        queryset = self.get_queryset()
        total = queryset.aggregate(
            total_income=Sum('income'),
            total_expense=Sum('expense'),
            total_amount_of_consumables=Sum('amount_of_consumables'),
            total_amount_commission_for_deposits=Sum('amount_commission_for_deposits'),
            total_debt=Sum('debt'),
            total=Sum('total')
        )

        users_stats = queryset.values(
            'user_id'
        ).annotate(
            total_income=Sum('income'),
            total_expense=Sum('expense'),
            total_amount_of_consumables=Sum('amount_of_consumables'),
            total_amount_commission_for_deposits=Sum('amount_commission_for_deposits'),
            total_debt=Sum('debt'),
            total=Sum('total')
        )

        serializer = self.get_serializer(users_stats, many=True)
        response_data = {
            'total': total,
            'users_stats': serializer.data
        }
        return Response(response_data)
