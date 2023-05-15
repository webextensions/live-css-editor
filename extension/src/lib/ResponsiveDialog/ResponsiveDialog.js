import React from 'react';

import PropTypes from 'prop-types';

import Button from '@mui/material/Button/index.js';
import Dialog from '@mui/material/Dialog/index.js';
import DialogContent from '@mui/material/DialogContent/index.js';
import DialogTitle from '@mui/material/DialogTitle/index.js';
// import useMediaQuery from '@mui/material/useMediaQuery/index.js';
// import { useTheme } from '@mui/material/styles/index.js';
import IconButton from '@mui/material/IconButton/index.js';
import CloseIcon from '@mui/icons-material/Close.js';

const DialogTitleWithClose = (props) => {
    const { children } = props;
    return (
        <DialogTitle className={'ResponsiveDialogTitle'}>
            <div>{children}</div>
        </DialogTitle>
    );
};

DialogTitleWithClose.propTypes = {
    children: PropTypes.node.isRequired
};

function ResponsiveDialog(props) {
    // const theme = useTheme();
    // const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    let closable = true;
    if (props.closable === false) {
        closable = false;
    }

    const { title } = props;

    const { noPrimaryButton } = props;
    const showPrimaryButton = !noPrimaryButton;

    let primaryButtonDisabled = false;
    if (props.primaryButtonDisabled === true) {
        primaryButtonDisabled = true;
    }

    return (
        <div>
            <Dialog
                width="xl"
                // maxWidth="xl"
                // fullScreen={fullScreen}
                // fullScreen
                fullWidth
                open={props.open}
                onClose={props.onClose}
                // disableEnforceFocus={true} // Useful while using Magic CSS

                // // Removed in MUI v5
                // // https://mui.com/guides/migration-v4/#modal
                // // https://stackoverflow.com/questions/69991556/mui-v5-disablebackdropclick-in-createtheme-equivalent/69992442#69992442
                // disableBackdropClick={props.disableBackdropClick}

                // style={props.style}

                // Set max width to false to disable maxWidth
                // https://mui.com/api/dialog/#props
                maxWidth={"80%"}
                style={{
                    // maxWidth: '80%'
                }}
                // paperFullWidth="80%"
            >
                <DialogTitleWithClose onClose={props.onClose}>
                    <div style={{ display: 'flex' }}>
                        {
                            title &&
                            <div>
                                {title}
                            </div>
                        }
                        {
                            showPrimaryButton &&
                            <div style={{ marginLeft: 'auto' }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={props.primaryButtonOnClick}
                                    disabled={primaryButtonDisabled}
                                >
                                    {props.primaryButtonText || 'OK'}
                                </Button>
                            </div>
                        }
                        {
                            closable &&
                            <div style={{ marginLeft: 'auto' }}>
                                <IconButton
                                    size="small"
                                    onClick={props.onClose}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        }
                    </div>
                </DialogTitleWithClose>
                <DialogContent style={{ marginBottom: 16 }}>
                    {props.children}
                </DialogContent>
            </Dialog>
        </div>
    );
}

ResponsiveDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    closable: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    disableBackdropClick: PropTypes.bool,
    title: PropTypes.node,
    noPrimaryButton: PropTypes.bool,
    primaryButtonOnClick: PropTypes.func,
    primaryButtonDisabled: PropTypes.bool,
    primaryButtonText: PropTypes.string,
    children: PropTypes.node.isRequired
};

export { ResponsiveDialog };
