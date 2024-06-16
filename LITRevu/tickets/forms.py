from django import forms
from tickets.models import Ticket
from tags.models import Tag

class TicketForm(forms.ModelForm):
    tags = forms.CharField(required=False, help_text='Enter tags separated by commas.')
    create_review = forms.BooleanField(required=False, label='Create an review')
    review_title = forms.CharField(max_length=200, required=False)
    review_content = forms.CharField(widget=forms.Textarea, required=False)
    review_cover_image = forms.ImageField(required=False)
    review_rating = forms.IntegerField(widget=forms.HiddenInput(), initial=0, required=False)
    
    class Meta:
        model = Ticket
        fields = ['title', 'description', 'tags', 'image', 'create_review', 'review_title', 'review_content', 'review_rating', 'review_cover_image']

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.save()

        tags_str = self.cleaned_data['tags']
        tag_names = [name.strip() for name in tags_str.split(',') if name.strip()]
        tag_names.append(instance.title)
        tag_objs = [Tag.objects.get_or_create(name=name)[0] for name in tag_names]
        instance.tags.set(tag_objs)

        return instance
    
class TicketUpdateForm(forms.ModelForm):
    class Meta:
        model = Ticket
        fields = ['title', 'description', 'image'] 
