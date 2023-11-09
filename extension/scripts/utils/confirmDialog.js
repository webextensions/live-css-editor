import './confirmDialog.css';
const confirmDialog = function (message) {
    return new Promise((resolve) => {
        const dialog = document.createElement('dialog');
        dialog.className = 'magicCssConfirmDialog';
        dialog.style.padding = '0';
        dialog.innerHTML = `
            <div style="padding:20px;font-size:16px;font-family:sans-serif;">
                <div>
                    ${message}
                </div>
                <div style="display:flex;margin-top:25px;">
                    <div style="margin-left:auto;">
                        <button id="magicCssConfirmDialogButtonCancel">
                            Cancel
                        </button>
                    </div>
                    <div style="margin-left:10px;">
                        <button id="magicCssConfirmDialogButtonOk" autofocus>
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        `;
        dialog.addEventListener('click', (evt) => {
            if (evt.target.id === 'magicCssConfirmDialogButtonOk') {
                resolve(true);
                dialog.close();
            } else if (
                evt.target.id === 'magicCssConfirmDialogButtonCancel' ||
                evt.target === dialog
            ) {
                resolve(false);
                dialog.close();
            }
        });
        document.body.appendChild(dialog);
        dialog.showModal();
    });
};

export { confirmDialog };
