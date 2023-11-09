import './confirmDialog.css';
const confirmDialog = function (message) {
    return new Promise((resolve) => {
        const dialog = document.createElement('dialog');
        dialog.className = 'magicCssConfirmDialog';
        dialog.style.padding = '10px 20px';
        dialog.style.margin = 'auto'; // Required for some cases where style `* { margin: 0 }` is set
        dialog.innerHTML = `
            <div style="padding:20px;font-size:16px;font-family:sans-serif;">
                <div style="text-align:left;font-size:18px;line-height:1.2;">
                    ${message}
                </div>
                <div style="display:flex;margin-top:35px;">
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
                dialog.remove();
            } else if (
                evt.target.id === 'magicCssConfirmDialogButtonCancel' ||
                evt.target === dialog
            ) {
                resolve(false);
                dialog.close();
                dialog.remove();
            }
        });
        document.body.appendChild(dialog);
        dialog.showModal();
    });
};

export { confirmDialog };
