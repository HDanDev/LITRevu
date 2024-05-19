from django import forms
from articles.models import Article, Comment

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ['title', 'content', 'cover_image', 'miniature_image', 'tags']
        widgets = {
            'tags': forms.CheckboxSelectMultiple,
        }

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']