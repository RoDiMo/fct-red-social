# Generated by Django 4.1.7 on 2023-04-22 14:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_alter_comentarios_post'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuarios',
            name='telefono',
            field=models.CharField(default='', max_length=50, unique=True),
        ),
    ]