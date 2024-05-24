document.addEventListener('DOMContentLoaded', function() {
  const createReviewCheckbox = document.getElementById('id_create_review');
  const reviewFields = document.getElementById('review_fields');

  createReviewCheckbox.addEventListener('change', function() {
      if (createReviewCheckbox.checked) {
          reviewFields.style.display = 'block';
      } else {
          reviewFields.style.display = 'none';
      }
  });

  if (createReviewCheckbox.checked) {
      reviewFields.style.display = 'block';
  } else {
      reviewFields.style.display = 'none';
  }
});
