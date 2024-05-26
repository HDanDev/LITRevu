from django import forms
from reviews.models import Review
from tickets.models import Ticket
from tags.models import Tag
from comments.models import Comment

class ReviewForm(forms.ModelForm):
    tags = forms.CharField(required=False, help_text='Enter tags separated by commas.')
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]  
    rating = forms.ChoiceField(choices=RATING_CHOICES, widget=forms.RadioSelect)
    
    class Meta:
        model = Review
        fields = ['title', 'content', 'rating','cover_image', 'miniature_image', 'tags']
        
    def save(self, *args, **kwargs):
        instance = super().save(*args, **kwargs)
        tags_str = self.cleaned_data['tags']
        tag_names = [name.strip() for name in tags_str.split(',')]
        tag_objs = [Tag.objects.get_or_create(name=name)[0] for name in tag_names]
        instance.tags.set(tag_objs)
        return instance

class TicketForm(forms.ModelForm):
    create_review = forms.BooleanField(required=False, label='Create an review')
    review_title = forms.CharField(max_length=200, required=False)
    review_content = forms.CharField(widget=forms.Textarea, required=False)
    review_cover_image = forms.ImageField(required=False)
    review_tags = forms.CharField(required=False, help_text='Enter tags separated by commas.')

    class Meta:
        model = Ticket
        fields = ['title', 'description', 'image']

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
