// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();


  let flag = 0; // switch off
  let toggle = document.getElementById("flexSwitchCheckReverse");
  
  toggle.addEventListener("change", () => {
    let taxSwitchElements = document.querySelectorAll(".tax-switch");
    taxSwitchElements.forEach((taxSwitch) => {
      if (flag === 0) {
        taxSwitch.classList.remove("invisible");
        taxSwitch.classList.add("visible");
      } else {
        taxSwitch.classList.remove("visible");
        taxSwitch.classList.add("invisible");
      }
    });
  
    // Toggle the flag
    flag = 1 - flag;
  });
  