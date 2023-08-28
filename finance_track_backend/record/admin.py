from django.contrib import admin
from .models import *


class SearchForDeductionsModelAdmin(admin.ModelAdmin):
    list_display = ['user', 'tag', 'date']
    search_fields = ['user__username', 'tag__name', 'date']

admin.site.register(Tags)
admin.site.register(Assignees)
admin.site.register(Deductions, SearchForDeductionsModelAdmin)
admin.site.register(Weeks)