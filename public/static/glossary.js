/**
 * 用語集検索機能
 */
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('glossary-search');
  const totalTermsSpan = document.getElementById('total-terms');
  const allTerms = document.querySelectorAll('.border-l-4.border-primary');
  
  // 総用語数を表示
  if (totalTermsSpan && allTerms.length > 0) {
    totalTermsSpan.textContent = '全' + allTerms.length + '語';
  }
  
  // 検索機能
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      let visibleCount = 0;
      
      allTerms.forEach(function(termDiv) {
        const termTitle = termDiv.querySelector('h4');
        const termContent = termDiv.querySelector('p');
        
        if (termTitle && termContent) {
          const titleText = termTitle.textContent.toLowerCase();
          const contentText = termContent.textContent.toLowerCase();
          
          if (titleText.includes(searchTerm) || contentText.includes(searchTerm)) {
            termDiv.style.display = 'block';
            visibleCount++;
          } else {
            termDiv.style.display = 'none';
          }
        }
      });
      
      // 検索結果を表示
      if (totalTermsSpan) {
        if (searchTerm) {
          totalTermsSpan.textContent = visibleCount + '件の検索結果（全' + allTerms.length + '語）';
        } else {
          totalTermsSpan.textContent = '全' + allTerms.length + '語';
        }
      }
    });
  }
  
  console.log('[GLOSSARY] Search initialized:', allTerms.length, 'terms');
});
