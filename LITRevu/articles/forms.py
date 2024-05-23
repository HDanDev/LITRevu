from django import forms
from .models import Article, Ticket, Comment, Tag

class ArticleForm(forms.ModelForm):
    tags = forms.CharField(required=False, help_text='Enter tags separated by commas.')
        
    class Meta:
        model = Article
        fields = ['title', 'content', 'cover_image', 'miniature_image', 'tags']
        
    def save(self, *args, **kwargs):
        instance = super().save(*args, **kwargs)
        tags_str = self.cleaned_data['tags']
        tag_names = [name.strip() for name in tags_str.split(',')]
        tag_objs = [Tag.objects.get_or_create(name=name)[0] for name in tag_names]
        instance.tags.set(tag_objs)
        return instance

class TicketForm(forms.ModelForm):
    create_article = forms.BooleanField(required=False, label='Create an article')
    article_title = forms.CharField(max_length=200, required=False)
    article_content = forms.CharField(widget=forms.Textarea, required=False)
    article_cover_image = forms.ImageField(required=False)
    article_tags = forms.CharField(required=False, help_text='Enter tags separated by commas.')

    class Meta:
        model = Ticket
        fields = ['title', 'description', 'image']

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
