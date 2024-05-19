# Generated by Django 5.0.6 on 2024-05-19 22:46

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("articles", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Tag",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name="article",
            name="cover_image",
            field=models.ImageField(blank=True, null=True, upload_to="cover_images/"),
        ),
        migrations.AddField(
            model_name="article",
            name="miniature_image",
            field=models.ImageField(
                blank=True, null=True, upload_to="miniature_images/"
            ),
        ),
        migrations.AddField(
            model_name="article",
            name="tags",
            field=models.ManyToManyField(
                blank=True, related_name="articles", to="articles.tag"
            ),
        ),
    ]
