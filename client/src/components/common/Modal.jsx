import { Fragment, useEffect, useRef } from "react";

function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isOpen && event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Fragment>
      {isOpen ? (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto'
          tabIndex='-1'
          ref={modalRef}
        >
          <div className='fixed inset-0 bg-gray-900 opacity-50'></div>
          <div className='relative z-50 w-full max-w-lg mx-auto my-6'>
            {/*content*/}
            <div className='relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none'>
              {/*header*/}
              <div className='flex items-start justify-between py-1 px-5 border-b border-solid border-gray-300 rounded-t'>
                <h3 className='text-md w-full my-auto text-center mx-auto font-semibold h-8 overflow-hidden'>
                  {title}
                </h3>
                <button
                  className='p-1 m-auto bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none'
                  onClick={onClose}
                >
                  ×
                </button>
              </div>
              {/*body*/}
              <div className='relative px-6 py-3 flex-auto'>{children}</div>
            </div>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
}

export default Modal;
