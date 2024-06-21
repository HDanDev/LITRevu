from django import forms
from reviews.models import Review

class ReviewForm(forms.ModelForm):
    rating = forms.IntegerField(widget=forms.HiddenInput(), initial=0, required=True)
    
    class Meta:
        model = Review
        fields = ['title', 'content', 'rating', 'cover_image']
        
    def clean_rating(self):
        rating = self.cleaned_data['rating'] if self.cleaned_data['rating'] else 0
        return rating