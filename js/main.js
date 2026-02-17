function show(id){
  document.querySelectorAll(".cipher-box")
    .forEach(x=>x.style.display="none");
  document.getElementById(id).style.display="block";
}

function toggleDropdown(dropdownId){
  const el = document.getElementById(dropdownId);
  if(!el) return;
  el.classList.toggle('open');
}

function selectTopic(cipherId, label, btnEl){
  show(cipherId);

  document.querySelectorAll('.topic-btn')
    .forEach(b => b.classList.remove('active'));
  if(btnEl) btnEl.classList.add('active');

  const dropdown = document.getElementById('exercise1');
  if(dropdown) dropdown.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  const defaultBtn = document.querySelector(".topic-btn[onclick*=\"selectTopic('vig'\"]");
  selectTopic('vig', 'Vigenère', defaultBtn);
});
