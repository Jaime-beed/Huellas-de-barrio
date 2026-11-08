export function showStep(stepId) {
  const steps = document.querySelectorAll('.step-card');
  steps.forEach(step => {
    step.classList.remove('active-step');
    step.classList.add('hidden-step');
  });

  const targetStep = document.getElementById(stepId);
  if (targetStep) {
    targetStep.classList.remove('hidden-step');
    targetStep.classList.add('active-step');
  }
}

// Ocultar / Mostrar Contraseña
const btnTogglePwd = document.getElementById('btn-toggle-pwd');
const loginPwdInput = document.getElementById('login-password');

btnTogglePwd?.addEventListener('click', () => {
  const isPassword = loginPwdInput.type === 'password';
  loginPwdInput.type = isPassword ? 'text' : 'password';
  btnTogglePwd.innerHTML = isPassword ? '<i class="fas fa-eye-slash text-sm"></i>' : '<i class="fas fa-eye text-sm"></i>';
});

// Selector de Experiencia
const radioExpSi = document.getElementById('radio-exp-si');
const radioExpNo = document.getElementById('radio-exp-no');
const wrapperExperiencia = document.getElementById('wrapper-experiencia');

radioExpSi?.addEventListener('change', () => wrapperExperiencia?.classList.remove('hidden'));
radioExpNo?.addEventListener('change', () => wrapperExperiencia?.classList.add('hidden'));