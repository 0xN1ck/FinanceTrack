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
    tag = TagsSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(is_superuser=False),     source='user')
    assignee_id = serializers.SlugRelatedField(slug_field='id', queryset=Assignees.objects.all(), source='assignee')
    tag_id = serializers.SlugRelatedField(slug_field='id', queryset=Tags.objects.all(), source='tag')

    class Meta:
        model = Deductions
        depth = 2
        fields = ('id', 'user', 'tag', 'cost_of_consumables', 'amount_of_deposits', 'commission_for_deposits',
                  'assignee', 'date', 'user_id', 'assignee_id', 'tag_id')
    
    # user = UserSerializer(read_only=True)
    # assignee = AssigneesSerializer(read_only=True)
    # tag = TagsSerializer(read_only=True)
    # user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(is_superuser=False))
    # assignee_id = serializers.SlugRelatedField(slug_field='id', queryset=Assignees.objects.all())
    # tag_id = serializers.SlugRelatedField(slug_field='id', queryset=Tags.objects.all())
    # class Meta:
    #     model = Deductions
    #     depth = 2
    #     fields = ('id', 'user', 'tag', 'cost_of_consumables', 'amount_of_deposits', 'commission_for_deposits',
    #               'assignee', 'date', 'user_id', 'assignee_id', 'tag_id')


class WeeksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weeks
        fields = ('id', 'user_id', 'date_start', 'date_end', 'payment', 'income', 'expense', 'amount_of_consumables',
                  'amount_commission_for_deposits', 'debt', 'total')
