document.addEventListener('DOMContentLoaded', function() {
  const createArticleCheckbox = document.getElementById('id_create_article');
  const articleFields = document.getElementById('article_fields');

  createArticleCheckbox.addEventListener('change', function() {
      if (createArticleCheckbox.checked) {
          articleFields.style.display = 'block';
      } else {
          articleFields.style.display = 'none';
      }
  });

  if (createArticleCheckbox.checked) {
      articleFields.style.display = 'block';
  } else {
      articleFields.style.display = 'none';
  }
});
