# Generated by Django 5.2.3 on 2025-06-21 03:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Usuarios', '0004_customuser_delete_profile'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='is_active',
        ),
    ]
