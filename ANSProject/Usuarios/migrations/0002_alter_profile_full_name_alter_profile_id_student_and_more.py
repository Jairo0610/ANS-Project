# Generated by Django 5.2.3 on 2025-06-21 02:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Usuarios', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='full_name',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='profile',
            name='id_student',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='profile',
            name='image',
            field=models.ImageField(upload_to='profile_images/'),
        ),
    ]
