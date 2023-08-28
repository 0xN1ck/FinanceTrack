from rest_framework import serializers
from .models import Tags, Assignees, Deductions, Weeks
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
    class Meta:
        model = Deductions
        depth = 2
        fields = ('id', 'user', 'tag', 'cost_of_consumables', 'amount_of_deposits', 'commission_for_deposits',
                  'assignee', 'date')


class WeeksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weeks
        fields = ('id', 'user_id', 'date_start', 'date_end', 'payment', 'income', 'expense', 'amount_of_consumables',
                  'amount_commission_for_deposits', 'debt', 'total')
