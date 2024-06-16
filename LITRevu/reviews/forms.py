from django import forms
from reviews.models import Review

class ReviewForm(forms.ModelForm):
    rating = forms.IntegerField(widget=forms.HiddenInput(), initial=0, required=False)
    
    class Meta:
        model = Review
        fields = ['title', 'content', 'rating', 'cover_image']