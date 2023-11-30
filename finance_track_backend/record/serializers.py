from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Tags, Assignees, Deductions, Extracts
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = ('id', 'name')


class AssigneesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Assignees
        fields = ('id', 'user')


class DeductionsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    assignee = AssigneesSerializer(read_only=True)
    tag = TagsSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(is_superuser=False), source='user')
    assignee_id = serializers.SlugRelatedField(slug_field='id', queryset=Assignees.objects.all(), source='assignee')
    tag_id = serializers.SlugRelatedField(slug_field='id', queryset=Tags.objects.all(), source='tag')

    class Meta:
        model = Deductions
        depth = 2
        fields = ('id', 'user', 'tag', 'cost_of_consumables', 'amount_of_deposits', 'commission_for_deposits',
                  'assignee', 'date', 'user_id', 'assignee_id', 'tag_id')


class DeductionsGetTotalPagesSerializer(serializers.Serializer):
    total_pages = serializers.IntegerField()


class ExtractsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(is_superuser=False), source='user')
    amount_of_consumables = serializers.DecimalField(read_only=True, max_digits=20, decimal_places=2)
    amount_commission_for_deposits = serializers.DecimalField(read_only=True, max_digits=20, decimal_places=2)
    total = serializers.DecimalField(read_only=True, max_digits=20, decimal_places=2)

    class Meta:
        model = Extracts
        depth = 2
        fields = ('id', 'user', 'date_start', 'date_end', 'payment', 'income', 'expense', 'amount_of_consumables',
                  'amount_commission_for_deposits', 'debt', 'total', 'user_id')


class ExtractsGetTotalPagesSerializer(serializers.Serializer):
    total_pages = serializers.IntegerField()


# class ExtractsSerializer(serializers.ModelSerializer):
#     user = serializers.PrimaryKeyRelatedField(read_only=True)
#
#     class Meta:
#         model = Extracts
#         fields = ('__all__',)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_admin'] = user.is_superuser
        token['email'] = user.email
        token['username'] = user.username
        return token
