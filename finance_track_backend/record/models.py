from django.db import models
from django.contrib.auth.models import User


class Tags(models.Model):
    class Meta:
        verbose_name_plural = 'Tags'

    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Assignees(models.Model):
    class Meta:
        verbose_name_plural = 'Assignees'

    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'is_superuser': True})

    def __str__(self):
        return self.user.username


class Deductions(models.Model):
    class Meta:
        verbose_name_plural = 'Deductions'

    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'is_superuser': False})
    tag = models.ForeignKey(Tags, on_delete=models.PROTECT)
    cost_of_consumables = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    amount_of_deposits = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    commission_for_deposits = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    assignee = models.ForeignKey(Assignees, on_delete=models.PROTECT)
    date = models.DateTimeField()

    def __str__(self):
        return self.user.username


class Extracts(models.Model):
    class Meta:
        verbose_name_plural = 'Extracts'

    user = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'is_superuser': False})
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()
    payment = models.DecimalField(max_digits=20, decimal_places=2)
    income = models.DecimalField(max_digits=20, decimal_places=2)
    expense = models.DecimalField(max_digits=20, decimal_places=2)
    amount_of_consumables = models.DecimalField(max_digits=20, decimal_places=2)
    amount_commission_for_deposits = models.DecimalField(max_digits=20, decimal_places=2)
    debt = models.DecimalField(max_digits=20, decimal_places=2)
    total = models.DecimalField(max_digits=20, decimal_places=2)

    def __str__(self):
        return self.user.username
