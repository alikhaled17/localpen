interface ModalOptions {
  size?: 'large' | 'small';
  closeButton?: boolean;
  skipClickOutside?: boolean;
}

export const createModal = () => {
  const overlay = document.querySelector('#overlay') as HTMLElement;
  const modalContainer = document.querySelector('#modal-container') as HTMLElement;
  const modal = document.querySelector('#modal') as HTMLElement;
  let skipClickOut = false;

  const show = (
    container: Element,
    { size = 'large', closeButton = false, skipClickOutside = false }: ModalOptions = {},
  ) => {
    modal.innerHTML = '';
    modal.className = size;
    modal.appendChild(container);

    if (closeButton) {
      const closeContainer = document.createElement('div');
      closeContainer.className = 'close-container';
      const closeBtn = document.createElement('button');
      closeBtn.className = 'button';
      closeBtn.innerHTML = 'Close';
      closeBtn.onclick = close;
      closeContainer.appendChild(closeBtn);
      modal.appendChild(closeContainer);
    }

    overlay.style.display = 'flex';
    modalContainer.style.display = 'flex';
    modal.style.display = 'flex';
    overlay.classList.remove('hidden');
    modalContainer.classList.remove('hidden');
    skipClickOut = skipClickOutside;
    setTimeout(() => {
      document.addEventListener('click', clickOutside, false);
    });
  };

  const close = () => {
    modal.innerHTML = '';
    modal.className = '';
    overlay.classList.add('hidden');
    modalContainer.classList.add('hidden');
    modal.style.display = 'none';
    document.removeEventListener('click', clickOutside, false);
    setTimeout(() => {
      overlay.style.display = 'none';
      modalContainer.style.display = 'none';
    }, 400);
  };

  function clickOutside(event: Event) {
    if (!modal.contains(event.target as Node) && !skipClickOut) {
      close();
    }
    skipClickOut = false;
  }

  return {
    show,
    close,
  };
};
