# Generated by Django 4.1.7 on 2023-03-27 17:49

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comentarios',
            name='fecha_creacion',
            field=models.DateTimeField(default=datetime.datetime(2023, 3, 27, 17, 49, 30, 636517, tzinfo=datetime.timezone.utc)),
        ),
        migrations.AlterField(
            model_name='notificacionesamistad',
            name='fecha_notificacion',
            field=models.DateTimeField(default=datetime.datetime(2023, 3, 27, 17, 49, 30, 636517, tzinfo=datetime.timezone.utc)),
        ),
        migrations.AlterField(
            model_name='posts',
            name='fecha_publicacion',
            field=models.DateTimeField(default=datetime.datetime(2023, 3, 27, 17, 49, 30, 636517, tzinfo=datetime.timezone.utc)),
        ),
    ]